let mediaLibraryConfig = null;

export function setMediaLibraryConfig(config) {
  mediaLibraryConfig = config;
  if (!config.imageMagicUrl || !config.firestoreCollection) {
    console.error(
      `Missing Media Library Config. Necessary properties are: \n
        imageMagicUrl\n
        firestoreCollection
      `
      )
  }
}

export function getMediaLibraryConfig() {
  return mediaLibraryConfig;
}
