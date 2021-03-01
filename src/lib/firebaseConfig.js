let firebase = null;

export function setFirebase(config) {
  firebase = config;
}

export function getFirebase() {
  return firebase;
}