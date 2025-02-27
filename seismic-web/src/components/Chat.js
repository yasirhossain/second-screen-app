import React, { useRef, useState, useEffect, useContext } from 'react';
import { UserContext, EventsContext } from '../Context';

import '../styles/Chat.scss';

import { db, analytics } from '../modules/firebase';
import firebase from 'firebase/compat/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import ChatMessage from './ChatMessage';

import Filter from 'bad-words';

import { MAX_CHAT_CAR_COUNT } from '../helpers/constants';
import { connectFirestoreEmulator } from 'firebase/firestore';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import Avatar from '@mui/material/Avatar';

import AvatarPicker from './AvatarPicker';

function Chat(props) {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const messagesRef = db.collection('messages');
  const query = messagesRef.orderBy('createdAt').limitToLast(50);
  const [messages, setMessages] = useCollectionData(query, { idField: 'id' });
  const [message, setMessage] = useState('');
  const [placeholder, setPlaceholder] = useState('Join the convo!');
  const [charCount, setCharCount] = useState(MAX_CHAT_CAR_COUNT);
  const [error, setError] = useState('');
  const [lastMessage, setLastMessage] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [replyMessage, setReplyMessage] = useState(null);
  const messagesEndRef = useRef();
  const isInitialMount = useRef(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTimeout(function () {
      if (isInitialMount.current) {
        isInitialMount.current = false;
        scrollToBottom();
      }
    }, 1000);

    //console.log(messages);
  }, [messages]);

  function validateMessage(message) {
    const messageLength = message.length;
    const trimedValueLength = message.trim().length;
    const badWordFilter = new Filter();

    let isValid = true;

    // TODO: Give feedback to user

    if (messageLength == 0) {
      setError('Sorry, no empty messages.');
      isValid = false;
    } else if (trimedValueLength < 2) {
      setError('Please type a longer message.');
      isValid = false;
    } else if (messageLength > MAX_CHAT_CAR_COUNT) {
      setError('Please type a shorter message.');
      isValid = false;
    } else if (message === lastMessage) {
      setError('Sorry, no duplicate messages.');
      isValid = false;
    } else if (badWordFilter.isProfane(message)) {
      setError('Please keep it PG!');
      isValid = false;
    }

    if (!isValid) {
      setTimeout(() => {
        setError('');
      }, 2000);
    }

    return isValid;
  }

  function clearInput() {
    //setLastMessage('');
    setMessage('');
    setError('');
    setIsValid(true);
    setReplyMessage(null);
    setCharCount(MAX_CHAT_CAR_COUNT);
  }

  function onSubmitMessage(e) {
    e.preventDefault();

    // validate message
    if (validateMessage(message)) {
      // send message to firebase
      // sendChatMessage(newMessage, messageToReply);
      // clear input

      clearInput();
      sendMessage();

      setTimeout(() => {
        scrollToBottom();
      }, 500);
    }
  }

  const sendMessage = async () => {
    const { uid, role, displayName, avatarUrl, chatName } = currentUser;
    const likes = 0;

    let tempMessage = {
      text: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      role,
      displayName,
      avatarUrl,
      chatName,
      likes,
    };

    await messagesRef.add(tempMessage);
    firebase.analytics().logEvent('chat_message_sent');
  };

  const charCounter = (e) => {
    console.log(e);
    setMessage(e);
    // setCharCount - charCount -
  };

  function reply(m) {
    setReplyMessage(m);
    console.log(replyMessage);
  }

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({
      behavior: 'smooth',
      inline: 'nearest',
    });
  };

  const handleAvatarPickerOpen = () => {
    setOpen(true);
  };

  const handleAvatarPickerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <AvatarPicker open={open} setOpen={setOpen} />
      <main className="chat">
        {messages &&
          messages.map((msg) => (
            <ChatMessage
              key={msg.createdAt}
              message={msg}
              user={currentUser}
              replyMessage={replyMessage}
              reply={reply}
            />
          ))}
        <div style={{ float: 'left', clear: 'both' }} ref={messagesEndRef} />
      </main>
      <form onSubmit={onSubmitMessage} className="chatInput">
        <div className="inputContainer">
          <Avatar
            sx={{ width: 35, height: 35 }}
            src={currentUser && currentUser.avatarUrl}
            onClick={handleAvatarPickerOpen}
          />
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={placeholder}
          />
          <button type="submit" disabled={!isValid}>
            <ArrowCircleUpIcon sx={{ color: '#1976d2', fontSize: 40 }} />
          </button>
        </div>
      </form>
    </>
  );
}

export default Chat;
