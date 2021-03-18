import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { NavLink } from "react-router-dom";
import {
  Form,
  Container,
  FormControl,
  InputGroup,
  Button,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

import "./Login.css";

const LOGIN_QUERY = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      userId
    }
  }
`;

export const LoginForm = (props) => {
  const [Login] = useMutation(LOGIN_QUERY);
  const [errMessage, setErrMessage] = useState(null);
  const emailEl = React.createRef();
  const passwordEl = React.createRef();

  useEffect(() => {
    return () => {
      console.log("LOGIN CLEARED");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Consumer>
      {(context) => {
        const handleLoginSubmit = async (e) => {
          e.preventDefault();
          const email = emailEl.current.value;
          const password = passwordEl.current.value;

          if (email.trim().length === 0 || password.trim().length === 0) {
            setErrMessage("Please enter email and password!");
            return;
          }
          try {
            const { data } = await Login({ variables: { email, password } });

            if (!data?.login?.token) {
              return null;
            }
            const { userId, token } = data.login;
            console.log(data);

            context.getUserDetails(userId, token);
            // context.updateState({ token: data.login?.token });
            localStorage.setItem("token", JSON.stringify(data.login?.token));
            props.history.push("/chat");
          } catch (err) {
            return setErrMessage(err.message);
          }
        };

        return (
          <Container style={{ maxWidth: "400px" }}>
            <Form style={{ marginTop: "150px" }} onSubmit={handleLoginSubmit}>
              <span>{errMessage && errMessage}</span>
              <h2 className="primary_color">Login</h2>
              <InputGroup className="mb-2 mr-sm-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>@</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl placeholder="Email" required ref={emailEl} />
                <Form.Control.Feedback type="invalid">
                  Email is required!
                </Form.Control.Feedback>
              </InputGroup>
              <Form.Control
                className="mb-2 mr-sm-2"
                placeholder="Password"
                type="password"
                ref={passwordEl}
                required
              />

              <Form.Row>
                <Form.Check
                  type="checkbox"
                  className="mb-2 mr-sm-2"
                  id="inlineFormCheck"
                  label="Remember me "
                />
                <NavLink to="/signup">Signup</NavLink>
              </Form.Row>
              <Button type="submit" variant="outline-primary" className="mb-2">
                Login
              </Button>
            </Form>
          </Container>
        );
      }}
    </AuthContext.Consumer>
  );
};
