import {useEffect, useState} from "react";
import {getFirebase} from "../lib/firebaseConfig";

export default function useSchemaBlocksData(query) {

  const firebase = getFirebase();
  const { collection, slug } = query;
  const [data, setData] = useState([]);
  const [docIds, setDocIds] = useState([]);

  useEffect(() => {
    (async () => {
      const blocks = [];
      const ids = [];
      const snapshot = await firebase.firestore().collection(collection).where("slug", "==", slug).get();
      snapshot.forEach(doc => {
        const docData = doc.data();
        const id = {id: doc.id, lang: docData.lang};
        blocks.push(docData);
        ids.push(id);
      });
      setDocIds(ids);
      setData(blocks);
    })();

  }, []);

  async function saveData(blocksData) {
    await Promise.all(blocksData.map(async block => {
      let docId = docIds.find(docId => docId.lang === block.lang);
      if (!docId) {
        docId = {};
        docId.lang = block.lang;
        docId.id = firebase.firestore().collection(collection).doc().id;
        setDocIds(ids => [...ids, docId]);
      }
      await firebase.firestore().collection(collection).doc(docId.id).set({
        ...block,
        slug
      });
    }));
    setData(blocksData);
  }

  async function deleteData() {
    return Promise.all(docIds.map(async docId => {
      return firebase.firestore().collection(collection).doc(docId.id).delete();
    }));
  }

  return [data, saveData, deleteData];
}