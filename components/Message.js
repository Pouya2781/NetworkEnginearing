import React, { useState, useEffect } from "react";
import MessageContent from "./MessageContent";
import ReplyContent from "./ReplyContent";

const Message = ({ chatId, setChatId, setIsShowingContactChat, chatType, currentUserId, userId, currentFirstName, currentLastName, firstName, lastName, className, message, image, messageDataId, loadImage, displayProfilePic, timestamp, isConnected, isLeft, isLast, isFirst, score, scoreCount, viewCount, replyCount, forwardCount, commentCount, isRepliable, isForwardable, isScorable, isCommentable, isRedirectable, displayBorder, setReplyActionData, setIsReplyActionOpen, setCommentActionData, setIsCommentActionOpen, setForwardActionData, setIsForwardActionOpen  }) => {
  
  const [ profilePic, setProfilePic ] = useState(null);
  const [ profilePlaceHolder, setProfilePlaceHolder ] = useState("");
  const [ isProfilePlaceHolderVisible, setIsProfilePlaceHolderVisible ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLast || !displayProfilePic) return;
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

  const borderColor = [
    "border-red-900",
    "border-red-800",
    "border-red-700",
    "border-red-500",
    "border-red-400",
    "border-gray-500",
    "border-green-400",
    "border-green-500",
    "border-green-700",
    "border-green-800",
    "border-green-900",
  ];
  
  return (
    <div className={`${className} flex items-end ms` + (isLeft ? " justify-start" : " justify-end")}>
      {(isLeft && displayProfilePic) && <div className={"ms-prof ml-3 mr-[-0.8rem] w-12 h-12 flex " + (isLast ? "": "invisible")}>
      {!isProfilePlaceHolderVisible && <img src={profilePic} alt="" className="object-cover  rounded-full" />}
        {isProfilePlaceHolderVisible && <div className="leading-10 text-center object-cover w-[3.1rem] h-[3.1rem] bg-[#dda117] text-[20px] rounded-full p-1 text-white/90 font-medium" >{profilePlaceHolder}</div>}
      </div>}

      <div className={`flex flex-col p-2 pl-2 pr-2 lg:mx-6 rounded-[1rem]  ms-txt` + (isConnected ? " mt-1.5 " : " mt-4 ") + (isLeft ? "bg-white/80" : "bg-blue-200") + (displayBorder ? ` border-2 ${borderColor[(score < 0) ? Math.ceil(score) + 4 : Math.ceil(score) + 5]} ` : "")}>
        
        {/* Message content */}
        <div className="flex flex-col ">
          {isFirst && firstName && <p className="pr-3 font-bold mb-1">{firstName + ((lastName != null) ? " " + lastName : "")}</p>}
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

      {(!isLeft && displayProfilePic) && <div className={"mr-3 ml-[-0.8rem] w-12 h-12 flex " + (isLast ? "" : "invisible")}>
        {!isProfilePlaceHolderVisible && <img src={profilePic} alt="" className="object-cover  rounded-full" />}
        {isProfilePlaceHolderVisible && <div className="leading-10 text-center object-cover w-[3.1rem] h-[3.1rem] bg-[#dda117] text-[20px] rounded-full p-1 text-white/90 font-medium" >{profilePlaceHolder}</div>}
      </div>}
    </div>
  );
};

export default Message;
