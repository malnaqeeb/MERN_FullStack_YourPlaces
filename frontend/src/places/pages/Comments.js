import React, { useState, useEffect } from "react";

import useHttpClient from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import CommentForm from "../components/CommentForm";
import CommentList from "../components/CommentList";

export default function Comments({ placeId }) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [comments, setComments] = useState();

  useEffect(() => {
    const getComments = async () => {
      try {
        const commentsData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}/comments`
        );
        setComments(commentsData.comments);
      } catch {}
    };
    getComments();
  }, [placeId]);

  const addComment = (comment) => {
    setComments((currentComments) => [...currentComments, comment]);
  };

  const removeComment = (commentId) => {
    setComments((currentComments) =>
      currentComments.filter((comment) => comment._id !== commentId)
    );
  };

  const updateComment = (id, comment) => {
    setComments((currentComments) =>
      currentComments.map((c) => {
        if (c._id === id) {
          const newComment = {
            _id: id,
            creator: { ...c.creator },
            title: comment.title,
            comment: comment.comment,
          };
          return newComment;
        }
        return c;
      })
    );
  };

  return (
    <div className="center flex-column width-60">
      {isLoading && <LoadingSpinner />}
      <ErrorModal error={error} onClear={clearError} />
      <CommentForm
        addComment={addComment}
        placeId={placeId}
        className="width-60"
      />
      {!isLoading && (
        <CommentList
          removeComment={removeComment}
          updateComment={updateComment}
          comments={comments}
        />
      )}
    </div>
  );
}
