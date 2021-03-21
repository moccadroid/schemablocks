import {useEffect, useState} from "react";
import {getFirebase} from "../lib/firebaseConfig";

export default function useSchemaBlocksData(query, realtime = false) {

  const firebase = getFirebase();
  const { collection, slug } = query;
  const [data, setData] = useState([]);
  const [docIds, setDocIds] = useState([]);

  if (!collection || !slug) {
    return [];
  }

  useEffect(() => {
    if (realtime) {
      const unsubscribe = firebase.firestore().collection(collection).where("slug", "==", slug).onSnapshot(snapshot => {
        console.log("new realtime data");
        handleSnapshot(snapshot);
      });

      return () => unsubscribe();
    } else {
      firebase.firestore().collection(collection).where("slug", "==", slug).get().then(snapshot => {
        console.log("not realtime data");
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
        await firebase.firestore().collection(collection).doc(docId.id).set({
          ...block,
          slug
        });
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
