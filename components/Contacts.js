import React from "react";
import Contact from "./Contact";

const Contacts = ({ contacts, userId, setChatId, setIsShowingContactChat }) => {

  const getImage = (contact) => {
    console.log(contact);
    let image = null;
    if (contact.latestMessage.ChatDatum.messageType == "reply") {
      image = contact.latestMessage.replyMessageData.image;
    } else {
      image = contact.latestMessage.MessageDatum.image;
    }
    return image;
  }

  const getTimeStamp = (contact) => {
    let timeStamp = null;
    if (contact.latestMessage.ChatDatum.messageType == "reply") {
      timeStamp = contact.latestMessage.replyMessageData.createdAt;
    } else {
      timeStamp = contact.latestMessage.MessageDatum.createdAt;
    }
    return timeStamp;
  }

  const getMessageDataId = (contact) => {
    let messageDataId = null;
    if (contact.latestMessage.ChatDatum.messageType == "reply") {
      messageDataId = contact.latestMessage.replyMessageData.id;
    } else {
      messageDataId = contact.latestMessage.MessageDatum.id;
    }
    return messageDataId;
  }

  const getMessage = (contact) => {
    let message = null;
    if (contact.latestMessage.ChatDatum.messageType == "reply") {
      message = contact.latestMessage.replyMessageData.message;
    } else {
      message = contact.latestMessage.MessageDatum.message;
    }
    return message;
  }

  const getUserId = (contact, userId) => {
    return (userId == contact.ContactChat.user1.id) ? contact.ContactChat.user2.id : contact.ContactChat.user1.id;
  }

  const getFirstName = (contact, userId) => {
    return (userId == contact.ContactChat.user1.id) ? contact.ContactChat.user2.firstName : contact.ContactChat.user1.firstName;
  }

  const getLastName = (contact, userId) => {
    return (userId == contact.ContactChat.user1.id) ? contact.ContactChat.user2.lastName : contact.ContactChat.user1.lastName;
  }

  return (
    <div className="contacts md:w-[20rem] lg:w-[30rem]  md:px-4  ">
      {contacts.map((contact) => (
        <Contact
          image={getImage(contact)}
          loadImage={true}
          timeStamp={new Date(getTimeStamp(contact)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/^0(\d+)/, '$1')}
          messageDataId={getMessageDataId(contact)}
          message={getMessage(contact)}
          userId={getUserId(contact, userId)}
          firstName={getFirstName(contact, userId)}
          lastName={getLastName(contact, userId)}
          chatId={contact.chatId}
          setChatId={setChatId}
          setIsShowingContactChat={setIsShowingContactChat}
        />
      ))}
    </div>
  );
};

export default Contacts;
