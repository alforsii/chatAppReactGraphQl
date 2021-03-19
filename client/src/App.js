import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Route, Switch, Redirect } from "react-router-dom";
import { Alert } from "react-bootstrap";

import Chat from "./components/chat/Chat";
import { LoginForm } from "./components/auth/Login";
import { AuthContext } from "./context/AuthContext";
import "./App.css";
import { Signup } from "./components/auth/Signup";
import MyNavbar from "./components/navbar/MyNavbar";
const IS_LOGGED_QUERY = gql`
  mutation($token: String!) {
    isLoggedIn(token: $token) {
      token
      userId
    }
  }
`;
const GET_USER_QUERY = gql`
  mutation($id: ID!) {
    getUser(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

function App() {
  const [IsLoggedIn] = useMutation(IS_LOGGED_QUERY);
  const [GetUser] = useMutation(GET_USER_QUERY);

  const [state, setState] = useState({
    token: "",
    user: null,
    isLoading: false,
    message: "",
    userId: null,
  });

  const updateState = (data) => {
    setState({
      ...state,
      ...data,
    });
  };

  const getUserDetails = async (id, token) => {
    const { data, errors } = await GetUser({
      variables: { id },
    });
    if (!data) return;
    if (errors?.length) {
      return setState({ ...state, message: errors[0].message });
    }

    updateState({
      token,
      userId: id,
      isLoading: false,
      user: data.getUser,
      message: "",
    });
    return data.getUser.id;
  };

  const isLoginValid = async () => {
    try {
      updateState({ isLoading: true });
      const token = JSON.parse(localStorage.getItem("token"));
      const { data } = await IsLoggedIn({ variables: { token } });

      if (!data || !data.isLoggedIn.token) {
        handleLogout();
        return null;
      }

      const { userId, token: validToken } = data.isLoggedIn;

      await getUserDetails(userId, validToken);
    } catch (err) {
      console.log(err);
      handleLogout();
    }
  };

  const handleLogout = () => {
    updateState({ token: null, isLoading: false, user: null });
    localStorage.clear();
  };

  useEffect(() => {
    isLoginValid();
    return () => {};
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state: state,
        logout: handleLogout,
        updateState: updateState,
        getUserDetails: getUserDetails,
      }}
    >
      <div>
        <MyNavbar
          token={state.token}
          logout={handleLogout}
          username={state.user?.email}
        />
        <div style={{ height: "60px" }}></div>
        {state.message && (
          <Alert
            variant={state.token && state.message ? "success" : "warning"}
            onClose={() => updateState({ message: "" })}
            dismissible
          >
            <Alert.Heading>{state.message}</Alert.Heading>
          </Alert>
        )}
        <Switch>
          {!state.token && <Redirect from="/chat" to="/" exact />}
          {state.token && <Redirect from="/" to="/chat" exact />}

          {state.token ? (
            <>
              <Route
                path="/chat"
                exact
                render={(props) => (
                  <Chat
                    {...props}
                    username={state.user?.email}
                    userId={state.userId}
                  />
                )}
              />

              <Route
                path="/chat/:id"
                exact
                render={(props) => (
                  <Chat
                    {...props}
                    username={state.user?.email}
                    userId={state.userId}
                  />
                )}
              />
            </>
          ) : (
            <>
              <Route
                path="/"
                exact
                render={(props) => <LoginForm {...props} />}
              />
              <Route
                exact
                path="/signup"
                render={(props) => (
                  <Signup {...props} updateState={updateState} />
                )}
              />
            </>
          )}
        </Switch>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
