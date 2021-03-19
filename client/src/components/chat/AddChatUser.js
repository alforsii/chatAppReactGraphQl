import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button, Modal, Form, Alert, Badge } from "react-bootstrap";

// otherUserId, chatId
const ADD_CHAT_USER_QUERY = gql`
  mutation($otherUserId: ID!, $chatId: ID!) {
    addChatUser(otherUserId: $otherUserId, chatId: $chatId) {
      id
      chatName
    }
  }
`;
const SEARCHED_USER_QUERY = gql`
  mutation($email: String!) {
    searchedUser(email: $email) {
      id
      email
      lastName
      firstName
    }
  }
`;

export default function AddChatUser({ chatId }) {
  const [lgShow, setLgShow] = useState(false);
  const [message, setMessage] = useState("");
  const [foundUser, setFoundUser] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [AddUser] = useMutation(ADD_CHAT_USER_QUERY);

  const [SearchedUser] = useMutation(SEARCHED_USER_QUERY);

  const handleSearchInput = async (e) => {
    try {
      setSearchInput(e.target.value);
      const { data, errors } = await SearchedUser({
        variables: { email: e.target.value },
      });
      if (!data) return setMessage("No user found!");
      if (errors?.length) return setMessage(errors[0].message);

      setFoundUser(data.searchedUser);
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!foundUser) return null;
    try {
      const { data, errors } = await AddUser({
        variables: {
          otherUserId: foundUser.id,
          chatId,
        },
      });
      if (!data) return null;
      if (errors?.length) return setMessage(errors[0].message);
      console.log("user added", data);
      setLgShow(false);
      setSearchInput("");
    } catch (err) {
      console.log(err);
      setMessage(err.message);
    }
  };

  return (
    <>
      {/* <Button
        style={{ float: "right" }}
        variant="link"
        onClick={() => setLgShow(true)}
      >
        Add user
      </Button> */}
      <Badge
        style={{
          float: "right",
          cursor: "pointer",
        }}
        onClick={() => setLgShow(true)}
        variant="primary"
      >
        +
      </Badge>
      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Add User | to current Chat room!
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUser}>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                value={searchInput}
                type="text"
                placeholder="Search by email..."
                onChange={handleSearchInput}
              />
              {foundUser?.id && !message ? (
                <>
                  <Alert variant={"primary"}>
                    {`We found ${foundUser.firstName} ${foundUser.lastName}. Would you like to add to the Chat? `}
                    <Button
                      type="submit"
                      variant="outline-primary"
                    >{`Add ${foundUser.firstName}?`}</Button>
                  </Alert>
                </>
              ) : (
                <>
                  <Alert variant={message ? "danger" : "warning"}>
                    {message
                      ? message
                      : `Sorry we didn't find anyone! Did you type? `}
                  </Alert>
                  <br />
                  <Form.Label>Or invite by mail address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>

                  <Button onClick={() => setLgShow(false)} variant="primary">
                    Send invitation
                  </Button>
                </>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
