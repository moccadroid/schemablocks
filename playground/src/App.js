import {useState} from "react";
import Main from "./Main";
import Login from "./Login";
import 'react-quill/dist/quill.snow.css';
import {setAuthUser} from "schemablocks";

function App() {

  const [user, setUser] = useState(null);

  function handleLogin(user) {
    setAuthUser(user);
    setUser(user);
  }

  if (user) {
    return <Main />
  }

  return <Login onLogin={handleLogin}/>
}

export default App;
