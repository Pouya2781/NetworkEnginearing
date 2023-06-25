import React, { useState, useEffect, useRef } from "react";
import profile3 from "../assets/face3.png";
import landscape from "../assets/landscape.jpg";
import chatback from "../assets/chatback.jpg";
import { TbApps } from "react-icons/tb";
import { AiOutlineSend } from "react-icons/ai";
import { GrSettingsOption } from "react-icons/gr";
import { BsCardImage } from "react-icons/bs";
import { AiOutlineArrowDown } from "react-icons/ai";
import Message from "../components/Message";
import mountains from "../assets/mountains.jpg";
import download from "../assets/download.png";
import test from "../assets/test.png";
import test2 from "../assets/test2.png";
import test3 from "../assets/test3.png";
import Reply from "./Reply";
import Forward from "./Forward";

const Chats = ({ setChatId, setIsShowingContactChat, setMessageActionData, setIsMessageActionOpen, setIsReplyActionOpen, setReplyActionData, setCommentActionData, setIsCommentActionOpen, setIsForwardActionOpen, setForwardActionData, chatId, userId }) => {
  
  const [ messages, setMessages ] = useState([]);
  const [ chatName, setChatName ] = useState("");
  const [ profilePic, setProfilePic ] = useState(null);
  const [ profilePlaceHolder, setProfilePlaceHolder ] = useState("");
  const [ isProfilePlaceHolderVisible, setIsProfilePlaceHolderVisible ] = useState(false);
  const [ isAtBottom, setIsAtBottom ] = useState(true);
  let firstNameVar, lastNameVar, toUserIdVar, toFirstNameVar, toLastNameVar;
  const [ firstName, setFirstName ] = useState();
  const [ lastName, setLastName ] = useState();
  const [ toUserId, setToUserId ] = useState();
  const [ toFirstName, setToFirstName ] = useState();
  const [ toLastName, setToLastName ] = useState();

  const chatContainer = useRef(null);
  const input = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch('http://localhost:3001/api/chat/load', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  chatId: chatId,
                  chatType: "contact"
                }),
            });
            const json = await res.json();
            console.log(json);
            const { messages, chatData, userChatData } = json.data;

            setFirstName((chatData.user1.id == userId) ? chatData.user1.firstName : chatData.user2.firstName);
            setLastName((chatData.user1.id == userId) ? chatData.user1.lastName : chatData.user2.lastName)
            setToUserId((chatData.user1.id == userId) ? chatData.user2.id : chatData.user1.id);
            setToFirstName((chatData.user1.id == userId) ? chatData.user2.firstName : chatData.user1.firstName);
            setToLastName((chatData.user1.id == userId) ? chatData.user2.lastName : chatData.user1.lastName);
            
            firstNameVar = (chatData.user1.id == userId) ? chatData.user1.firstName : chatData.user2.firstName;
            lastNameVar = (chatData.user1.id == userId) ? chatData.user1.lastName : chatData.user2.lastName;
            toUserIdVar = (chatData.user1.id == userId) ? chatData.user2.id : chatData.user1.id;
            toFirstNameVar = (chatData.user1.id == userId) ? chatData.user2.firstName : chatData.user1.firstName;
            toLastNameVar = (chatData.user1.id == userId) ? chatData.user2.lastName : chatData.user1.lastName;
            setChatName(toFirstNameVar + ((toLastNameVar == null) ? "" : toLastNameVar));

      res = await fetch('http://localhost:3001/api/chat/user/profile-pic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  id: toUserIdVar,
                }),
            });

            if (res.ok) {
              const blob = await res.blob();
              const imageUrl = URL.createObjectURL(blob);
              setProfilePic(imageUrl);
            } else {
              setIsProfilePlaceHolderVisible(true);
              setProfilePlaceHolder(toFirstNameVar.charAt(0) + ((toLastNameVar == null) ? "" : toLastNameVar.charAt(0)));
            }
            
            setMessages(messages);
    };

    fetchData();

    //const interval = setInterval(fetchData, 1000);

    // return () => clearInterval(interval);
  }, []);

  const createMessage = (message, index) => {
    if (message.ChatDatum.messageType == "message") {
      return <Message
              setChatId={setChatId}
              setIsShowingContactChat={setIsShowingContactChat}
              chatType={"contact"}
              chatId={chatId}
              currentUserId={userId}
              currentFirstName={firstName}
              currentLastName={lastName}
              firstName={message.User.firstName}
              lastName={message.User.lastName}
              userId={message.User.id}
              isConnected={(index == 0) ? false : messages[index - 1].User.id === message.User.id}
              message={message.MessageDatum.message}
              isLeft={message.User.id != userId}
              isFirst={(index == 0) ? true : !(messages[index - 1].User.id === message.User.id)}
              isLast={(index == messages.length - 1) ? true : !(messages[index + 1].User.id === message.User.id)}
              image={message.MessageDatum.image}
              messageDataId={message.MessageDatum.id}
              loadImage={true}
              timestamp={new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/^0(\d+)/, '$1')}
              score={message.MessageDatum.isScorable ? message.MessageDatum.score : undefined}
              scoreCount={message.MessageDatum.isScorable ? message.MessageDatum.scoreCount : undefined}
              viewCount={message.MessageDatum.isViewable ? message.MessageDatum.viewCount : undefined}
              replyCount={message.MessageDatum.isRepliable? message.MessageDatum.replyCount :  undefined}
              forwardCount={message.MessageDatum.isForwardable? message.MessageDatum.forwardCount : undefined}
              commentCount={message.MessageDatum.isCommentable ? message.MessageDatum.commentCount : undefined}
              isRepliable={message.MessageDatum.isRepliable}
              isForwardable={message.MessageDatum.isForwardable}
              isScorable={message.MessageDatum.isScorable}
              isCommentable={message.MessageDatum.isCommentable}
              isRedirectable={message.MessageDatum.isRedirectable}
              displayBorder={false}
              displayProfilePic={true}
              setReplyActionData={setReplyActionData}
              setIsReplyActionOpen={setIsReplyActionOpen}
              setCommentActionData={setCommentActionData}
              setIsCommentActionOpen={setIsCommentActionOpen}
              setForwardActionData={setForwardActionData}
              setIsForwardActionOpen={setIsForwardActionOpen}
            />
    } else if (message.ChatDatum.messageType == "reply") {
      return <Reply
              setChatId={setChatId}
              setIsShowingContactChat={setIsShowingContactChat}
              chatType={"contact"}
              chatId={chatId}
              currentUserId={userId}
              isConnected={(index == 0) ? false : messages[index - 1].User.id === message.User.id}
              currentFirstName={firstName}
              currentLastName={lastName}
              firstName={message.User.firstName}
              lastName={message.User.lastName}
              userId={message.User.id}
              message={message.replyMessageData.message}
              isLeft={message.User.id != userId}
              isFirst={(index == 0) ? true : !(messages[index - 1].User.id === message.User.id)}
              isLast={(index == messages.length - 1) ? true : !(messages[index + 1].User.id === message.User.id)}
              image={message.replyMessageData.image}
              messageDataId={message.replyMessageData.id}
              loadImage={true}
              timestamp={new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/^0(\d+)/, '$1')}
              score={message.replyMessageData.isScorable ? message.replyMessageData.score : undefined}
              scoreCount={message.replyMessageData.isScorable ? message.replyMessageData.scoreCount : undefined}
              viewCount={message.replyMessageData.isViewable ? message.replyMessageData.viewCount : undefined}
              replyCount={message.replyMessageData.isRepliable? message.replyMessageData.replyCount :  undefined}
              forwardCount={message.replyMessageData.isForwardable? message.replyMessageData.forwardCount : undefined}
              commentCount={message.replyMessageData.isCommentable ? message.replyMessageData.commentCount : undefined}
              isRepliable={message.replyMessageData.isRepliable}
              isForwardable={message.replyMessageData.isForwardable}
              isScorable={message.replyMessageData.isScorable}
              isCommentable={message.replyMessageData.isCommentable}
              isRedirectable={message.replyMessageData.isCommentable}
              replyToFirstName={message.messageData.User.firstName}
              replyToLastName={message.messageData.User.lastName}
              replyMessage={message.messageData.message}
              replyImage={message.messageData.image}
              toMessageDataId={message.messageData.id}
              loadReplyImage={true}
              displayBorder={false}
              displayProfilePic={true}
              setReplyActionData={setReplyActionData}
              setIsReplyActionOpen={setIsReplyActionOpen}
              setCommentActionData={setCommentActionData}
              setIsCommentActionOpen={setIsCommentActionOpen}
              setForwardActionData={setForwardActionData}
              setIsForwardActionOpen={setIsForwardActionOpen}
            />
    } else {
      return <Forward
              setChatId={setChatId}
              setIsShowingContactChat={setIsShowingContactChat}
              chatType={"contact"}
              chatId={chatId}
              currentUserId={userId}
              currentFirstName={firstName}
              currentLastName={lastName}
              firstName={message.User.firstName}
              lastName={message.User.lastName}
              userId={message.User.id}
              isConnected={(index == 0) ? false : messages[index - 1].User.id === message.User.id}
              message={message.MessageDatum.message}
              isLeft={message.User.id != userId}
              isFirst={(index == 0) ? true : !(messages[index - 1].User.id === message.User.id)}
              isLast={(index == messages.length - 1) ? true : !(messages[index + 1].User.id === message.User.id)}
              image={message.MessageDatum.image}
              messageDataId={message.MessageDatum.id}
              loadImage={true}
              timestamp={new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/^0(\d+)/, '$1')}
              score={message.MessageDatum.isScorable ? message.MessageDatum.score : undefined}
              scoreCount={message.MessageDatum.isScorable ? message.MessageDatum.scoreCount : undefined}
              viewCount={message.MessageDatum.isViewable ? message.MessageDatum.viewCount : undefined}
              replyCount={message.MessageDatum.isRepliable? message.MessageDatum.replyCount :  undefined}
              forwardCount={message.MessageDatum.isForwardable? message.MessageDatum.forwardCount : undefined}
              commentCount={message.MessageDatum.isCommentable ? message.MessageDatum.commentCount : undefined}
              isRepliable={message.MessageDatum.isRepliable}
              isForwardable={message.MessageDatum.isForwardable}
              isScorable={message.MessageDatum.isScorable}
              isCommentable={message.MessageDatum.isCommentable}
              isRedirectable={message.MessageDatum.isRedirectable}
              forwardedFromFirstName={message.MessageDatum.User.firstName}
              forwardedFromLastName={message.MessageDatum.User.lastName}
              displayBorder={false}
              displayProfilePic={true}
              setReplyActionData={setReplyActionData}
              setIsReplyActionOpen={setIsReplyActionOpen}
              setCommentActionData={setCommentActionData}
              setIsCommentActionOpen={setIsCommentActionOpen}
              setForwardActionData={setForwardActionData}
              setIsForwardActionOpen={setIsForwardActionOpen}
            />
    }
  }
  
  const handleClickSend = async () => {
    if (Math.abs((chatContainer.current.scrollHeight - chatContainer.current.scrollTop) - chatContainer.current.clientHeight) < 100) setIsAtBottom(true);
    else setIsAtBottom(false);
    
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('chatType', "contact");
    formData.append('message', input.current.value);

    const res = await fetch('http://localhost:3001/api/user/message', {
                method: 'POST',
                headers: {
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: formData
            });
  };

  const handleClickUpload = () => {
    setMessageActionData({
      chatId: chatId,
      userId: userId,
      toUserId: toUserId,
      firstName: firstName,
      lastName: lastName,
      toFirstName: toFirstName,
      toLastName: toLastName
    });
    setIsMessageActionOpen(true);
  };

  useEffect(() => {
    if (isAtBottom && chatContainer.current.lastElementChild != null) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    chatContainer.current.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  return (
    <div className="hidden md:flex flex-col justify-between items-center w-full bg-[#eeedef] border-l relative  rounded-r-[2rem]  ">
      {/* Header */}
      <div className=" flex justify-between items-center px-4  w-full h-[4.5rem] z-20 bg-[#eeedef] rounded-tr-[2rem]">
        <div className="flex items-center">
          <div className="flex justify-center items-center w-[3.1rem] h-[3.1rem] bg-[#dda117] rounded-full shrink-0 ">
          {!isProfilePlaceHolderVisible && <img
              src={profilePic}
              alt=""
              className="object-cover rounded-full p-1"
            />}
            {isProfilePlaceHolderVisible && <div className="object-cover text-[20px] rounded-full p-1 text-white/90 font-medium" >{profilePlaceHolder}</div>}
          </div>
          <div className="pl-2 ">
            <p className="font-bold text-black/90">{chatName}</p>
            {/* <p className="text-[14px] w-[35rem] whitespace-nowrap truncate text-gray-400 ">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p> */}
          </div>
        </div>

        {/* <div className="text-[23px]">
          <GrSettingsOption />
        </div> */}
      </div>
      {/* Messages */}
      <div className="chats absolute top-0 w-full  h-full ">
        <div className="absolute flex h-full w-full lg:hidden  rounded-r-[2rem]">
          <img
            src={landscape}
            alt=""
            className="object-cover h-full w-full rounded-r-[3rem]"
          />
        </div>
        <div className="chat-img hidden lg:flex absolute   h-full w-full rounded-tr-[3rem]">
          <img
            src={chatback}
            alt=""
            className="object-cover h-full w-full rounded-r-[3.1rem]"
          />
        </div>
        <div ref={chatContainer} className="chat-container relative z-20 mt-3 lg:mt-4">
          {messages.map((message, index) => createMessage(message, index))}
        </div>
        <AiOutlineArrowDown onClick={scrollToBottom} className="z-30 cursor-pointer bg-gray-400/80 p-1 rounded-[1rem] fixed bottom-[6.5rem] ml-4 pb-1 pl-1 w-9 h-9 cursor-pointer"/>
      </div>

      {/* Input for message */}
      <div className="h-[3.5rem] relative z-20  bottom-0 bg-[#eeedef]  w-full px-4 py-2 flex items-center rounded-br-[3rem]   ">
        <div className="">
          <BsCardImage className="w-10 h-10 pr-1 pl-1 -mr-2 -ml-1 cursor-pointer hover:bg-gray-300 rounded-[0.5rem]" onClick={handleClickUpload}/>
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full mx-4 p-2 rounded-full pl-4"
          ref={input}
        />
        <div
          className="flex w-8 h-8 hover:bg-gray-300 rounded-[1rem] items-start"
        >
          <AiOutlineSend className="pb-1 pl-1 w-9 h-9 cursor-pointer" onClick={handleClickSend}/>
        </div>
      </div>
    </div>
  );
};

export default Chats;
