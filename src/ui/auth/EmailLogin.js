import React from "react";
import { useEffect, useState } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import {getConfiguration} from "../../lib/configuration";
import {Alert, Box} from "@material-ui/core";
import {setAuthUser} from "../../lib/auth";

export default function EmailLogin({ onLogin }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const firebase = getConfiguration().firebase;

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      setAuthUser(user);
      onLogin(user);
    });
  }, []);


  const handleLogin = (event) => {
    event.preventDefault();

    if (username !== '' && password !== '') {
      firebase.auth().signInWithEmailAndPassword(username, password).catch(error => {
        setError(error);
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
      <Box mt={2}>
        {error &&
          <Alert severity={"error"}>{error.message}</Alert>
        }
      </Box>
    </Container>
  );
}
