import React from "react";
import moment from "moment";
import { Image } from "react-bootstrap";

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
              <i id={msg.id} className="opacity_none text-muted">
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
                type === "sent" ? "user_messages" : "others_messages text-muted"
              }`}
            >
              {msg.text}
            </p>
            {type === "received" && (
              <i id={msg.id} className="opacity_none text-muted">
                {moment(time).utc(myUTC).format("MMM Do YYYY, h:mm a")}
              </i>
            )}
          </div>
        );
      })}
      {type === "received" && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: "40px", height: "40px" }}
            src="https://source.unsplash.com/user/erondu"
            roundedCircle
          />
          <p className="other_user text-muted">{name}</p>
        </div>
      )}
    </div>
  );
}
