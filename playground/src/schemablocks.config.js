import firebase from "./firebase.config";

export default {
  firebase: firebase,

  mediaLibrary: {
    imageMagicUrl: process.env.REACT_APP_IMAGE_MAGIC_URL,
    imageMagicSizes: [200, 400, 800, 1200, 1600, 2000],
    collection: "mediaLibrary",
  }
}
