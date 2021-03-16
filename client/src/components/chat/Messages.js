import { useSubscription, gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import GroupedMessages from "./GroupedMessages";

import "./Messages.css";

const MESSAGES_SUB = gql`
  subscription {
    messages {
      id
      username
      content
      createdAt
    }
  }
`;

export const Messages = ({ username }) => {
  const { data, loading } = useSubscription(MESSAGES_SUB);
  const [sortedMessages, setSortedMessages] = useState([]);

  //   Sorted messages structure: {
  //    id: message id / later will be userId,
  //    type: "sent" /or "received",
  //    name: messaged username,
  //    avatar: user image,
  //    messages: grouped lines of messages that belongs to the same user, which is between two users on the chat.
  // }
  const sortMessages = () => {
    if (data?.messages?.length) {
      let userMessages = [];
      const newSortedMessages = [];
      const allMessages = [...data.messages];

      allMessages.forEach((msg, index) => {
        let nextUser = allMessages[index + 1]?.username || "";

        if (username === msg.username) {
          if (username === nextUser) {
            userMessages.push({
              id: msg.id,
              text: msg.content,
              createdAt: msg.createdAt,
            });
          } else {
            const newObj = {
              id: msg.id,
              type: "sent",
              name: msg.username,
              avatar: "",
              messages: [
                ...userMessages,
                {
                  id: msg.id,
                  text: msg.content,
                  createdAt: msg.createdAt,
                },
              ],
            };
            newSortedMessages.push(newObj);
            userMessages = [];
          }
        } else {
          if (msg.username === nextUser) {
            userMessages.push({
              id: msg.id,
              text: msg.content,
              createdAt: msg.createdAt,
            });
          } else {
            const newObj = {
              id: msg.id,
              type: "received",
              name: msg.username,
              avatar: "",
              messages: [
                ...userMessages,
                {
                  id: msg.id,
                  text: msg.content,
                  createdAt: msg.createdAt,
                },
              ],
            };
            newSortedMessages.push(newObj);
            userMessages = [];
          }
        }
      });

      setSortedMessages(newSortedMessages);
      const messagesEl = document.querySelector(".messages");
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  };

  useEffect(() => {
    sortMessages();
    // eslint-disable-next-line
  }, [data]);

  return (
    <div
      style={{
        maxHeight: "550px",
        overflow: "scroll",
        padding: "20px",
      }}
      className="box_shadow messages"
    >
      {loading ? (
        <h5>Loading...</h5>
      ) : sortedMessages.length ? (
        sortedMessages?.map((msgData) => (
          <GroupedMessages key={msgData.id} {...msgData} />
        ))
      ) : (
        <p>You have no messages!</p>
      )}
    </div>
  );
};
