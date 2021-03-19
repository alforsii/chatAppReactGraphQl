import React from "react";
import { gql, useSubscription } from "@apollo/client";
import { ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import CreateChat from "./CreateChat";

const USER_CHATS_QUERY = gql`
  subscription($userId: ID!) {
    userChats(userId: $userId) {
      id
      chatName
    }
  }
`;

export default function UserChats({ userId }) {
  const { data, error } = useSubscription(USER_CHATS_QUERY, {
    variables: { userId },
  });

  if (!data) return null;
  if (error) return console.log(error);

  return (
    <>
      <ListGroup variant="flush">
        <ListGroup.Item variant="primary">
          <span>Your Chats</span>
          <CreateChat userId={userId} />
        </ListGroup.Item>
        {data.userChats.map((chat) => (
          <ListGroup.Item
            style={{
              marginTop: 5,
              marginLeft: 10,
              padding: 5,
              border: "none",
              borderBottom: "1px solid #eee",
            }}
            key={chat.id}
          >
            <NavLink to={`/chat/${chat.id}`}>{chat.chatName}</NavLink>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
