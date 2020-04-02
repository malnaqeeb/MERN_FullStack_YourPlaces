import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../shared/component/formElements/Input";
import Button from "../../shared/component/formElements/Button";
import { useFrom } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from "../../shared/Util/validators";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Comment.css";

export default function Comment(props) {
  const [editMode, setEditMode] = useState(false);
  const { _id, creator, title, comment, date } = props.comment;
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const hasRight =
    creator && auth && auth.userId && creator._id === auth.userId;
  const placeId = useParams().placeId;
  const [state, inputHandler] = useFrom(
    {
      title: {
        value: title,
        isValid: false
      },
      comment: {
        value: comment,
        isValid: false
      }
    },
    false
  );

  const deleteComment = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}/comments/${_id}`,
        "DELETE",
        null,
        { Authorization: `Bearer ${auth.token}` }
      );
      props.removeComment(_id);
    } catch {}
  };

  const editComment = () => {
    setEditMode(currentMode => !currentMode);
  };

  const submitHandler = async event => {
    event.preventDefault();
    const handleIt = async () => {
      try {
        const comment = {
          title: state.inputs.title.value,
          comment: state.inputs.comment.value
        };
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}/comments/${_id}`,
          "PATCH",
          JSON.stringify(comment),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token
          }
        );
        props.updateComment(_id, comment);
        setEditMode(false);
      } catch (error) {}
    };
    handleIt();
  };
  console.log(date);
  console.log(typeof date)
  const d1= new Date(date);
  d1.toLocaleDateString('en-US')
  console.log(d1)

  const formatDate = date=>{
    const d1= new Date(date);
    return d1.toLocaleString('en-NL')
  }
  return (
    <div>
      {!editMode ? (
        <div
          style={{
            border: "1px solid #008cff",
            color: "black",
            backgroundColor: "white",
            marginBottom: "10px",
            marginLeft: "10px",
            padding: "10px"
          }}
        >
          <h5>{title}</h5>
          <p>{comment}</p>
          <p>
            <strong>Date:</strong> {formatDate(date)}
          </p>
          <p>
            <strong>From Whom:</strong> {creator ? creator.name : null}
          </p>
          {hasRight && (
            <button
              className="edit-delete-button"
              style={{ margin: "10px" }}
              type="button"
              onClick={deleteComment}
            >
              Delete
            </button>
          )}
          {hasRight && (
            <button
              className="edit-delete-button"
              type="button"
              onClick={editComment}
            >
              Edit
            </button>
          )}
        </div>
      ) : (
        <div>
          <form className="comment-update-form" onSubmit={submitHandler}>
            <Input
              id="title"
              element="input"
              type="text"
              label="Title"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid title."
              onInput={inputHandler}
              initailValue={title}
              initailValid={true}
            />
            <Input
              id="comment"
              element="textarea"
              label="Message"
              validators={[VALIDATOR_MINLENGTH(5)]}
              errorText="Please enter a valid message (min. 5 characters)."
              onInput={inputHandler}
              initailValue={comment}
              initailValid={true}
            />
            <Button type="submit" disabled={!state.isValid}>
              SAVE
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
