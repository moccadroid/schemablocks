import useSchemaBlocksData from "./hooks/useSchemaBlocksData";
import useSchemaValidator from "./hooks/useSchemaValidator";
import useSchemas from "./hooks/useSchemas";

import {setAuthUser} from "./lib/auth";
import {setConfiguration} from "./lib/configuration";
import {addControlInput, getControlInputs} from "./lib/controlInputs";

import LanguageWrapper from "./ui/LanguageWrapper";
import Slug from "./ui/Slug";
import Panel from "./ui/Panel";
import AppContainer from "./ui/AppContainer";

export {
  useSchemaBlocksData,
  useSchemaValidator,
  useSchemas,
  // create useFragments

  setAuthUser,
  setConfiguration,
  addControlInput,
  getControlInputs,

  LanguageWrapper,
  Slug,
  Panel,
  AppContainer
}
