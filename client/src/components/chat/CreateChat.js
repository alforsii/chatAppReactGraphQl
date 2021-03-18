import { gql, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

const NEW_CHAT_QUERY = gql`
  mutation($userId: ID!, $chatName: String!) {
    createChat(userId: $userId, chatName: $chatName) {
      id
      chatName
    }
  }
`;

export default function CreateChat({ userId }) {
  const [CreateChat] = useMutation(NEW_CHAT_QUERY);
  const [errMessage, setErrMessage] = useState("");
  const [chatName, setChatName] = useState("");

  return (
    <AuthContext.Consumer>
      {(ctx) => {
        const handleCreateChat = async (e) => {
          e.preventDefault();
          try {
            if (!chatName) return setErrMessage("Type name!");
            if (!userId) return ctx.logout();

            const { data, errors } = await CreateChat({
              variables: { chatName, userId },
            });
            if (errors?.length) {
              return setErrMessage(errors[0].message);
            }
            if (!data) {
              return setErrMessage("Something went wrong!");
            }
            ctx.updateState({
              // chats: [...ctx.state, data.createChat],
              message: "Chat created!",
            });

            setChatName("");
          } catch (err) {
            console.log(err);
          }
        };

        return (
          <div>
            <p>{errMessage && errMessage}</p>
            <Form inline onSubmit={handleCreateChat}>
              <InputGroup className="mb-2 mr-sm-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>@</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  onChange={(e) => setChatName(e.target.value)}
                  value={chatName}
                  placeholder="ChatName..."
                />
              </InputGroup>

              <Button type="submit" className="mb-2">
                Create room
              </Button>
            </Form>
          </div>
        );
      }}
    </AuthContext.Consumer>
  );
}
