import React, { useEffect, useState } from "react";
import placeholder from "../assets/placeholder.jpg"

const ReplyContent = ({ firstName, lastName, message, replyImage, toMessageDataId, loadReplyImage }) => {

  const [ loadedImage, setLoadedImage ] = useState(placeholder);
  const [ isAnimating, setIsAnimating ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!loadReplyImage || replyImage == null) {
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
                  id: toMessageDataId,
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

  return (
    <div className="reply mb-1 h-[4.5rem] rounded-[0.5rem] flex flex-col ">
      <p className="pr-3 ml-4 font-medium">{firstName + ((lastName != null) ? lastName : "")}</p>
      <div class="inline-block -mt-4 h-[3.7rem] min-h-[1em] w-0.5 ml-1 self-stretch bg-blue-500 opacity-100 dark:opacity-50"></div>
      {replyImage && <div className={"flex justify-center bg-gray-200 h-9 w-9 ml-4 -mt-10 mb-2 rounded-[0.5rem] overflow-hidden"}>
        <img src={loadReplyImage ? loadedImage : replyImage} alt="" className={"object-cover " + (isAnimating ? "animate-ping" : "")} />
      </div>}
      <p className={"text-[15px] -mt-[2.4rem] pr-2 truncate " + (replyImage == null ? "ms-ms pl-[1rem]" : "ms-img pl-[3.7rem]")}>{(message == "" ? "Photo" : message)}</p>
    </div>
  );
};

export default ReplyContent;
