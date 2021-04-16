import firebase from "./firebase.config";

export default {
  firebase: firebase,
  debug: true,
  mediaLibrary: {
    imageMagicUrl: process.env.REACT_APP_IMAGE_MAGIC_URL,
    imageMagicSizes: [200, 400, 800, 1200, 1600, 2000],
    collection: "mediaLibrary",
  },
  languages: [
    { name: "Deutsch", value: "de" },
    { name: "English", value: "en" },
  ]
}
