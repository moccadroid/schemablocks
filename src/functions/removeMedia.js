import functions from "firebase-functions";
import admin from 'firebase-admin';
if (!admin.apps.length) {
  admin.initializeApp();
}

export default function removeMedia(config) {
  const storageFolder = config?.mediaLibrary?.storageFolder ?? "mediaLibrary";
  return functions.firestore.document(storageFolder + "/{mediaId}").onDelete(async(snap) => {

    const { type, id } = snap.data();
    const bucket = admin.storage().bucket();
    const folderPath = [storageFolder, type, id].join("/");
    await bucket.deleteFiles({ prefix: folderPath, force: true }, (err) => console.log(JSON.stringify(err)));

    return Promise.resolve();
  });
}
