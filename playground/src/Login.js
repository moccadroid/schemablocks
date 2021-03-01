import { useEffect, useState } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import firebase from "./firebase.config";
require('firebase/auth');

export default function Login({ onLogin }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      onLogin(user);
    });
  }, []);


  const handleLogin = (event) => {
    event.preventDefault();

    if (username !== '' && password !== '') {
      firebase.auth().signInWithEmailAndPassword(username, password).catch(error => {
        console.log(error);
        //setLoginError(true);
      });
    }
  };

  return (
    <Container>
      <form onSubmit={handleLogin}>
        <TextField
          label="Username"
          value={username}
          onChange={event => setUsername( event.target.value )}
          margin="normal"
          helperText="Username"
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Password"
          value={password}
          onChange={event => setPassword( event.target.value )}
          margin="normal"
          helperText="Password"
          variant="outlined"
          fullWidth
          type="password"
        />
        <Button variant="contained" color="primary" type="submit">Login</Button>
      </form>
    </Container>
  );
}
