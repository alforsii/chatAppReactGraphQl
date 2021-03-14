import React, { useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
// import { AuthContext } from "../../context/AuthContext";
// import MyModal from "../modal/MyModal";
// import Signup from "./Signup";
// import axios from "axios";
// import { myToaster } from "../../auth/helpers";

import "./Login.css";

const LOGIN_QUERY = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const LoginForm = (props) => {
  const [errMessage, setErrMessage] = useState(null);
  const emailEl = React.createRef();
  const passwordEl = React.createRef();
  const [Login] = useMutation(LOGIN_QUERY);
  // 1. One way of setting contextType for the class component
  // static contextType = AuthContext;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;
    // console.log(email, password);

    if (email.trim().length === 0 || password.trim().length === 0) {
      // myToaster("Enter email and password to login!", "yellow");
      // context.updateState({
      //   errMessage: "Enter email and password to Login!",
      // });
      return;
    }
    try {
      const { data, errors } = await Login({ variables: { email, password } });
      // if (!data && errors.length) {
      //   return setErrMessage(errors[0].message);
      // }
      if (!data?.login?.token) {
        return null;
      }
      console.log(data);
      props.updateState({ token: data.login?.token });
      localStorage.setItem("token", JSON.stringify(data.login?.token));
    } catch (err) {
      return setErrMessage(err.message);
    }
  };

  useEffect(() => {
    clearForm();
    // context.updateState({ message: "" });
    return () => {
      console.log("LOGIN CLEARED");
    };
  }, []);

  const clearForm = () => {
    emailEl.current.value = "";
    passwordEl.current.value = "";
  };

  // openSignupForm = () => {
  //   context.updateState({
  //     signupForm: true,
  //   });
  //   // setState((prevState) => ({
  //   //   ...prevState,
  //   //   signupForm: true,
  //   // }));
  // };
  // closeSignupForm = () => {
  //   context.updateState({
  //     signupForm: false,
  //   });
  //   // setState((prevState) => ({
  //   //   ...prevState,
  //   //   signupForm: false,
  //   // }));
  // };

  return (
    <React.Fragment>
      {/* {context.state.signupForm && (
          <MyModal>
            <Signup closeSignupForm={closeSignupForm} />
          </MyModal>
        )} */}

      <div className="container">
        <form style={{ marginTop: "150px" }} onSubmit={handleLoginSubmit}>
          <span>{errMessage && errMessage}</span>
          <div className="row">
            <div className="col s12 m6 offset-m3">
              <div className="">
                <div className="row">
                  <div className="input-field col s12 m10 offset-m1">
                    <h4 className="blue-text">Login</h4>
                  </div>
                  <div className=" col s12 m10 offset-m1">
                    <input
                      id="email"
                      className="validate"
                      type="text"
                      ref={emailEl}
                      placeholder="Email"
                    />
                    {/* <label htmlFor="email">Email</label> */}
                  </div>
                  <div className=" col s12 m10 offset-m1">
                    <input
                      id="password"
                      type="password"
                      className="validate"
                      ref={passwordEl}
                      placeholder="Password"
                    />
                    {/* <label htmlFor="password">Password</label> */}
                  </div>
                  <div className="col s12 offset-s2">
                    <div>
                      <button
                        style={{ padding: "0 40px" }}
                        type="submit"
                        className="btn blue"
                      >
                        Login
                      </button>
                    </div>
                    <div>
                      <span>Don't have an account?</span>
                      <span
                        style={{ cursor: "pointer" }}
                        className="red-text"
                        // onClick={openSignupForm}
                      >
                        {" Signup"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

// // 2. Another way of setting contextType for the class component
// Login.contextType = AuthContext;
