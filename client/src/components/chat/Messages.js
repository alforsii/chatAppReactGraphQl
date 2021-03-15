import { useSubscription, gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import moment from "moment";
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

  const handleTimeToggle = (msgId, name) => {
    document.querySelectorAll(".opacity_animation").forEach((el) => {
      el.classList.remove("opacity_animation");
      el.classList.add("opacity_none");
      //   el.parentElement.classList.remove("box_shadow");
    });
    if (document.getElementById(msgId).classList.contains("opacity_none")) {
      document.getElementById(msgId).classList.remove("opacity_none");
      document.getElementById(msgId).classList.add("opacity_animation");
      //   document.getElementById(msgId).parentElement.classList.add("box_shadow");
    } else {
      document.getElementById(msgId).classList.add("opacity_none");
      document.getElementById(msgId).classList.remove("opacity_animation");
    }
  };

  const sortMessages = () => {
    if (data?.messages?.length) {
      const allMessages = [...data.messages];

      let userMessages = [];
      const newSortedMessages = [];

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
    }
  };

  useEffect(() => {
    sortMessages();
    const messagesEl = document.querySelector(".messages");
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // eslint-disable-next-line
  }, [data]);

  return (
    <div
      style={{
        height: "550px",
        overflow: "scroll",
        padding: "20px",
      }}
      className="box_shadow messages"
    >
      {loading ? (
        <h5>Loading...</h5>
      ) : sortedMessages.length ? (
        sortedMessages?.map(({ id, type, messages, name }) => (
          <React.Fragment key={id}>
            {type === "sent" ? (
              <div className="message">
                {messages.map((msg, i) => {
                  const time = new Date(Number(msg.createdAt)).toISOString();
                  const myUTC = new Date().getUTCDate();
                  return (
                    <React.Fragment key={msg.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                        onMouseEnter={() => handleTimeToggle(msg.id, name)}
                        onMouseLeave={() => handleTimeToggle(msg.id, name)}
                      >
                        <i id={msg.id} className="opacity_none">
                          {moment(time)
                            .utc(myUTC)
                            .format("MMM Do YYYY, h:mm a")}
                        </i>
                        <p
                          style={
                            i === messages.length - 1
                              ? {
                                  borderBottomRightRadius: 0,
                                  borderTopRightRadius: "30px",
                                }
                              : {}
                          }
                          className="user_message_content single_message"
                        >
                          {msg.text}
                        </p>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            ) : (
              <div className="message">
                {messages.map((msg, i) => {
                  const time = new Date(Number(msg.createdAt)).toISOString();
                  const myUTC = new Date().getUTCDate();
                  return (
                    <React.Fragment key={msg.id}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          alignItems: "center",
                        }}
                        onMouseEnter={() => handleTimeToggle(msg.id, name)}
                        onMouseLeave={() => handleTimeToggle(msg.id, name)}
                      >
                        <p
                          style={
                            i === messages.length - 1
                              ? {
                                  borderBottomLeftRadius: 0,
                                  borderTopLeftRadius: "30px",
                                }
                              : {}
                          }
                          className="message_content single_message"
                        >
                          {msg.text}
                        </p>
                        <i id={msg.id} className="opacity_none">
                          {moment(time)
                            .utc(myUTC)
                            .format("MMM Do YYYY, h:mm a")}
                        </i>
                      </div>
                    </React.Fragment>
                  );
                })}
                <span className="other_user">{name}</span>
              </div>
            )}
          </React.Fragment>
        ))
      ) : (
        <p>You have no messages!</p>
      )}
    </div>
  );
};
