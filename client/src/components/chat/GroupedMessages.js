import React from "react";
import moment from "moment";

export default function GroupedMessages({ id, type, messages, name }) {
  const handleTimeToggle = (msgId) => {
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

  return (
    <div className="message_content">
      {messages.map((msg, i) => {
        const time = new Date(Number(msg.createdAt)).toISOString();
        const myUTC = new Date().getUTCDate();
        return (
          <div
            key={msg.id}
            onMouseEnter={() => handleTimeToggle(msg.id)}
            onMouseLeave={() => handleTimeToggle(msg.id)}
            style={{
              display: "flex",
              justifyContent: `${type === "sent" ? "flex-end" : "flex-start"}`,
              alignItems: "center",
            }}
          >
            {type === "sent" && (
              <i id={msg.id} className="opacity_none">
                {moment(time).utc(myUTC).format("MMM Do YYYY, h:mm a")}
              </i>
            )}
            <p
              style={
                i === messages.length - 1
                  ? type === "sent"
                    ? {
                        borderBottomRightRadius: 0,
                        borderTopRightRadius: "30px",
                      }
                    : {
                        borderBottomLeftRadius: 0,
                        borderTopLeftRadius: "30px",
                      }
                  : {}
              }
              className={`message ${
                type === "sent" ? "user_messages" : "others_messages"
              }`}
            >
              {msg.text}
            </p>
            {type === "received" && (
              <i id={msg.id} className="opacity_none">
                {moment(time).utc(myUTC).format("MMM Do YYYY, h:mm a")}
              </i>
            )}
          </div>
        );
      })}
      {type === "received" && <h5 className="other_user">{name}</h5>}
    </div>
  );
}
