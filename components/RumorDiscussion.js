import React, { useState, useEffect, useRef } from "react";
import landscape from "../assets/landscape.jpg";
import chatback from "../assets/chatback.jpg";
import { TbApps } from "react-icons/tb";
import { AiOutlineSend } from "react-icons/ai";
import { GrSettingsOption } from "react-icons/gr";
import { BsCardImage } from "react-icons/bs";
import { AiOutlineArrowDown } from "react-icons/ai";
import { AiOutlineArrowUp } from "react-icons/ai";
import Message from "../components/Message";
import mountains from "../assets/mountains.jpg";
import download from "../assets/download.png";
import Reply from "./Reply";
import Forward from "./Forward";
import Timestamp from "./Timestamp";
import View from "./View";
import Score from "./Score";
import ScoreCount from "./ScoreCount";
import CommentCount from "./CommentCount";
import ReplyCount from "./ReplyCount";
import ForwardCount from "./ForwardCount";
import RateAction from "./RateAction";
import { TbArrowForwardUp } from "react-icons/tb";
import { CgFileDocument } from "react-icons/cg";

const RumorDiscussion = ({ setChatId, setIsShowingContactChat, chatId, userId, setCommentActionData, setIsCommentActionOpen, setReplyActionData, setIsReplyActionOpen, setIsForwardActionOpen, setForwardActionData }) => {
  
  let firstNameVar, lastNameVar;
  const [ messageDataIdState, setMessageDataIdState ] = useState(null);
  const [ messages, setMessages ] = useState([]);
  const [ scores, setScores ] = useState([]);
  const [ forwardCount, setForwardCount ] = useState(0);
  const [ replyCount, setReplyCount ] = useState(0);
  const [ score, setScore ] = useState(0);
  const [ scoreCount, setScoreCount ] = useState(0);
  const [ commentCount, setCommentCount ] = useState(0);
  const [ viewCount, setViewCount ] = useState(0);
  const [ isAtBottom, setIsAtBottom ] = useState(true);
  const [ firstName, setFirstName ] = useState();
  const [ lastName, setLastName ] = useState();

  const chatContainer = useRef(null);
  const input = useRef(null);
  
  const handleClickSend = async () => {
    if (Math.abs((chatContainer.current.scrollHeight - chatContainer.current.scrollTop) - chatContainer.current.clientHeight) < 100) setIsAtBottom(true);
    else setIsAtBottom(false);

    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('chatType', "rumor");
    formData.append('message', input.current.value);

    const res = await fetch('http://localhost:3001/api/user/message', {
                method: 'POST',
                headers: {
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: formData
            });
  };

  const handleClickForward = () => {
    setForwardActionData({
      messageDataId: messages[0].MessageDatum.id,
      userId: userId,
    })
    setIsForwardActionOpen(true);
  }

  const handleClickUpload = () => {
    setCommentActionData({
      messageDataId: messages[0].MessageDatum.id,
      userId: userId,
      firstName: firstName,
      lastName: lastName,
    })
    setIsCommentActionOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch('http://localhost:3001/api/user/info', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                }
            });
            const json2 = await res.json();
            console.log(json2);
            console.log(json2.data.firstName);
            console.log(json2.data.lastName);

            setFirstName(json2.data.firstName);
            setLastName(json2.data.lastName);
            
            firstNameVar = json2.data.firstName;
            lastNameVar = json2.data.lastName;
      res = await fetch('http://localhost:3001/api/chat/load', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  chatId: chatId,
                  chatType: "rumor"
                }),
            });
            const json = await res.json();
            console.log(json);
            const { messages, chatData, userChatData } = json.data;

      res = await fetch('http://localhost:3001/api/chat/message/scores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  id: chatData.MessageDatum.id,
                }),
            });
            const json3 = await res.json();
            console.log(json3);

            setMessageDataIdState(chatData.MessageDatum.id);
            setForwardCount(chatData.MessageDatum.forwardCount);
            setReplyCount(chatData.MessageDatum.replyCount);
            setScore(chatData.MessageDatum.score);
            setScoreCount(chatData.MessageDatum.scoreCount);
            setCommentCount(chatData.MessageDatum.commentCount);
            setViewCount(chatData.MessageDatum.viewCount);
            setScores(json3.data)
            setMessages(messages);
    };

    fetchData();

    //const interval = setInterval(fetchData, 1000);

    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAtBottom && chatContainer.current.lastElementChild != null) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainer.current.lastElementChild != null)
      chatContainer.current.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  const scrollToTop = () => {
    if (chatContainer.current.firstElementChild != null)
    console.log(chatContainer.current.firstElementChild);
      chatContainer.current.firstElementChild.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const createMessage = (message, index) => {
    const currentMessageUserScore = scores.find(s => s.userId == message.User.id);
    if (message.ChatDatum.messageType == "message") {
      return <Message
              className={(index == 0) ? "justify-center mb-[7rem] mt-10" : ""}
              setChatId={setChatId}
              setIsShowingContactChat={setIsShowingContactChat}
              chatType={"rumor"}
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
              score={message.MessageDatum.isScorable ? message.MessageDatum.score : (currentMessageUserScore != undefined ? currentMessageUserScore.score : undefined)}
              scoreCount={message.MessageDatum.isScorable ? message.MessageDatum.scoreCount : undefined}
              viewCount={message.MessageDatum.isViewable ? message.MessageDatum.viewCount : undefined}
              replyCount={message.MessageDatum.isRepliable? message.MessageDatum.replyCount :  undefined}
              forwardCount={message.MessageDatum.isForwardable? message.MessageDatum.forwardCount : undefined}
              commentCount={message.MessageDatum.isCommentable ? message.MessageDatum.commentCount : undefined}
              isRepliable={(index == 0) ? false : message.MessageDatum.isRepliable}
              isForwardable={(index == 0) ? false : message.MessageDatum.isForwardable}
              isScorable={(index == 0) ? false : message.MessageDatum.isScorable}
              isCommentable={(index == 0) ? false : message.MessageDatum.isCommentable}
              isRedirectable={(index == 0) ? false : message.MessageDatum.isRedirectable}
              displayBorder={(index == 0) ? true : false}
              displayProfilePic={(index == 0) ? false : true}
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
              chatType={"rumor"}
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
              score={message.replyMessageData.isScorable ? message.replyMessageData.score : (currentMessageUserScore != undefined ? currentMessageUserScore.score : undefined)}
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
              chatType={"rumor"}
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
              score={message.MessageDatum.isScorable ? message.MessageDatum.score : (currentMessageUserScore != undefined ? currentMessageUserScore.score : undefined)}
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
  

  return (
    <div className="hidden md:flex flex-col justify-between items-center w-full bg-[#eeedef] border-l relative  rounded-r-[2rem]  ">
      {/* Header */}
      <div className=" flex justify-between items-center px-4  w-full h-[4.5rem] z-20 bg-[#eeedef] rounded-tr-[2rem]">
        <div className="flex items-center">
          <div className="pl-2 ">
            <p className="text-[18px] font-bold text-black/90">Discussion</p>
            <div className="flex justify-start break-words -ml-2 pt-1">
              <ForwardCount forwardCount={forwardCount}/>
              <ReplyCount replyCount={replyCount}/>
              <View view={viewCount}/>
              <CommentCount commentCount={commentCount}/>
              <ScoreCount scoreCount={scoreCount}/>
              <Score score={score}/>
            </div>
          </div>
        </div>

        <div className="text-[23px]">
          <TbArrowForwardUp onClick={handleClickForward} className="hover:bg-gray-300 cursor-pointer  p-1 rounded-[1.5rem] w-9 h-9"/>
        </div>
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
        <CgFileDocument onClick={scrollToTop} className="z-30 cursor-pointer bg-gray-400/60 p-1 rounded-[1.5rem] fixed top-[6.5rem] ml-4 pb-1 pl-1 w-9 h-9 cursor-pointer"/>
        <div ref={chatContainer} className="chat-container relative z-20 mt-3 lg:mt-4">
          {messages.map((message, index) => createMessage(message, index))}
        </div>
        <AiOutlineArrowDown onClick={scrollToBottom} className="z-30 cursor-pointer bg-gray-400/80 p-1 rounded-[1.5rem] fixed bottom-[6.5rem] ml-4 pb-1 pl-1 w-9 h-9 cursor-pointer"/>
      </div>

      {/* Input for message */}
      <div className="h-[3.5rem] relative z-20 bg-[#eeedef]  w-full flex items-center">
        <div className="h-[3.5rem] relative z-20 bg-[#eeedef] w-full px-4 py-2 flex items-center">
          <RateAction className="m-0" messageDataId={messageDataIdState}/>
        </div>
        <div className="h-[3.5rem] relative z-20 -ml-[8rem] bg-[#eeedef]  w-full px-4 py-2 flex items-center rounded-br-[3rem]">
          <div className="">
            <BsCardImage className="w-10 h-10 pr-1 pl-1 -mr-2 -ml-1 cursor-pointer hover:bg-gray-300 rounded-[0.5rem]" onClick={handleClickUpload}/>
            {/* <TbApps className="w-8 h-8 cursor-pointer hover:bg-gray-300 rounded-[0.5rem]" /> */}
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
      
    </div>
  );
};

export default RumorDiscussion;
