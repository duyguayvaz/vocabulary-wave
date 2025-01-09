import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, CardBody, CardTitle, FormGroup, FormLabel, FormControl } from "react-bootstrap";

const Login = ({ onBackToMenu }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:1337/api/auth/local", {
        identifier,
        password,
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.jwt);
      alert("Login successful!");
    } catch (error) {
      console.error("Error during login:", error.response?.data || error);
      alert("Login failed. Check your credentials and try again.");
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle>Login Menu</CardTitle>
        <Form onSubmit={handleLogin}>
          <FormGroup controlId="formIdentifier">
            <FormLabel>Email or Username</FormLabel>
            <FormControl
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or username"
            />
          </FormGroup>
          <FormGroup controlId="formPassword">
            <FormLabel>Password</FormLabel>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormGroup>
          <Button variant="primary" type="submit">
            Login
          </Button>
          <Button variant="secondary" onClick={onBackToMenu} className="ml-2">
            Back
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Login;