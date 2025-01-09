import React, { useState } from "react";
import { Button, Card, CardBody, CardTitle } from "react-bootstrap";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";

function App() {
  const [login, setLogin] = useState(false);
  const [register, setRegister] = useState(false)

  const handleLogin = () => {
    setLogin(true);
  };

  const handleLoginBack = () => {
    setLogin(false);
  };

  const handleRegister = () => {
    setRegister(true)
  };
  const RegisterBack=()=>{
    setRegister(false)
  }
  if(register){
    return <Register onBackToMenu={RegisterBack}/>
  }

  if (login) {
    return <Login onBackToMenu={handleLoginBack} />;
  }

  return (
    <Card>
      <CardBody>
        <CardTitle>Welcome to Vocabulary Wave</CardTitle>
        <Button onClick={handleLogin}>Login</Button>
        <Button onClick={handleRegister}>Register</Button>
      </CardBody>
    </Card>
  );
}

export default App;
