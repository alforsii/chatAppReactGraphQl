import React, { useEffect } from "react";
import { gql, useSubscription } from "@apollo/client";
import { ListGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import CreateChat from "./CreateChat";
import UserChatsDropdown from "./UserChatsDropdown";

const USER_CHATS_QUERY = gql`
  subscription($userId: ID!) {
    userChats(userId: $userId) {
      id
      chatName
    }
  }
`;

export default function UserChats({ userId, updateState }) {
  const { data, error } = useSubscription(USER_CHATS_QUERY, {
    variables: { userId },
  });

  useEffect(() => {
    updateState({ chats: data?.userChats });
    // eslint-disable-next-line
  }, [data?.userChats]);

  if (!data) return null;
  if (error) return console.log(error);

  return (
    <>
      <ListGroup variant="flush">
        <ListGroup.Item variant="primary">
          <span>Your Chats</span>
          <CreateChat />
        </ListGroup.Item>
        {data.userChats.map((chat) => (
          <ListGroup.Item
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 5,
              marginLeft: 10,
              padding: 5,
              border: "none",
              borderBottom: "1px solid #eee",
            }}
            key={chat.id}
          >
            <NavLink to={`/chat/${chat.id}`}>{chat.chatName}</NavLink>
            <UserChatsDropdown chatId={chat.id} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );
}
