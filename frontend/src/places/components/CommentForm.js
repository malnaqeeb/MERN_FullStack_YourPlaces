import React, { useContext, Fragment, useState } from "react";
import { TextField } from "@material-ui/core";

import useHttpClient from "../../shared/hooks/http-hook";
import { useFrom } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import Button from "../../shared/component/formElements/Button";

import "./CommentForm.css";
export default function CommentForm({ addComment, placeId }) {
  const auth = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [state, setFormData] = useFrom(
    {
      comment: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const submitHandler = async (event) => {
    event.preventDefault();

    const createComment = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}/comments`,
          "POST",
          JSON.stringify({
            comment: commentText,
          }),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
        addComment(data.comment);
        setFormData(
          {
            comment: {
              value: "",
              isValid: false,
            },
          },
          false
        );
        setCommentText("");
      } catch (error) {}
    };
    createComment();
  };
  const commentHandler = (e) => setCommentText(e.target.value);

  return (
    <div className={`add_comment-container`} noValidate>
      <Fragment>
        <ErrorModal error={error} onClear={clearError} />
        {isLoading && <LoadingSpinner />}
        {auth.isLoggedIn && (
          <form className="comment-form">
            <TextField
              style={{
                backgroundColor: "white",
                borderRadius: "4px",
              }}
              label="Write your comment here ..."
              onChange={commentHandler}
            ></TextField>
            <Button id="comment-button" onClick={submitHandler}>
              Add Comment
            </Button>
          </form>
        )}
      </Fragment>
    </div>
  );
}
