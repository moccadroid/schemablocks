import {getConfiguration} from "../lib/configuration";

export default async function fromFirestore(query) {
  const firebase = getConfiguration().firebase;
  if (query.collection) {
    const docs = [];
    const snapshot = await firebase.firestore().collection(query.collection).get();
    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;
      docs.push(data);
    });
    return docs;
  }
}
