import React, { useContext, useState, useEffect, useRef } from "react";
import useHttpClient from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import Card from "../../shared/component/UIElements/Card";
import ErrorModal from "../../shared/component/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/component/UIElements/LoadingSpinner";
import "./Messages.css";
import { Link } from "react-router-dom";
import { MessageContext } from "../../shared/context/message-context";
import Input from "../../shared/component/formElements/Input";
import { useFrom } from "../../shared/hooks/form-hook";
import { VALIDATOR_REQUIRE } from "../../shared/Util/validators";
import Button from "../../shared/component/formElements/Button";
import MessageItem from "../components/MessageItem";
import Avatar from "../../shared/component/UIElements/Avatar";

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { token } = useContext(AuthContext);
  const message = useContext(MessageContext);
  const [allMessages, setAllMessages] = useState(message.messagesData);

  // scroll to the bottom of the messages box
  const myScrollRef = useRef();
  const scrollToBottom = () => {
    console.log("scrolling");
    myScrollRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const [state, inputHandler] = useFrom(
    {
      message: {
        value: "",
        isValid: false,
      },
    },
    false,
  );

  // fetching contacts (only texted ones not all users)
  const fetchContacts = async () => {
    try {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/messages`,
        "GET",
        null,
        {
          Authorization: `Bearer ${token}`,
        },
      );
      setContacts(data.corresponders);
      scrollToBottom();
    } catch (error) {}
  };

  useEffect(() => {
    fetchContacts();
    scrollToBottom();
  }, []);

  // Send a message
  const sendMessage = async e => {
    e.preventDefault();
    const corresponderId = message.id;
    const messageValue = state.inputs.message.value;
    try {
      const res = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/messages/${corresponderId}`,
        "POST",
        JSON.stringify({
          message: messageValue,
        }),
        {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      );
      setAllMessages([...allMessages, { message: messageValue, isSent: true, _id: res.messageId }]);
      scrollToBottom();
    } catch (error) {
      console.error(error);
    }
  };

  // unfinished function to reset the clicked user in the first index of the contacts
  // const reArrangeContacts = id => {
  //   let myArr = [...contacts];
  //   const textedUser = myArr.findIndex(user => user.corresponder._id === id);
  //   const selectedUser = myArr.splice(textedUser, 1);
  //   setContacts([...selectedUser, ...myArr]);
  // };

  // Get all messages as per the texted person
  const getUserMessages = async id => {
    const corresponderId = id;
    // reArrangeContacts(id);
    try {
      const fetchedMessages = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/user/messages/${corresponderId}`,
        "GET",
        null,
        {
          Authorization: "Bearer " + token,
        },
      );
      fetchContacts();
      setAllMessages(fetchedMessages.messages);
      message.id = corresponderId;
    } catch (error) {
      console.error(error);
    }
  };

  // Delete a corresponder
  const dltCorresponder = async id => {
    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/user/messages/${id}`, "DELETE", null, {
      Authorization: "Bearer " + token,
    });
    const filteredContacts = contacts.filter(contact => contact._id !== id);
    setContacts(filteredContacts);
    setAllMessages([]);
    fetchContacts();
  };

  const msgBoxHeight = { height: window.innerHeight - 0.12 * window.innerHeight };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      <ErrorModal error={error} onClear={clearError} />

      {!isLoading && (
        <Card className="messages__card" style={msgBoxHeight}>
          {/* Contacts */}
          <div className="contacts__container">
            <h2 className="header">Recent</h2>
            <div className="contacts__box">
              {contacts.length > 0 &&
                contacts.map(contact => (
                  <Card
                    className="user-item__content"
                    key={contact.corresponder._id}
                    className={` user-item__content ${message.id === contact.corresponder._id &&
                      "activatedContact"}`}
                  >
                    <div
                      onClick={() => getUserMessages(contact.corresponder._id)}
                      className={`cardWidth`}
                    >
                      <div className="user-item__image">
                        <Avatar
                          image={contact.corresponder.image}
                          alt={contact.corresponder.name}
                        />
                      </div>
                      <div className="user-item__info">
                        <h3>{contact.corresponder.name}</h3>
                      </div>
                    </div>
                    <button onClick={() => dltCorresponder(contact.corresponder._id)}>X</button>
                  </Card>
                ))}
            </div>
            <div className="innerBox">
              {contacts.length === 0 && <Link to="/">Text a user</Link>}
            </div>
          </div>

          {/* Messages */}
          <div className="message__box">
            <h2 className="header">Messages</h2>
            <div className="msgsContainer">
              {allMessages.length > 0 ? (
                allMessages.map((msg, i) => (
                  <MessageItem
                    key={i}
                    msg={msg}
                    allMessages={allMessages}
                    setAllMessages={setAllMessages}
                    getUserMessages={getUserMessages}
                  />
                ))
              ) : (
                <div>Start a message!</div>
              )}
              <div ref={myScrollRef}></div>
            </div>
            <Input
              id="message"
              type="text"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter your message"
              onInput={inputHandler}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </Card>
      )}
    </React.Fragment>
  );
};
export default Messages;
