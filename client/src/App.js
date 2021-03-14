import "./App.css";
import Chat from "./components/Chat";
import { useEffect, useState } from "react";
import { LoginForm } from "./components/auth/Login";

function App() {
  // const [Login] = useMutation(LOGIN_QUERY);
  const [state, setState] = useState({
    token: null,
  });

  const updateState = (data) => {
    setState({
      ...state,
      ...data,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setState({ ...state, token: JSON.parse(token) });
  }, []);
  return (
    <div>
      {state.token ? (
        <Chat updateState={updateState} />
      ) : (
        <LoginForm updateState={updateState} />
      )}
    </div>
  );
}

export default App;
