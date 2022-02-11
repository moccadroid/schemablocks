import 'react-quill/dist/quill.snow.css';
import RichTextInput from "./components/inputs/RichTextInput";
import {AppContainer, addControlInput, setConfiguration } from "schemablocks";
import schemas from "./schemas";
import configuration from "./schemablocks.config";
import Demo from "./components/pages/Demo";

function App() {
  addControlInput("richText", RichTextInput);
  setConfiguration(configuration);

  const collections = [
    {
      name: "DemoBlocks",
      value: "demoBlocks",
      schemas: schemas,
      publish: true
    }
  ];

  const routes = [
    { name: "Demo", path: "/demo", component: Demo }
  ];

  async function authGate(user) {
    const db = configuration.firebase.firestore();
    const doc = await db.collection("roles").doc("admin").get();
    const data = doc.data();
    if (!data.userIds.includes(user.uid)) {
      configuration.firebase.auth().signOut();
    }
  }

  return (
    <div>
      <AppContainer routes={routes} collections={collections} login={"email"} pathPrefix={"/admin"} authGate={authGate}/>
    </div>
  )
}

export default App;
