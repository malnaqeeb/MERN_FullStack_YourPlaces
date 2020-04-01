import React, { Fragment, useState } from "react";
import Card from "../../shared/component/UIElements/Card";
import Input from "../../shared/component/formElements/Input";
import Button from "../../shared/component/formElements/Button";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import { useFrom } from "../../shared/hooks/form-hook";
import { VALIDATOR_EMAIL } from "../../shared/Util/validators";
import useHttpClient from "../../shared/hooks/http-hook";
import "./UserItem.css";
const ForgetPassword = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [sendPassword, setSendPassword] = useState();
  const [state, inputHandler, setFormData] = useFrom(
    {
      email: {
        value: "",
        isValid: false
      }
    },
    false
  );
  const emailSubmitHandler = async event => {
    const email = { email: state.inputs.email.value };
    try {
      event.preventDefault();

      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/forget`,
        "POST",
        JSON.stringify(email),
        {
          "Content-Type": "application/json"
        }
      );

      setSendPassword(data);
    } catch (error) {
      setFormData();
    }
  };

  return (
    <Fragment>
      {sendPassword ? (
        <Card className='forget_password no-select'>
          <p>{sendPassword.message}</p>
        </Card>
      ) : (
        <Card className='forget_password no-select'>
          <form className='place-form' onSubmit={emailSubmitHandler}>
            <Input
              id='email'
              element='input'
              type='email'
              label='Email'
              validators={[VALIDATOR_EMAIL()]}
              errorText='Please enter a valid email address'
              onInput={inputHandler}
            />
            <Button type='submit' disabled={!state.isValid}>
              Send Email
            </Button>
          </form>
        </Card>
      )}
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
    </Fragment>
  );
};

export default ForgetPassword;
