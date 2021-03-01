import {useState} from "react";
import Main from "./Main";
import Login from "./Login";

function App() {

  const [user, setUser] = useState(null);

  if (user) {
    return <Main />
  }

  return <Login onLogin={user => setUser(user)}/>
}

export default App;
