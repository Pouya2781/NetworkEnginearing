import React from "react";
import Timestamp from "./Timestamp";
import View from "./View";
import Score from "./Score";
import ScoreCount from "./ScoreCount";
import CommentCount from "./CommentCount";
import ReplyCount from "./ReplyCount";
import ForwardCount from "./ForwardCount";
import { BiMessage } from "react-icons/bi";
import { FiCornerUpLeft } from "react-icons/fi";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { TbArrowForwardUp } from "react-icons/tb";
import RateAction from "./RateAction";
import RedirectAction from "./RedirectAction"
import placeholder from "../assets/placeholder.jpg"
import { useEffect, useState } from "react";

const MessageContent = ({ chatId, setChatId, setIsShowingContactChat, chatType, currentUserId, userId, currentFirstName, currentLastName, firstName, lastName, message, image, messageDataId, loadImage, timestamp, isLeft, score, scoreCount, viewCount, replyCount, forwardCount, commentCount, isRepliable, isForwardable, isScorable, isCommentable, isRedirectable, setReplyActionData, setIsReplyActionOpen, setCommentActionData, setIsCommentActionOpen, setForwardActionData, setIsForwardActionOpen }) => {
  
  const [ loadedImage, setLoadedImage ] = useState(placeholder);
  const [ isAnimating, setIsAnimating ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!loadImage || image == null) {
        setIsAnimating(false);
        return;
      }
      const res = await fetch('http://localhost:3001/api/chat/message/image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  id: messageDataId,
                }),
            });

            if (res.ok) {
              const blob = await res.blob();
              const imageUrl = URL.createObjectURL(blob);
              setLoadedImage(imageUrl);
              setIsAnimating(false);
            }
            
    };

    fetchData();
  }, []);

  const handleClickReply = () => {
    setReplyActionData({
      chatId: chatId,
      chatType: chatType,
      userId: currentUserId,
      toUserId: userId,
      firstName: currentFirstName,
      lastName: currentLastName,
      toFirstName: firstName,
      toLastName: lastName,
      toMessageDataId: messageDataId,
      toMessage: message,
      toImage: image,
    })
    setIsReplyActionOpen(true);
  }

  const handleClickComment = () => {
    setCommentActionData({
      messageDataId: messageDataId,
      userId: currentUserId,
      firstName: currentFirstName,
      lastName: currentLastName,
    })
    setIsCommentActionOpen(true);
  }

  const handleClickForward = () => {
    setForwardActionData({
      messageDataId: messageDataId,
      userId: currentUserId,
    })
    setIsForwardActionOpen(true);
  }

  const handleClickRedirect = async () => {
    let res = await fetch('http://localhost:3001/api/chat/message/rumor-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  id: messageDataId,
                }),
            });
            const json = await res.json();

    if (json.status != "ok") return;

    setChatId(json.data.id);
    setIsShowingContactChat(null);
    setTimeout(() => setIsShowingContactChat(false), 100);
  }
  
  return (
    <div className={"msg-min flex flex-col"}>
      {image && <div className={"flex justify-center bg-gray-200 mt-2 mb-2 rounded-[0.5rem] overflow-hidden"}>
        <img src={loadImage ? loadedImage : image} alt="" className={"object-cover " + (isAnimating ? "animate-pulse" : "")} />
      </div>}
      <p className={"text-[15px] -mt-1 break-words " + (image == null ? "ms-ms" : "ms-img")}>{message}</p>

      {/* Attachments */}
      <div className="flex justify-end break-words over pl-4 pt-1">
        {(forwardCount && forwardCount != 0) ? <ForwardCount forwardCount={forwardCount}/> : ""}
        {(replyCount && replyCount != 0) ? <ReplyCount replyCount={replyCount}/> : ""}
        {viewCount != undefined && <View view={viewCount}/>}
        {commentCount != undefined && <CommentCount commentCount={commentCount}/>}
        {scoreCount != undefined && <ScoreCount scoreCount={scoreCount}/>}
        {score != undefined && <Score score={score}/>}
        {timestamp && <Timestamp timestamp={timestamp}/>}
      </div>
      
      {(isScorable || isCommentable) && <hr class="h-px mt-1 border-0 bg-gray-400"></hr>}

      {/* Actions */}
      {(isScorable || isCommentable) && <div className="min-w-[25rem] flex justify-center bg-gray-400/20 h-10 mt-1 rounded-[0.5rem]">
        {isScorable && <RateAction messageDataId={messageDataId}/>}
        {(isScorable && isCommentable) && <div class="h-auto w-0.5 ml-1 bg-gray-400"></div>}
        {isCommentable && <BiMessage onClick={handleClickComment} className="cursor-pointer m-auto w-6 h-6"/>}
      </div>}

      {isRedirectable && <hr class="h-px mt-1 border-0 bg-gray-400"></hr>}

      {/* Actions */}
      {isRedirectable && <div className="cursor-pointer hover:bg-gray-400/20 min-w-[18rem] flex justify-center h-10 mt-1 rounded-[0.5rem]">
        <RedirectAction onClick={handleClickRedirect}/>
      </div>}

      <div className={"flex justify-center bg-red-500 h-0 " + (isLeft ? ((isRepliable && isForwardable) ? "rep-for-left" : "rep-for-one-left") : ((isRepliable && isForwardable) ? "rep-for" : "rep-for-one"))}>
        {isRepliable && <FiCornerUpLeft onClick={handleClickReply} className="cursor-pointer bg-gray-400/60 p-1 rounded-[1rem] w-7 h-7 mr-4"/>}
        {isForwardable && <TbArrowForwardUp onClick={handleClickForward} className="cursor-pointer bg-gray-400/60 p-1 rounded-[1rem] w-7 h-7 mr-4"/>}
      </div>
    </div>
  );
};

export default MessageContent;
