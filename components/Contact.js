import React, { useEffect, useState } from "react";
import Timestamp from "./Timestamp";
import mountain from "../assets/mountains.jpg"
import userPlaceholder from "../assets/user_placeholder.png"
import placeholder from "../assets/placeholder.jpg"

const Contact = ({ image, firstName, lastName, message, messageDataId, timeStamp, loadImage, userId, setChatId, chatId, setIsShowingContactChat }) => {

  const [ profilePic, setProfilePic ] = useState(userPlaceholder);
  const [ profilePlaceHolder, setProfilePlaceHolder ] = useState("");
  const [ isProfilePlaceHolderVisible, setIsProfilePlaceHolderVisible ] = useState(false);
  const [ isAnimating, setIsAnimating ] = useState(true);

  const [ messageImage, setMessageImage ] = useState(placeholder);
  const [ isAnimatingMessageImage, setIsAnimatingMessageImage ] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch('http://localhost:3001/api/chat/user/profile-pic', {
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
            setIsAnimating(false);

      if (!loadImage) return;
      res = await fetch('http://localhost:3001/api/chat/message/image', {
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

  const handleContactClick = () => {
    setChatId(chatId);
    setIsShowingContactChat(null);
    setTimeout(() => setIsShowingContactChat(true), 100);
  }

  return (
    <div onClick={handleContactClick} className="overflow-hidden cursor-pointer pt-2">
      <div className="flex justify-between border-b bg-white">
        <div className="flex items-center  pb-2 contact-last-message-box">
          <div className="flex w-16 h-16 overflow-hidden rounded-full">
            {/* <img
              src={profilePic}
              alt=""
              className="object-cover w-full rounded-full hover:scale-110 duration-100 ease-out"
            /> */}
            {!isProfilePlaceHolderVisible && <img src={profilePic} alt="" className={"object-cover  w-full rounded-full hover:scale-110 duration-100 ease-out " + (isAnimating ? "animate-pulse" : "")} />}
            {isProfilePlaceHolderVisible && <div className="leading-[3.25rem] text-center object-cover w-full bg-[#dda117] text-[25px] rounded-full p-1 text-white/90 font-medium" >{profilePlaceHolder}</div>}
          </div>
          <div className="pl-3 contact-last-message">
            <p className="font-semibold text-[18px]">{firstName + ((lastName != null) ? " " + lastName : "")}</p>
            <div className="h-[3rem] rounded-[0.5rem] flex flex-col -mt-1 contact-last-message-extend">
              {image && <div className={"flex justify-center bg-gray-200 h-9 w-9 ml-1 mt-2 rounded-[0.5rem] overflow-hidden"}>
                <img src={messageImage} alt="" className={"object-cover " + (isAnimatingMessageImage ? "animate-pulse" : "")} />
              </div>}
              <p className={"text-[15px] truncate "  + (image == null ? " pl-[0.25rem] mt-[0.7rem]" : " pl-[3rem] -mt-[1.9rem]")}>{((message == null || message == "") ? "Photo" : message)}</p>
            </div>
          </div>
        </div>

        <div className="flex h-full text-gray-400 w-[5rem]">
          <Timestamp className="mt-2" timestamp={timeStamp}/>
        </div>
      </div>
    </div>
  );
};

export default Contact;
