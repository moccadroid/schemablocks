import defaultConfig from "../config";
let configuration = defaultConfig;

export function setConfiguration(config) {
  if (config) {
    const mediaLibrary = {
      ...configuration.mediaLibrary,
      ...config.mediaLibrary
    };
    configuration = {
      ...configuration,
      ...config,
      mediaLibrary
    };
  }
}

export function getConfiguration() {
  return configuration;
}
