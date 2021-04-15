import defaultConfig from "../config";
let configuration = defaultConfig;

export function setConfiguration(config) {
  if (config) {
    const mediaLibrary = {
      ...configuration.mediaLibrary,
      ...config.mediaLibrary
    }
    configuration = {
      ...configuration,
      ...config,
      mediaLibrary
    };

    console.log(configuration);
  }
}

export function getConfiguration() {
  return configuration;
}
