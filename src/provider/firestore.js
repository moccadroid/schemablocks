import {getFirebase} from "../lib/firebaseConfig";

export default async function fromFirestore(query) {
  if (query.collection) {
    const docs = [];
    const snapshot = await getFirebase().firestore().collection(query.collection).get();
    snapshot.forEach(doc => {
      const data = doc.data();
      data.id = doc.id;
      docs.push(data);
    });
    return docs;
  }
}