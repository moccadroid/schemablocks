import {
  setMediaLibraryConfig,
  setFirebase,
  addControlInput,
  Panel
} from "schemablocks";
import firebase from "./firebase.config";
import schemas from "./schemas";
import jsonData from './data.json';
import RichTextInput from "./components/inputs/RichTextInput";
import {useState, useEffect} from "react";
import Preview from "./Preview";
import Button from "@material-ui/core/Button";

export default function Main() {

  setFirebase(firebase);
  setMediaLibraryConfig({
    firestoreCollection: 'mediaLibrary',
    imageMagicUrl: process.env.REACT_APP_IMAGE_MAGIC_URL,
  });
  addControlInput("richText", RichTextInput);

  const [showPreview, setShowPreview] = useState(false);
  const slugs = [
    { name: "Demo1", collection: "demoBlocks", slug: "demoBlocks1", schemas: schemas }
  ]

  useEffect(() => {
    if (window.location.pathname === "/preview") {
      setShowPreview(true);
    }
  }, []);

  useEffect(() => {
    togglePreview();
  }, [showPreview]);

  function togglePreview() {
    const url = new URL(window.location);
    if (showPreview) {
      url.pathname = "/preview";
    } else {
      url.pathname = "/";
    }
    history.replaceState({ id: "Demo" }, "Demo", url.toString());
  }

  if (showPreview) {
    return (
      <div>
        <div>
          <Button variant={"contained"} onClick={() => setShowPreview(false)}>Close Preview</Button>
        </div>
        <Preview />
      </div>
    )
  }

  return (
    <div>
      <Panel slugs={slugs} />
    </div>
  );
}
