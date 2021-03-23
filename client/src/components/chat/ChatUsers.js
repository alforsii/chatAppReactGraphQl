import React, { useState } from "react";
import { gql, useSubscription } from "@apollo/client";
import { Image, ListGroup, Accordion } from "react-bootstrap";
import AddChatUser from "./AddChatUser";
import { NavLink } from "react-router-dom";
import ChatUsersDropdown from "./ChatUsersDropdown";

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

export default function ChatUsers({ chatId, currentUserId, chats }) {
  const [open, setOpen] = useState(false);
  const { data, error } = useSubscription(CHAT_USERS_QUERY, {
    variables: { chatId },
  });

  if (!data) return null;
  if (error) return console.log(error);
  const isInChatUsers = chats?.map((user) => user.id).includes(chatId);

  return (
    <>
      <ListGroup variant="flush">
        <Accordion defaultActiveKey="0">
          <Accordion.Toggle
            variant="primary"
            onClick={() => setOpen(!open)}
            as={ListGroup.Item}
            eventKey="0"
          >
            {/* <ListGroup.Item variant="primary"> */}
            {open ? (
              <i className="fas fa-arrow-down"></i>
            ) : (
              <i className="fas fa-arrow-up"></i>
            )}{" "}
            chat users
            <AddChatUser chatId={chatId} />
            {/* </ListGroup.Item> */}
          </Accordion.Toggle>

          <Accordion.Collapse eventKey="0">
            <div
              style={
                {
                  // overflow: "scroll",
                  // backgroundColor: "#fff",
                  // height: "100%",
                }
              }
            >
              {!isInChatUsers ? null : data?.chatUsers?.length >= 2 ? (
                data?.chatUsers
                  .filter((chatUser) => chatUser.id !== currentUserId)
                  .map((chatUser) => (
                    <ListGroup.Item
                      style={{
                        marginBottom: 2,
                        padding: 5,
                        border: "none",
                        borderBottom: "1px solid #eee",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      key={chatUser.id}
                    >
                      <div>
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
                      </div>
                      <ChatUsersDropdown
                        chatId={chatId}
                        otherUserId={chatUser.id}
                      />
                    </ListGroup.Item>
                  ))
              ) : (
                <div style={{ padding: 10, margin: 5 }}>
                  <p>{`No users in the Chat!`}</p>
                </div>
              )}
            </div>
          </Accordion.Collapse>
        </Accordion>
      </ListGroup>
    </>
  );
}
