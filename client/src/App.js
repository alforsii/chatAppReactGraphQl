import "./App.css";
import Chat from "./components/chat/Chat";
import React, { useEffect, useState } from "react";
import { LoginForm } from "./components/auth/Login";
import { gql, useMutation } from "@apollo/client";
const IS_LOGGED_QUERY = gql`
  mutation($token: String!) {
    isLoggedIn(token: $token) {
      token
    }
  }
`;

function App() {
  const [IsLoggedIn] = useMutation(IS_LOGGED_QUERY);
  const [state, setState] = useState({
    token: "",
    username: "Ash",
    isLoading: false,
  });

  const updateState = (data) => {
    setState({
      ...state,
      ...data,
    });
  };

  const isLoginValid = async () => {
    try {
      updateState({ isLoading: true });
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await IsLoggedIn({ variables: { token } });
      if (!data || !data.isLoggedIn.token) {
        handleLogout();
        updateState({ isLoading: false });
        return null;
      }
      console.log(data.isLoggedIn.token);
      updateState({ token: data.isLoggedIn.token, isLoading: false });
    } catch (err) {
      console.log(err);
      updateState({ isLoading: false });
      handleLogout();
    }
  };

  const handleLogout = () => {
    updateState({ token: null });
    localStorage.clear();
  };

  useEffect(() => {
    isLoginValid();
    return () => {};
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {state.isLoading ? (
        <h5>Loading...</h5>
      ) : state.token ? (
        <React.Fragment>
          <Chat
            updateState={updateState}
            handleLogout={handleLogout}
            username={state.username}
          />
          <button onClick={() => handleLogout()}>Logout</button>
        </React.Fragment>
      ) : (
        <LoginForm updateState={updateState} />
      )}
    </div>
  );
}

export default App;
