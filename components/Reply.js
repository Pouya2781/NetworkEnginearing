import React, { useEffect, useState } from "react";
import MessageContent from "./MessageContent";
import ReplyContent from "./ReplyContent";

const Reply = ({ chatId, setChatId, setIsShowingContactChat, chatType, currentUserId, className, userId, currentFirstName, currentLastName, firstName, lastName, message, image, messageDataId, loadImage, displayProfilePic, timestamp, isConnected, isLeft, isLast, isFirst, score, scoreCount, viewCount, replyCount, forwardCount, commentCount, isRepliable, isForwardable, isScorable, isCommentable, isRedirectable, replyToFirstName, replyToLastName, replyMessage, replyImage, setReplyActionData, setIsReplyActionOpen, setCommentActionData, setIsCommentActionOpen, toMessageDataId, loadReplyImage, setForwardActionData, setIsForwardActionOpen }) => {
  
  const [ profilePic, setProfilePic ] = useState(null);
  const [ profilePlaceHolder, setProfilePlaceHolder ] = useState("");
  const [ isProfilePlaceHolderVisible, setIsProfilePlaceHolderVisible ] = useState(false);

  useEffect(() => {
    if (!isLast || !displayProfilePic) return;
    const fetchData = async () => {
      const res = await fetch('http://localhost:3001/api/chat/user/profile-pic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  id: userId,
                }),
            });

            if (res.ok) {
              const blob = await res.blob();
              const imageUrl = URL.createObjectURL(blob);
              setProfilePic(imageUrl);
            } else {
              setIsProfilePlaceHolderVisible(true);
              setProfilePlaceHolder(firstName.charAt(0) + ((lastName == null) ? "" : lastName.charAt(0)));
            }
    };

    fetchData();
  }, [userId]);

  return (
    <div className={`${className} flex items-end ms` + (isLeft ? " justify-start" : " justify-end")}>
      {/* {isLeft && <div className={"ms-prof ml-3 mr-[-0.8rem] w-12 h-12 flex " + (isLast ? "": "invisible")}>
        <img src={profilePic} alt="" className="object-cover  rounded-full" />
      </div>} */}
      {(isLeft && displayProfilePic) && <div className={"ms-prof ml-3 mr-[-0.8rem] w-12 h-12 flex " + (isLast ? "": "invisible")}>
      {!isProfilePlaceHolderVisible && <img src={profilePic} alt="" className="object-cover  rounded-full" />}
        {isProfilePlaceHolderVisible && <div className="leading-10 text-center object-cover w-[3.1rem] h-[3.1rem] bg-[#dda117] text-[20px] rounded-full p-1 text-white/90 font-medium" >{profilePlaceHolder}</div>}
      </div>}

      <div className={`flex flex-col p-2 pl-2 pr-2 lg:mx-6 rounded-[1rem]  ms-txt pr-4` + (isConnected ? " mt-0.5 " : " mt-4 ") + (isLeft ? "bg-white/80" : "bg-blue-200")}>
        
        {/* Message content */}
        <div className="flex flex-col ">
          {isFirst && firstName && <p className="pr-3 font-bold">{firstName + ((lastName != null) ? " " + lastName : "")}</p>}
          <ReplyContent
            firstName={replyToFirstName}
            lastName={replyToLastName}
            message={replyMessage}
            replyImage={replyImage}
            toMessageDataId={toMessageDataId}
            loadReplyImage={loadReplyImage}
          />
          <MessageContent
            setChatId={setChatId}
            setIsShowingContactChat={setIsShowingContactChat}
            chatType={chatType}
            chatId={chatId}
            userId={userId}
            currentUserId={currentUserId}
            currentFirstName={currentFirstName}
            currentLastName={currentLastName}
            firstName={firstName}
            lastName={lastName}
            message={message}
            image={image}
            messageDataId={messageDataId}
            loadImage={loadImage}
            isLeft={isLeft}
            timestamp={timestamp}
            score={score}
            scoreCount={scoreCount}
            viewCount={viewCount}
            replyCount={replyCount}
            forwardCount={forwardCount}
            commentCount={commentCount}
            isRepliable={isRepliable}
            isForwardable={isForwardable}
            isScorable={isScorable}
            isCommentable={isCommentable}
            isRedirectable={isRedirectable}
            setReplyActionData={setReplyActionData}
            setIsReplyActionOpen={setIsReplyActionOpen}
            setCommentActionData={setCommentActionData}
            setIsCommentActionOpen={setIsCommentActionOpen}
            setForwardActionData={setForwardActionData}
            setIsForwardActionOpen={setIsForwardActionOpen}
          />
        </div>

      </div>

      {/* {!isLeft && <div className={"mr-3 ml-[-0.8rem] w-12 h-12 flex " + (isLast ? "": "invisible")}>
        <img src={profilePic} alt="" className="object-cover  rounded-full" />
      </div>} */}
      {(!isLeft && displayProfilePic) && <div className={"mr-3 ml-[-0.8rem] w-12 h-12 flex " + (isLast ? "": "invisible")}>
        {!isProfilePlaceHolderVisible && <img src={profilePic} alt="" className="object-cover  rounded-full" />}
        {isProfilePlaceHolderVisible && <div className="leading-10 text-center object-cover w-[3.1rem] h-[3.1rem] bg-[#dda117] text-[20px] rounded-full p-1 text-white/90 font-medium" >{profilePlaceHolder}</div>}
      </div>}
    </div>
  );
};

export default Reply;
