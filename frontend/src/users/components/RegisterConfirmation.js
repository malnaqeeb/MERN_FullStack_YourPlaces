import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../../shared/component/UIElements/Card";

import Button from "../../shared/component/formElements/Button";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import useHttpClient from "../../shared/hooks/http-hook";

const RegisterConfirmation = () => {
  const token = useParams().token;

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [account, setAccount] = useState();
  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/confirm/${token}`
        );

        setAccount(data);
      } catch (error) {}
    };
    confirmAccount();
  }, [token, sendRequest]);
  console.log(account);
  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {account && (
        <Card className='forget_password'>
          <p>{account.message}</p>
          <Button to='/auth'>AUTHENTICATE</Button>
        </Card>
      )}
    </Fragment>
  );
};

export default RegisterConfirmation;