import React, { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "../../shared/component/UIElements/Card";
import Input from "../../shared/component/formElements/Input";
import Button from "../../shared/component/formElements/Button";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import { useFrom } from "../../shared/hooks/form-hook";
import { VALIDATOR_MINLENGTH } from "../../shared/Util/validators";
import useHttpClient from "../../shared/hooks/http-hook";
import "./UserItem.css";
const ResetEmail = () => {
  const token = useParams().token;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [sendPassword, setSendPassword] = useState();
  const [state, inputHandler] = useFrom(
    {
      password: {
        value: "",
        isValid: false
      },
      confirmpassword: {
        value: "",
        isValid: false
      }
    },
    false
  );
  const resetPasswordSubmitHandler = async event => {
    event.preventDefault();

    const newPassword = {
      password: state.inputs.password.value,
      confirmpassword: state.inputs.confirmpassword.value
    };
    try {
      event.preventDefault();

      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/reset/${token}`,
        "POST",
        JSON.stringify(newPassword),
        {
          "Content-Type": "application/json"
        }
      );

      setSendPassword(data);
    } catch (error) {}
  };
  if (sendPassword) {
  }
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {sendPassword ? (
        <Card className='forget_password no-select'>
          <p>{sendPassword.message}</p>
          <Button to='/auth'>AUTHENTICATE</Button>
        </Card>
      ) : (
        <Card className='forget_password no-select'>
          <form className='place-form' onSubmit={resetPasswordSubmitHandler}>
            <Input
              id='password'
              element='input'
              type='password'
              label='New password'
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText='Please enter a valid password, at least 6 characters.'
              onInput={inputHandler}
            />
            <Input
              id='confirmpassword'
              element='input'
              type='password'
              label='confirm password'
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText='Please enter a valid password, at least 6 characters.'
              onInput={inputHandler}
            />
            <Button type='submit' disabled={!state.isValid}>
              Reset Password
            </Button>
          </form>
        </Card>
      )}
    </Fragment>
  );
};

export default ResetEmail;
