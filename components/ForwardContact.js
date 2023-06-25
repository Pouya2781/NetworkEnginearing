import React, { useEffect, useState } from "react";
import userPlaceholder from "../assets/user_placeholder.png"
import { AiFillCheckCircle } from "react-icons/ai";

const ForwardContact = ({ firstName, lastName, userId, setSelectedChats, chatId }) => {

  const [ profilePic, setProfilePic ] = useState(userPlaceholder);
  const [ profilePlaceHolder, setProfilePlaceHolder ] = useState("");
  const [ isProfilePlaceHolderVisible, setIsProfilePlaceHolderVisible ] = useState(false);
  const [ isAnimating, setIsAnimating ] = useState(true);

  const [ isSelected, setIsSelected ] = useState(false);

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
    };

    fetchData();
  }, []);

  const handleContactClick = () => {
    if (!isSelected) {
        setIsSelected(true);
        setSelectedChats(prev => [ ...prev, { chatId: chatId, chatType: "contact"}]);
    } else {
        setIsSelected(false);
        setSelectedChats(prev => prev.filter((value) => !(value.chatId == chatId && value.chatType == "contact")));
    }
  }

  return (
    <div onClick={handleContactClick} className="overflow-hidden cursor-pointer pt-2">
      <div className={"flex justify-between border-b bg-white"}>
        <div className="flex items-center pb-2">
          <div className="flex w-16 h-16 overflow-hidden rounded-full">
            {!isProfilePlaceHolderVisible && <img src={profilePic} alt="" className={"object-cover  w-full rounded-full hover:scale-110 duration-100 ease-out " + (isAnimating ? "animate-pulse" : "")} />}
            {isProfilePlaceHolderVisible && <div className="leading-[3.25rem] text-center object-cover w-full bg-[#dda117] text-[25px] rounded-full p-1 text-white/90 font-medium" >{profilePlaceHolder}</div>}
          </div>
          <div className="pl-3 contact-last-message">
            <p className="font-semibold text-[18px]">{firstName + ((lastName != null) ? " " + lastName : "")}</p>
          </div>
        </div>

        <div className="flex items-center h-18 text-gray-400 w-[3rem]">
          {isSelected && <AiFillCheckCircle className="w-9 h-9 cursor-pointer"/>}
        </div>
      </div>
    </div>
  );
};

export default ForwardContact;
