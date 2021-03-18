import React from "react";
import { gql, useSubscription } from "@apollo/client";
import { ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";

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
    <div>
      <ListGroup variant="flush">
        <ListGroup.Item variant="primary">User Chats</ListGroup.Item>
        {data.userChats.map((chat) => (
          <ListGroup.Item key={chat.id}>
            <NavLink to={`/chat/${chat.id}`}>{chat.chatName}</NavLink>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
