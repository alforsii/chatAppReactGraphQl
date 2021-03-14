import { useEffect, useState } from "react";
import { useSubscription, useMutation, gql } from "@apollo/client";

const MESSAGES_SUB = gql`
  subscription {
    messages {
      id
      user
      context
    }
  }
`;
const MESSAGES_MUTATION = gql`
  mutation {
    messages {
      id
      user
      context
    }
  }
`;

const NEW_MESSAGE = gql`
  mutation($context: String!, $user: String!) {
    addMessage(context: $context, user: $user) {
      id
      context
      user
    }
  }
`;

const Messages = ({ user }) => {
  const { data } = useSubscription(MESSAGES_SUB);

  const [messages, setMessages] = useState([]);

  const [GetMessages] = useMutation(MESSAGES_MUTATION);
  useEffect(() => {
    setMessages(data?.messages);
  }, [data]);
  useEffect(() => {
    GetMessages()
      .then(({ data }) => {
        setMessages(data.messages);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {messages?.map(({ id, user: theUser, context }) => (
        <p key={id}>
          <span
            style={user === theUser ? { color: "green" } : { color: "gray" }}
          >
            {theUser}
          </span>
          : {context}
        </p>
      ))}
    </div>
  );
};
export default function Chat() {
  //   const [messages, setMessages] = useState([]);

  const [postMessage] = useMutation(NEW_MESSAGE);
  const [state, setState] = useState({
    user: "Ash",
    context: "",
  });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (state.user && state.context) {
      postMessage({
        variables: state,
      });
      setState({ ...state, context: "" });
    }
  };

  return (
    <div>
      <Messages user={state.user} />
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex" }}>
          <input
            onChange={handleChange}
            name="user"
            placeholder="username"
            value={state.user}
          />
          <input
            onChange={handleChange}
            name="context"
            placeholder="context"
            value={state.context}
          />
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
}
