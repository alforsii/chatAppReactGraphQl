import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { NavLink, FormControl, Dropdown } from "react-bootstrap";
import { Button, Modal } from "react-bootstrap";

import { AuthContext } from "../../context/AuthContext";

const DELETE_CHAT_USER_QUERY = gql`
  mutation($chatId: ID!, $authorId: ID!, $otherUserId: ID!) {
    deleteChatUser(
      chatId: $chatId
      authorId: $authorId
      otherUserId: $otherUserId
    ) {
      id
      message
    }
  }
`;

export const ChatUsersDropdown = ({ chatId, otherUserId, history }) => {
  const [DeleteChatUser] = useMutation(DELETE_CHAT_USER_QUERY);
  const [smShow, setSmShow] = useState(false);

  return (
    <AuthContext.Consumer>
      {(ctx) => {
        const handleDeleteChatUser = async () => {
          try {
            const { data, errors } = await DeleteChatUser({
              variables: { chatId, authorId: ctx.state.user.id, otherUserId },
            });
            if (!data) return;
            if (errors?.length) {
              return ctx.updateState({
                alertMessage: errors[0].message,
                alertSuccess: false,
                alertMessageId: "Error",
              });
            }

            const alertMessage = data.deleteChatUser.message;

            // history.push("/chat");

            ctx.updateState({
              alertMessage,
              alertSuccess: false,
              alertMessageId: data.deleteChatUser.id,
            });
          } catch (err) {
            console.log("🚀 err", err);
            ctx.updateState({
              alertMessage: err.message,
              alertSuccess: false,
              alertMessageId: `error-${Math.random() + 1}`,
            });
          }
        };

        return (
          <React.Fragment>
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle}>•••</Dropdown.Toggle>

              <Dropdown.Menu as={CustomMenu}>
                <Dropdown.Item eventKey="2">Open user page</Dropdown.Item>
                <Dropdown.Item onClick={() => setSmShow(true)} eventKey="1">
                  Remove user
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
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
                <Button variant="danger" onClick={handleDeleteChatUser}>
                  YES| Remove
                </Button>
              </Modal.Body>
            </Modal>
          </React.Fragment>
        );
      }}
    </AuthContext.Consumer>
  );
};

export default withRouter(ChatUsersDropdown);

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
