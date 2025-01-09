import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Container, Row, Col, Card, CardBody, CardTitle, FormGroup, FormLabel, FormControl } from "react-bootstrap";

const Register = ({ onBackToMenu }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:1337/api/auth/local/register", {
        username,
        email,
        password,
      });
      console.log("Registration successful:", response.data);
      alert("Registration successful! Please log in.");
    } catch (error) {
      console.error("Error during registration:", error.response?.data || error);
      alert("Registration failed. Check your details and try again.");
    }
  };

  return (
    <Card>
      <CardBody>
        <CardTitle>Register Menu</CardTitle>
        <Form onSubmit={handleRegister}>
          <FormGroup controlId="formUsername">
            <FormLabel>Username</FormLabel>
            <FormControl
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </FormGroup>
          <FormGroup controlId="formEmail">
            <FormLabel>Email Address</FormLabel>
            <FormControl
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </FormGroup>
          <FormGroup controlId="formPassword">
            <FormLabel>Password</FormLabel>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </FormGroup>
          <Button variant="primary" type="submit">
            Register
          </Button>
          <Button variant="secondary" onClick={onBackToMenu} className="ml-2">
            Back
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Register;