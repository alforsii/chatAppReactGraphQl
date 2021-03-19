import React from "react";
import { gql, useSubscription } from "@apollo/client";
import { Image, ListGroup, Card } from "react-bootstrap";
import AddChatUser from "./AddChatUser";
import { NavLink } from "react-router-dom";

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
    <>
      <ListGroup variant="flush">
        <ListGroup.Item variant="primary">
          Chat Users
          <AddChatUser chatId={chatId} />
        </ListGroup.Item>

        <div
          style={{
            overflow: "scroll",
            // backgroundColor: "#fff",
            height: "100%",
          }}
        >
          {data?.chatUsers?.length >= 2 ? (
            data?.chatUsers
              .filter((chatUser) => chatUser.id !== currentUserId)
              .map((chatUser) => (
                <ListGroup.Item
                  style={{
                    marginBottom: 2,
                    padding: 5,
                    border: "none",
                    borderBottom: "1px solid #eee",
                  }}
                  key={chatUser.id}
                >
                  <Image
                    style={{ width: "40px", height: "40px" }}
                    src="https://source.unsplash.com/user/erondu"
                    roundedCircle
                  />
                  <NavLink
                    style={{ marginLeft: 10 }}
                    to={`/user/${chatUser.id}`}
                  >
                    {`${chatUser.firstName} ${chatUser.lastName}`}
                  </NavLink>
                </ListGroup.Item>
              ))
          ) : (
            <div style={{ padding: 10, margin: 5 }}>
              <p>{`No users in the Chat!`}</p>
            </div>
          )}
        </div>
      </ListGroup>
    </>
  );
}
