import { useState } from "react";
import { useSubscription, useMutation, gql } from "@apollo/client";

const MESSAGES_SUB = gql`
  subscription {
    messages {
      id
      username
      content
    }
  }
`;

const NEW_MESSAGE = gql`
  mutation($content: String!, $username: String!) {
    addMessage(data: { content: $content, username: $username }) {
      id
      content
      username
    }
  }
`;

const Messages = ({ username }) => {
  const { data } = useSubscription(MESSAGES_SUB);
  if (!data) {
    return null;
  }
  return (
    <div>
      {data?.messages?.map(({ id, username: theUsername, content }) => (
        <p key={id}>
          <span
            style={
              username === theUsername ? { color: "green" } : { color: "gray" }
            }
          >
            {theUsername}
          </span>
          : {content}
        </p>
      ))}
    </div>
  );
};
export default function Chat() {
  //   const [messages, setMessages] = useState([]);

  const [postMessage] = useMutation(NEW_MESSAGE);
  const [state, setState] = useState({
    username: "Ash",
    content: "",
  });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.username && state.content) {
      postMessage({
        variables: state,
      });
      setState({ ...state, content: "" });
    }
  };

  return (
    <div>
      <Messages username={state.username} />
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex" }}>
          <input
            onChange={handleChange}
            name="username"
            placeholder="username"
            value={state.username}
          />
          <input
            onChange={handleChange}
            name="content"
            placeholder="content"
            value={state.content}
          />
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}
