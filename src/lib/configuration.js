import defaultConfig from "../config";
let configuration = defaultConfig;

export function setConfiguration(config) {
  if (config) {
    configuration = config;
  }
}

export function getConfiguration() {
  return configuration;
}
