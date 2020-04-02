import React, { useContext, Fragment } from 'react';
import Input from '../../shared/component/formElements/Input';
import Button from '../../shared/component/formElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/Util/validators';
import useHttpClient from '../../shared/hooks/http-hook';
import { useFrom } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/component/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/component/UIElements/LoadingSpinner';

import './CommentForm.css';

export default function CommentForm({addComment, placeId}) {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [state, inputHandler, setFormData] = useFrom(
    {
      title: {
        value: '',
        isValid: false,
      },
      comment: {
        value: '',
        isValid: false,
      }
    },
    false
  );
  const submitHandler = async event => {
    event.preventDefault();
    const createComment = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}/comments`,
          "POST",
          JSON.stringify({
            title: state.inputs.title.value,
            comment: state.inputs.comment.value
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token
          }
        );
        addComment(data.comment);
        setFormData(    
          {
            title: {
              value: '',
              isValid: false,
            },
            comment: {
              value: '',
              isValid: false,
            }
          },
          false
        )
      } catch (error) {}
    };
    createComment();
  };

  return (
    <div className="comment-form-container">
      <Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner/>}
        <form className='comment-form' onSubmit={submitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            initialValue={state.inputs.title.value}
          />
          <Input
            id='comment'
            element='textarea'
            label='Message'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid message (min. 5 characters).'
            onInput={inputHandler}
            initialValue={state.inputs.comment.value}
          />
          <Button type='submit' disabled={!state.isValid}>
            GO FOR IT!
          </Button>
        </form>
      </Fragment>
    </div>
  )
}
