import React, { useContext, useState } from "react";
import { Button } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useParams } from "react-router-dom";
import Input from "../../shared/component/formElements/Input";
import { useFrom } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/Util/validators";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Moment from "react-moment";

import "./Comment.css";

export default function Comment(props) {
  const [editMode, setEditMode] = useState(false);
  const { _id, creator, comment, date } = props.comment;
  const { sendRequest } = useHttpClient();
  const auth = useContext(AuthContext);
  const hasRight =
    creator && auth && auth.userId && creator._id === auth.userId;
  const placeId = useParams().placeId;
  const [state, inputHandler] = useFrom(
    {
      comment: {
        value: comment,
        isValid: false,
      },
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
    setEditMode((currentMode) => !currentMode);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const handleIt = async () => {
      try {
        const comment = {
          comment: state.inputs.comment.value,
        };
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}/comments/${_id}`,
          "PATCH",
          JSON.stringify(comment),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        props.updateComment(_id, comment);
        setEditMode(false);
      } catch (error) {}
    };
    handleIt();
  };

  return (
    <div className="container">
      {!editMode ? (
        <div className="comment-container row">
          <div className="commenter-info">
            {creator && (
              <img
                src={creator.image}
                alt={creator.name}
                width="60"
                height="60"
              />
            )}
            <h4>{creator && creator.name}</h4>

            <Moment className="date" format="MMMM Do YYYY, h:mm:ss a">
              {date}
            </Moment>
          </div>

          <div className="comments-holder">
            <p>{comment}</p>
          </div>
          <div className="btn-holder">
            {hasRight && (
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteComment}
                startIcon={<DeleteIcon />}
                size="small"
                style={{ marginRight: "10px" }}
              >
                Delete
              </Button>
            )}
            {hasRight && (
              <Button
                variant="contained"
                onClick={editComment}
                startIcon={<EditIcon />}
                size="small"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="conatiner">
          <form className="comment-update-form" onSubmit={submitHandler}>
            <Input
              id="comment"
              element="input"
              label="comment"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a valid message (min. 5 characters)."
              onInput={inputHandler}
              initailValue={comment}
              initailValid={true}
            />
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              disabled={!state.isValid}
            >
              Update
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
