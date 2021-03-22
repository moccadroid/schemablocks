import 'react-quill/dist/quill.snow.css';
import firebase from "./firebase.config";
import RichTextInput from "./components/inputs/RichTextInput";
import {AppContainer, setFirebase, addControlInput, setMediaLibraryConfig} from "schemablocks";
import schemas from "./schemas";
import {Panel} from "schemablocks";
import {useState} from "react";
import {Box, Typography} from "@material-ui/core";

function App() {

  setFirebase(firebase);
  setMediaLibraryConfig({
    firestoreCollection: 'mediaLibrary',
    imageMagicUrl: process.env.REACT_APP_IMAGE_MAGIC_URL,
  });
  addControlInput("richText", RichTextInput);

  const [currentSlug, setCurrentSlug] = useState(null);

  const slugs = [
    { name: "Demo1", collection: "demoBlocks", slug: "demoBlocks1", schemas: schemas }
  ];

  const menuItems = slugs.map(slug => {
    return (
      <Box onClick={() => setCurrentSlug(slug)}>
        <Typography variant={"body1"}>{slug.name}</Typography>
      </Box>
    );
  });

  return (
    <AppContainer
      menuItems={menuItems}
      login={"email"}
    >
      <Panel slug={currentSlug} fixedBar={false}/>
    </AppContainer>
  );
}

export default App;
