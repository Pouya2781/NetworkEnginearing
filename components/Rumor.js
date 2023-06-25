import React, { useEffect, useState } from "react";
import ReplyContent from "./ReplyContent";
import mountains from "../assets/mountains.jpg"
import Score from "./Score";
import ScoreCount from "./ScoreCount";
import Timestamp from "./Timestamp";
import placeholder from "../assets/placeholder.jpg"

const Rumor = ({ image, firstName, lastName, loadImage, timeStamp, score, scoreCount, messageDataId, message, chatId, setChatId, setIsShowingContactChat }) => {
  
  const [ messageImage, setMessageImage ] = useState(placeholder);
  const [ isAnimatingMessageImage, setIsAnimatingMessageImage ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!loadImage) return;
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
            setMessageImage(imageUrl);
          }
          setIsAnimatingMessageImage(false);
    };

    fetchData();
  }, []);

  const handleRumorClick = () => {
    setChatId(chatId);
    setIsShowingContactChat(null);
    setTimeout(() => setIsShowingContactChat(false), 100);
  }

  return (
    <div onClick={handleRumorClick} className="overflow-hidden pt-2 cursor-pointer">
      <div className="flex justify-end bg-white border-b">
        <div className="flex items-center pb-2 rumor-message">
            <div className="mb-1 h-[4.5rem] rounded-[0.5rem] flex flex-col w-full">
              <p className="pr-3 ml-4 font-medium">{firstName + ((lastName != null) ? " " + lastName : "")}</p>
              <div class="inline-block -mt-4 h-[3.7rem] min-h-[1em] w-0.5 ml-1 self-stretch bg-blue-500 opacity-100 dark:opacity-50"></div>
              {image && <div className={"flex justify-center bg-gray-200 h-9 w-9 ml-4 -mt-10 mb-2 rounded-[0.5rem] overflow-hidden"}>
                <img src={messageImage} alt="" className={"object-cover " + (isAnimatingMessageImage ? "animate-pulse" : "")} />
              </div>}
              <p className={"text-[15px] -mt-[2.4rem] truncate "  + (image == null ? " pl-[1rem]" : " pl-[3.7rem]")}>{((message == null || message == "") ? "Photo" : message)}</p>
            </div>
        </div>

        <div className="flex-col h-full w-[9rem] text-gray-400">
          <Timestamp className="mt-3" timestamp={timeStamp}/>
          <ScoreCount className="mt-1" scoreCount={scoreCount}/>
          <Score className="mt-1" score={score}/>
        </div>

        
      </div>
    </div>
  );
};

export default Rumor;
