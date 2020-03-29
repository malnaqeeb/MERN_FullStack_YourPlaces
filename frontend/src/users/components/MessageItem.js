import React, { useContext, Fragment } from "react";
import { MessageContext } from "../../shared/context/message-context";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./MessageItem.css";

const MessageItem = ({ msg, setAllMessages, allMessages, getUserMessages }) => {
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
      },
    );
    const filteredMessages = allMessages.filter(m => m.id !== msgId);

    setAllMessages(filteredMessages);
    getUserMessages(userId);
  };

  return (
    <div key={msg._id} className={`mContainer ${msg.isSent ? "myMsg" : "userMsg"}`}>
      <div className={`msgInfo ${msg.isSent ? "toRyt" : "toLeft"}`}>
        {msg.isSent ? (
          <Fragment>
            <p>{msg.date}</p>
            <button onClick={() => delMessage(message.id, msg._id)}>x</button>
          </Fragment>
        ) : (
          <Fragment>
            <button onClick={() => delMessage(message.id, msg._id)}>x</button>
            <p>{msg.date}</p>
          </Fragment>
        )}
      </div>
      <h3>{msg.message}</h3>
    </div>
  );
};

export default MessageItem;
