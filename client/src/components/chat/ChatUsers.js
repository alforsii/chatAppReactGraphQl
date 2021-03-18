import React from "react";
import { gql, useSubscription } from "@apollo/client";
import { Image, ListGroup } from "react-bootstrap";
import AddChatUser from "./AddChatUser";

const CHAT_USERS_QUERY = gql`
  subscription($chatId: ID!) {
    chatUsers(chatId: $chatId) {
      id
      email
      lastName
      firstName
    }
  }
`;

export default function ChatUsers({ chatId, currentUserId }) {
  const { data, error } = useSubscription(CHAT_USERS_QUERY, {
    variables: { chatId },
  });

  if (!data) return null;
  if (error) return console.log(error);

  return (
    <div>
      <ListGroup.Item variant="primary">Chat Users</ListGroup.Item>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowX: "scroll",
          backgroundColor: "#f8f8f8",
        }}
      >
        {data?.chatUsers
          .filter((chatUser) => chatUser.id !== currentUserId)
          .map((chatUser) => (
            <div key={chatUser.id} style={{ padding: 10, margin: 5 }}>
              <Image
                style={{ width: "40px", height: "40px" }}
                src="https://source.unsplash.com/user/erondu"
                roundedCircle
              />
              <p>{`${chatUser.firstName}`}</p>
            </div>
          ))}
      </div>
      <AddChatUser chatId={chatId} />
    </div>
  );
}
