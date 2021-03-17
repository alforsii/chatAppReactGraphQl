import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Form, Container, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const SIGNUP_MUTATION = gql`
  mutation(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    signup(
      data: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      id
      email
    }
  }
`;

export const Signup = (props) => {
  console.log("🚀 ~ file: Signup.js ~ line 28 ~ Signup ~ props", props);
  const [state, setState] = useState({
    message: "",
    emailEl: React.createRef(),
    passwordEl: React.createRef(),
    firstNameEl: React.createRef(),
    lastNameEl: React.createRef(),
  });
  // 1. One way of setting contextType for the class component

  const [Signup] = useMutation(SIGNUP_MUTATION);

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const email = state.emailEl.current.value;
    const password = state.passwordEl.current.value;
    const firstName = state.firstNameEl.current.value;
    const lastName = state.lastNameEl.current.value;
    // console.log(email, password);

    if (
      email.trim().length === 0 ||
      password.trim().length === 0 ||
      firstName.trim().length === 0 ||
      lastName.trim().length === 0
    ) {
      return setState((prevState) => ({
        ...prevState,
        message: "All fields are mandatory!",
      }));
    }
    const newUser = { email, password, firstName, lastName };
    try {
      const { data, errors } = await Signup({ variables: newUser });
      if (!data) return null;
      if (errors?.length)
        return setState({ ...state, message: errors[0].message });
      props.updateState({ message: "Signup successful! Please login now." });
      props.history.push("/");
    } catch (err) {
      console.log("🚀 err", err);
      return setState({ ...state, message: err.message });
    }
  };

  return (
    <Container style={{ maxWidth: "400px" }}>
      <Form onSubmit={handleSignupSubmit}>
        <span style={{ padding: 10 }} className="red-text">
          {state.message && state.message}
        </span>
        <h2 className="primary_color">Signup</h2>
        <Form.Row>
          <Form.Control
            className="mb-2 mr-sm-2"
            type="email"
            ref={state.emailEl}
            placeholder="Email"
          />
          <Form.Control
            className="mb-2 mr-sm-2"
            type="password"
            ref={state.passwordEl}
            placeholder="Password"
          />
          <Form.Control
            className="mb-2 mr-sm-2"
            type="text"
            ref={state.firstNameEl}
            placeholder="First name"
          />
          <Form.Control
            className="mb-2 mr-sm-2"
            type="text"
            ref={state.lastNameEl}
            placeholder="Last name"
          />
          <Button type="submit" variant="outline-primary" className="mb-2">
            Signup
          </Button>
          <Form.Row>
            <Form.Check
              type="checkbox"
              disabled
              className="mb-2 ml-4 mr-sm-2"
              id="inlineFormCheck"
              label="Go to "
            />
            <NavLink to="/">Login</NavLink>
          </Form.Row>
        </Form.Row>
      </Form>
    </Container>
  );
};
