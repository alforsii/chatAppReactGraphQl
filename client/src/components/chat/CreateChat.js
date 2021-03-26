import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Badge,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const NEW_CHAT_QUERY = gql`
  mutation($userId: ID!, $chatName: String!) {
    createChat(userId: $userId, chatName: $chatName) {
      id
      chatName
    }
  }
`;

export default function CreateChat() {
  const [CreateChat] = useMutation(NEW_CHAT_QUERY);
  const [smShow, setSmShow] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [chatName, setChatName] = useState("");

  return (
    <AuthContext.Consumer>
      {(ctx) => {
        const handleCreateChat = async (e) => {
          e.preventDefault();
          try {
            if (!chatName) return setErrMessage("Type a name!");
            if (!ctx.state.user.id) return ctx.logout();

            const { data, errors } = await CreateChat({
              variables: { chatName, userId: ctx.state.user.id },
            });
            if (errors?.length) {
              return setErrMessage(errors[0].message);
            }
            if (!data) {
              return setErrMessage("Something went wrong!");
            }

            ctx.updateState({
              alertMessage: `New ${data.createChat.chatName} chat created!`,
              alertSuccess: true,
              alertMessageId: data.createChat.id,
              chats: [...ctx.state.chats, data?.createChat],
            });

            setChatName("");
            setSmShow(false);
          } catch (err) {
            console.log(err);
          }
        };

        return (
          <>
            <Badge
              style={{ cursor: "pointer", float: "right" }}
              onClick={() => {
                setSmShow(true);
              }}
              variant="primary"
            >
              +
            </Badge>
            <CreateModal
              onHide={() => {
                setErrMessage("");
                setSmShow(false);
              }}
              onChange={(e) => {
                setErrMessage("");
                setChatName(e.target.value);
              }}
              chatName={chatName}
              smShow={smShow}
              errMessage={errMessage}
              handleCreateChat={handleCreateChat}
            />
          </>
        );
      }}
    </AuthContext.Consumer>
  );
}

//

const CreateModal = ({
  onHide,
  smShow,
  chatName,
  errMessage,
  onChange,
  handleCreateChat,
}) => {
  // const useFocus = () => {
  //   const htmlElRef = useRef(null);
  //   const setFocus = () => {
  //     htmlElRef.current && htmlElRef.current.focus();
  //   };

  //   return [htmlElRef, setFocus];
  // };

  // const [inputRef, setInputFocus] = useFocus();

  return (
    <Modal
      size="sm"
      show={smShow}
      onHide={onHide}
      aria-labelledby="create-chat-form"
    >
      <Modal.Header closeButton>
        <Modal.Title id="create-chat-form">Create Chat</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ color: "#dc3545" }}>{errMessage && errMessage}</p>
        <Form inline onSubmit={handleCreateChat}>
          <InputGroup className="mb-2 mr-sm-2">
            <InputGroup.Prepend>
              <InputGroup.Text>@</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              onChange={onChange}
              value={chatName}
              placeholder="ChatName..."
              autoFocus
            />
          </InputGroup>

          <Button type="submit" className="mb-2">
            Create Chat
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
