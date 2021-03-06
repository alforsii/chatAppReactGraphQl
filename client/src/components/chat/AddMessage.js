import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import "./AddMessage.css";

const NEW_MESSAGE = gql`
  mutation($content: String!, $username: String!, $userId: ID!, $chatId: ID!) {
    addMessage(
      data: {
        content: $content
        username: $username
        userId: $userId
        chatId: $chatId
      }
    ) {
      id
      content
      username
    }
  }
`;

export const AddMessage = ({ username, chatId, userId }) => {
  const [AddMessage] = useMutation(NEW_MESSAGE);
  const [state, setState] = useState({
    username: username,
    content: "",
    chatId,
    userId,
  });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state.username && state.content && userId && chatId) {
        await AddMessage({
          variables: state,
        });
        setState({ ...state, content: "" });
        const messagesEl = document.querySelector(".messages");
        messagesEl.scrollTop = messagesEl.scrollHeight;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="add_form_main" onSubmit={handleSubmit}>
      <div className="add_form">
        {/* <div style={{ width: "100%" }}>
          <input
            onChange={handleChange}
            style={{ display: "block", width: "100%" }}
            name="username"
            id="username"
            placeholder="username"
            value={state.username}
            className="add_form_input"
          />
        </div> */}
        <div style={{ width: "100%" }}>
          <input
            onChange={handleChange}
            style={{ display: "block", width: "100%" }}
            name="content"
            id="content"
            placeholder="Type message..."
            value={state.content}
            className="add_form_input"
          />
        </div>
        <input className="add_form_btn" type="submit" value="Send" />
      </div>
    </form>
  );
};
