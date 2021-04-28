import {getConfiguration} from "../lib/configuration";

export default async function fromFirestore(query) {
  const firebase = getConfiguration().firebase;
  const docs = [];
  let snapshot = null;

  if (query.collection && !query.slug) {
    snapshot = await firebase.firestore().collection(query.collection).get();
  }
  if (query.collection && query.slug) {
    snapshot = await firebase.firestore().collection(query.collection).where("slug", "==", query.slug).get();
  }
  if (query.collection && query.slug && query.lang) {
    snapshot = await firebase.firestore().collection(query.collection).where("slug", "==", query.slug).where("lang", "==", query.lang).get();
  }

  snapshot?.forEach(doc => {
    const data = doc.data();
    data.id = doc.id;
    docs.push(data);
  });

  return docs;
}
