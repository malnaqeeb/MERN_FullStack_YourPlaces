import React, { useContext, Fragment } from "react";
import { MessageContext } from "../../shared/context/message-context";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./MessageItem.css";

const MessageItem = ({ msg, messageDeleteHandler, getUserMessages }) => {
  const message = useContext(MessageContext);
  const { sendRequest } = useHttpClient();
  const { token } = useContext(AuthContext);

  const delMessage = async (userId, msgId) => {
    await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/user/messages/${userId}/${msgId}`,
      "DELETE",
      null,
      {
        Authorization: "Bearer " + token,
      }
    );

    messageDeleteHandler(msgId);
    getUserMessages(userId);
  };
  const formatDate = (date) => {
    const d1 = new Date(date);
    return d1.toLocaleString("en-NL");
  };
  return (
    <div
      key={msg._id}
      className={`mContainer ${msg.isSent ? "myMsg" : "userMsg"}`}
    >
      <div className={`msgInfo ${msg.isSent ? "toRyt" : "toLeft"}`}>
        {msg.isSent ? (
          <Fragment>
            <p>{formatDate(msg.date)}</p>
            <button onClick={() => delMessage(message.id, msg._id)}>x</button>
          </Fragment>
        ) : (
          <Fragment>
            <button onClick={() => delMessage(message.id, msg._id)}>x</button>
            <p>{formatDate(msg.date)}</p>
          </Fragment>
        )}
      </div>
      <p>{msg.message}</p>
    </div>
  );
};

export default MessageItem;
