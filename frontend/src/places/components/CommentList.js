import React from "react";
import Comment from "./Comment";
import "./CommentList.css";
export default function CommentList({
  comments,
  removeComment,
  updateComment,
}) {
  return (
    <div>
      {comments && comments.length > 0 ? (
        <React.Fragment>
          <h5 className="comments-counter">
            <span>{comments.length}</span> Comment
            {comments.length === 1 ? " " : "s"}
          </h5>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              removeComment={removeComment}
              updateComment={updateComment}
            />
          ))}
        </React.Fragment>
      ) : (
        <div className="comment-list">Be the first to comment</div>
      )}
    </div>
  );
}
