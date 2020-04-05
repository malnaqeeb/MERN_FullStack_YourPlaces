import React, { useState, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import "./Auth.css";
import Input from "../../shared/component/formElements/Input";
import Button from "../../shared/component/formElements/Button";
import Card from "../../shared/component/UIElements/Card";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/component/formElements/ImageUpload";
import useHttpClient from "../../shared/hooks/http-hook";
import { useFrom } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/Util/validators";
import { AuthContext } from "../../shared/context/auth-context";
// React Icons
import { FaFacebookF, FaGoogle } from "react-icons/fa";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMod, setIsLoginMod] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [socialLogin, toggleSocialLogin] = useState(true);

  const [state, inputHandler, setFormData] = useFrom(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const switchModelHandler = () => {
    if (!isLoginMod) {
      setFormData(
        {
          ...state.inputs,
          name: undefined,
          image: undefined,
        },
        state.inputs.email.isValid && state.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...state.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMod((prevMode) => !prevMode);
    toggleSocialLogin((socialLogin) => !socialLogin);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMod) {
      try {
        const res = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: state.inputs.email.value,
            password: state.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(res.userId, res.token, null, res.friendStatus);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("email", state.inputs.email.value);
        formData.append("password", state.inputs.password.value);
        formData.append("name", state.inputs.name.value);
        formData.append("image", state.inputs.image.value);

        const res = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/signup`,
          "POST",
          formData
        );

        auth.login(res.userId, res.token);
      } catch (error) {}
    }
  };

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication no-select">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {/* social login */}
          {socialLogin && (
            <div>
              <h3>Log in with</h3>
              <a
                className="socialBtn"
                href={`${process.env.REACT_APP_BACKEND_URL}/users/facebook`}
              >
                <FaFacebookF />
                <span className="socialName">Facebook</span>
              </a>
              {/*  */}
              <a
                className="socialBtn"
                href={`${process.env.REACT_APP_BACKEND_URL}/users/google`}
              >
                <FaGoogle />
                <span className="socialName">Google</span>
              </a>
              <h3>______or______</h3>
            </div>
          )}
          {!isLoginMod && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid name"
              onInput={inputHandler}
            />
          )}
          {!isLoginMod && (
            <ImageUpload
              center
              id={"image"}
              onInput={inputHandler}
              errorText="Please provide an image"
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="Email"
            isLoading
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address"
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!state.isValid}>
            {isLoginMod ? "LOGIN" : "SIGNUP"}
          </Button>
          {isLoginMod && <Button to="/forgetpassword">FORGOT PASSWORD</Button>}
        </form>
        <Button inverse onClick={switchModelHandler}>
          SWITCH TO {isLoginMod ? "SIGNUP" : "LOGIN"}
        </Button>
      </Card>
    </Fragment>
  );
};

export default Auth;
