import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { NavLink, FormControl, Dropdown, Form } from "react-bootstrap";
import { Button, Modal, InputGroup } from "react-bootstrap";

import { AuthContext } from "../../context/AuthContext";

const DELETE_CHAT_QUERY = gql`
  mutation($chatId: ID!, $userId: ID!) {
    deleteChat(chatId: $chatId, userId: $userId) {
      id
      message
    }
  }
`;
const UPDATE_CHAT_QUERY = gql`
  mutation($chatId: ID!, $authorId: ID!, $chatName: String!) {
    updateChat(chatId: $chatId, authorId: $authorId, chatName: $chatName) {
      id
      chatName
    }
  }
`;

export const UserChatsDropdown = ({ chatId, history }) => {
  const [DeleteChat] = useMutation(DELETE_CHAT_QUERY);
  const [UpdateChat] = useMutation(UPDATE_CHAT_QUERY);
  const [smShow, setSmShow] = useState(false);
  const [smShow2, setSmShow2] = useState(false);
  const [chatName, setChatName] = useState("");

  return (
    <AuthContext.Consumer>
      {(ctx) => {
        const handleDeleteChat = async () => {
          try {
            setSmShow(false);
            const userId = ctx.state.user.id;
            console.log({ chatId, userId });
            const { data, errors } = await DeleteChat({
              variables: { chatId, userId },
            });
            if (!data) return;
            if (errors?.length) {
              return ctx.updateState({
                alertMessage: errors[0].message,
                alertSuccess: false,
                alertMessageId: "Error",
              });
            }
            setSmShow(false);

            ctx.updateState({
              alertMessage: data.deleteChat.message,
              alertSuccess: false,
              alertMessageId: data.deleteChat.id,
            });
            history.push("/chat");
          } catch (err) {
            console.log("🚀 err", err);
            setSmShow(false);
            ctx.updateState({
              alertMessage: err.message,
              alertSuccess: false,
              alertMessageId: `error-${Math.random() + 1}`,
            });
          }
        };

        const handleUpdateChat = async (e) => {
          e.preventDefault();
          console.log(chatName);
          setSmShow2(false);
          try {
            if (!chatName) {
              return;
            }
            const { data, errors } = await UpdateChat({
              variables: { chatId, authorId: ctx.state.user.id, chatName },
            });
            if (!data) return console.log("No data");
            if (errors?.length) {
              return ctx.updateState({
                alertMessage: errors[0].message,
                alertMessageId: data.updateChat.id,
                alertSuccess: true,
              });
            }

            setSmShow2(false);
            ctx.updateState({
              alertMessage: "ChatName Updated!",
              alertMessageId: data.updateChat.id,
              alertSuccess: true,
            });
            history.push("/chat");
          } catch (err) {
            setSmShow2(false);
            ctx.updateState({
              alertMessage: err.message,
              alertSuccess: false,
              alertMessageId: `error-${Math.random() + 1}`,
            });
            console.log(err);
          }
        };

        return (
          <React.Fragment>
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle}>•••</Dropdown.Toggle>

              <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Item>Open Chat</Dropdown.Item>
                <Dropdown.Item onClick={() => setSmShow2(true)}>
                  Rename
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSmShow(true)}>
                  Remove
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* Remove alert/confirm modal */}
            <Modal
              size="sm"
              show={smShow}
              onHide={() => {
                setSmShow(false);
              }}
              aria-labelledby="alert-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: 14 }} id="alert-modal">
                  By removing this chat all your messages will also be deleted!
                  Are you sure?
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ display: "flex" }}>
                <Button
                  className="mr-2"
                  variant="secondary"
                  onClick={() => setSmShow(false)}
                >
                  NO| Cancel
                </Button>
                <Button variant="danger" onClick={handleDeleteChat}>
                  YES| Remove
                </Button>
              </Modal.Body>
            </Modal>
            {/* Update Chat - modal */}
            <Modal
              size="sm"
              show={smShow2}
              onHide={() => {
                setSmShow2(false);
              }}
              aria-labelledby="alert-modal"
            >
              <Modal.Header closeButton>
                <Modal.Title style={{ fontSize: 14 }} id="alert-modal">
                  Update | Chat name
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ display: "flex" }}>
                <Form onSubmit={handleUpdateChat}>
                  <InputGroup className="mb-2 mr-sm-2">
                    <InputGroup.Prepend>
                      <InputGroup.Text>@</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      onChange={(e) => {
                        setChatName(e.target.value);
                      }}
                      value={chatName}
                      placeholder="ChatName..."
                      autoFocus
                    />
                  </InputGroup>
                  <Button
                    className="mr-2"
                    variant="secondary"
                    onClick={() => setSmShow2(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    type="submit"
                    // onClick={handleUpdateChat}
                  >
                    Update
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>
          </React.Fragment>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default withRouter(UserChatsDropdown);

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <NavLink
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </NavLink>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <FormControl
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);
