import React, { useContext, Fragment, useState } from "react";
import { TextField } from "@material-ui/core";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import Button from "../../shared/component/formElements/Button";

import "./CommentForm.css";
export default function CommentForm({ addComment, placeId }) {
  const auth = useContext(AuthContext);
  const [commentText, setCommentText] = useState("");

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

        setCommentText("");
      } catch (error) {}
    };
    createComment();
  };
  const commentHandler = (e) => setCommentText(e.target.value);

  return (
    <div className="container">
      <div className={`add_comment-container`} noValidate>
        <Fragment>
          <ErrorModal error={error} onClear={clearError} />
          {isLoading && <LoadingSpinner />}
          {auth.isLoggedIn && (
            <form className="comment-form">
              <TextField
                className="input-comment"
                label="Write your comment here ..."
                onChange={commentHandler}
                value={commentText}
                required
              ></TextField>
              <Button id="comment-button" onClick={submitHandler}>
                Add Comment
              </Button>
            </form>
          )}
        </Fragment>
      </div>
    </div>
  );
}
