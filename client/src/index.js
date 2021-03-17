import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const wsLink = new WebSocketLink({
  uri: "ws://localhost:8000/",
  options: {
    reconnect: true,
    // connectionParams: {
    //   authToken: JSON.parse(token),
    // },
  },
});

const client = new ApolloClient({
  link: wsLink,
  uri: "http://localhost:8000/",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
