import {useEffect, useState} from "react";
import {getConfiguration} from "../lib/configuration";

export default function useSchemaBlocksData(query, realtime = false) {

  const firebase = getConfiguration().firebase;
  const { collection, slug } = query;
  const [data, setData] = useState([]);
  const [docIds, setDocIds] = useState([]);

  if (!collection || !slug) {
    return [];
  }

  useEffect(() => {
    if (realtime) {
      const unsubscribe = firebase.firestore().collection(collection).where("slug", "==", slug).onSnapshot(snapshot => {
        handleSnapshot(snapshot);
      });

      return () => unsubscribe();
    } else {
      firebase.firestore().collection(collection).where("slug", "==", slug).get().then(snapshot => {
        handleSnapshot(snapshot);
      });
    }
  }, []);

  function handleSnapshot(snapshot) {
    const blocks = [];
    const ids = [];
    snapshot.forEach(doc => {
      const docData = doc.data();
      const id = {id: doc.id, lang: docData.lang};
      blocks.push(docData);
      ids.push(id);
    });
    setDocIds(ids);
    setData(blocks);
  }

  async function saveData(blocksData) {
    const errors = [];
    await Promise.all(blocksData.map(async block => {
      let docId = docIds.find(docId => docId.lang === block.lang);
      if (!docId) {
        docId = {};
        docId.lang = block.lang;
        docId.id = firebase.firestore().collection(collection).doc().id;
        setDocIds(ids => [...ids, docId]);
      }
      try {
        const doc = {
          ...block,
          slug
        }
        await firebase.firestore().collection(collection).doc(docId.id).set(doc);
      } catch (error) {
        errors.push(error);
      }
    }));
    if (errors.length > 0) {
      return errors;
    }
    setData(blocksData);
  }

  async function deleteData() {
    await Promise.all(docIds.map(async docId => {
      return firebase.firestore().collection(collection).doc(docId.id).delete();
    }));

    setData([]);
    setDocIds([]);
  }

  return [data, saveData, deleteData];
}
