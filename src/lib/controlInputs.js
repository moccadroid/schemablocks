import React from "react";
import LinkInput from "../ui/input/LinkInput";
import MediaInput from "../ui/input/MediaInput";
import SelectInput from "../ui/input/SelectInput";

let controlInputs = {
  "link": LinkInput,
  "image": MediaInput,
  "video": MediaInput,
  "svg": MediaInput,
  "select": SelectInput,
};

export function addControlInput(type, input) {
  controlInputs[type] = input;
}

export function getControlInputForType(controlType, props) {
  const Component = controlInputs[controlType];
  if (Component) {
    return <Component {...props} />
  }
  return false;
}

export function getControlInputs() {
  return controlInputs;
}
