import React, { useState, useEffect, useRef } from "react";
import { TbApps } from "react-icons/tb";
import { AiOutlineSend } from "react-icons/ai";
import eagle from "../assets/eagle.jpg";
import Message from "./Message";
import mountains from "../assets/mountains.jpg"
import { TbReplace } from "react-icons/tb";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";

const MessageActionPage = ({ className, chatId, userId, toUserId, firstName, lastName, toFirstName, toLastName, setIsMessageActionOpen }) => {

  const [ message, setMessages ] = useState(null);
  const [ profilePic, setProfilePic ] = useState(null);
  const [ profilePlaceHolder, setProfilePlaceHolder ] = useState("");
  const [ isProfilePlaceHolderVisible, setIsProfilePlaceHolderVisible ] = useState(false);

  const chatContainer = useRef(null);
  const input = useRef(null);
  const imageInput = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3001/api/chat/user/profile-pic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  id: toUserId,
                }),
            });

            if (res.ok) {
              const blob = await res.blob();
              const imageUrl = URL.createObjectURL(blob);
              setProfilePic(imageUrl);
            } else {
              setIsProfilePlaceHolderVisible(true);
              setProfilePlaceHolder(toFirstName.charAt(0) + ((toLastName == null) ? "" : toLastName.charAt(0)));
            }
    };

    fetchData();
  }, []);

  const handleClickSend = async () => {
    if (message.message.trim() == 0 && imageInput.current.files[0] == null) return;
    const formData = new FormData();
    formData.append('chatId', chatId);
    formData.append('chatType', "contact");
    if (message.message.length > 0)
      formData.append('message', message.message);
    formData.append('image', imageInput.current.files[0]);

    const res = await fetch('http://localhost:3001/api/user/message', {
                method: 'POST',
                headers: {
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: formData
            });

    setIsMessageActionOpen(false);
    input.current.value = '';
    imageInput.current.value = '';
  };

  const handleClickClose = () => {
    setIsMessageActionOpen(false);
    imageInput.current.value = '';
    input.current.value = '';
  };

  const handleClickUpload = () => {
    imageInput.current.click();
  };

  const handleChange = () => {
    console.log(imageInput.current.files[0]);
    if (input.current.value.trim() == 0 && imageInput.current.files[0] == null) {
      setMessages(null);
      return;
    }
    setMessages({
      message: input.current.value,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/^0(\d+)/, '$1'),
      image: (imageInput.current.files[0] != null) ? URL.createObjectURL(imageInput.current.files[0]) : null
    });
  };

  // useEffect(() => {
  //   if (chatContainer.current.lastElementChild == null) return;
  //   chatContainer.current.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
  // }, [message]);

  return (
    <div className={`${className} justify-center items-center mb-10 mt-5 flex absolute mx-auto my-auto inset-x-0 inset-y-0 sm:max-w-[80vw] rounded-[2rem] bg-gray-500/50 z-50 `}>
        <div className="flex-col justify-center items-start bg-gray-300 w-[39rem] h-[37rem] rounded-[1rem]">
            
            {/* Header */}
            <div className="flex justify-between items-center px-4  w-full h-[4.5rem] z-30 bg-[#eeedef] rounded-tr-[1rem] rounded-tl-[1rem]"></div>
            <div className="ml-[1rem] -mt-[3.75rem] relative flex items-center">
              <div className="justify-center items-center flex w-[3.1rem] h-[3.1rem] bg-[#dda117] rounded-full shrink-0 ">
              {!isProfilePlaceHolderVisible && <img
                  src={profilePic}
                  alt=""
                  className="object-cover rounded-full p-1"
                />}
                {isProfilePlaceHolderVisible && <div className="object-cover text-[20px] rounded-full p-1 text-white/90 font-medium" >{profilePlaceHolder}</div>}
              </div>
              <div className="pl-2 ">
                <p className="font-bold text-black/90">Send an image...</p>
                {/* <p className="text-[14px] w-[35rem] whitespace-nowrap truncate text-gray-400 ">
                  Send a Image
                </p> */}
              </div>
              <AiOutlineClose onClick={handleClickClose} className="absolute right-5 w-8 h-8 cursor-pointer hover:bg-gray-300 rounded-[1rem]"/>
            </div>

            {/* Messages */}
            <div className="comment-chat mt-[0.75rem] h-[29rem] pb-2 overflow-auto relative">
              <div className="fixed w-[39rem] h-[29rem]">
                <img
                  src={eagle}
                  alt=""
                  className="object-cover h-full w-full"
                />
              </div>
              <div ref={chatContainer} className="relative z-20 mt-3 lg:mt-4">
                {message != null && <Message
                  firstName={firstName}
                  lastName={lastName}
                  userId={userId}
                  isConnected={false}
                  message={message.message}
                  isLeft={false}
                  isFirst={true}
                  isLast={true}
                  image={message.image}
                  messageDataId={1}
                  loadImage={false}
                  timestamp={message.timestamp}
                  isRepliable={false}
                  isForwardable={false}
                  isScorable={false}
                  isCommentable={false}
                  isRedirectable={false}
                  displayBorder={false}
                  displayProfilePic={true}
                />}
              </div>
            </div>
      
            {/* Input for message */}
            <div className="h-[3.5rem] relative z-20  bottom-0 bg-[#eeedef]  w-full px-4 py-2 flex items-center rounded-br-[1rem] rounded-bl-[1rem]">
              <div className="">
                <input onChange={handleChange} ref={imageInput} type="file" className="absolute w-0 h-0 opacity-0 pointer-events-none"></input>
                <TbReplace className="-mr-2 w-10 h-10 pr-1 pl-1 cursor-pointer hover:bg-gray-300 rounded-[0.5rem]" onClick={handleClickUpload}/>
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full mx-4 p-2 rounded-full pl-4"
                ref={input}
                onChange={handleChange}
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

export default MessageActionPage;
