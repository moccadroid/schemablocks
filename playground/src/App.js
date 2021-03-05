import {useState} from "react";
import Main from "./Main";
import Login from "./Login";
import 'react-quill/dist/quill.snow.css';

function App() {

  const [user, setUser] = useState(null);

  if (user) {
    return <Main />
  }

  return <Login onLogin={user => setUser(user)}/>
}

export default App;
