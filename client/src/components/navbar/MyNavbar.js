import React from "react";
import {
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Container,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function MyNavbar({ token, logout, username }) {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="#home">MyBrand</Navbar.Brand>
        <Nav className="mr-auto">
          <NavLink className="mr-2" to="/home">
            Home
          </NavLink>
          <NavLink className="mr-2" to="/chat">
            Chat
          </NavLink>
          <NavLink className="mr-2" to="/contact">
            Contact
          </NavLink>
        </Nav>
        {token ? (
          <Form inline>
            {/* <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button className="mr-sm-2" variant="outline-primary">
            Search
          </Button> */}
            <Navbar.Text>
              Logged as:{" "}
              <NavLink to="/user/profile" className="mr-sm-2">
                {username}
              </NavLink>
            </Navbar.Text>
            <Button
              onClick={() => logout()}
              className="mr-sm-2"
              variant="outline-primary"
            >
              Logout
            </Button>
          </Form>
        ) : (
          <>
            <NavLink to="/" className="mr-sm-2" variant="outline-primary">
              Login
            </NavLink>
            <NavLink to="/signup" className="mr-sm-2" variant="outline-primary">
              SignUp
            </NavLink>
          </>
        )}
      </Container>
    </Navbar>
  );
}
