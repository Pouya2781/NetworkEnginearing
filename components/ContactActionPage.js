import React, { useState, useEffect, useRef } from "react";
import { TbApps } from "react-icons/tb";
import { AiOutlineSend } from "react-icons/ai";
import eagle from "../assets/eagle.jpg";
import Message from "./Message";
import mountains from "../assets/mountains.jpg"
import { FiAtSign } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ContactActionPage = ({ className, setIsContactActionOpen }) => {

    const [ isLoading, setIsLoading ] = useState(false);
    const [ resultStatus, setResultStatus ] = useState();

  const chatContainer = useRef(null);
  const input = useRef(null);

  const handleClickSend = async () => {
    setIsLoading(true);
    setResultStatus("loading");
    let identifier = input.current.value;
    input.current.value = '';
    let res = await fetch('http://localhost:3001/api/chat/user/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                    identifier: identifier
                }),
            });
            const json = await res.json();
            console.log(json);
            
            if (json.status == "user_not_found" || json.status == "validation_fail") {
                setResultStatus("fail");
                setTimeout(() => {
                    setIsLoading(false);
                }, 300);
            } else {
                setResultStatus("success");
                setTimeout(() => {
                    setIsContactActionOpen(false);
                }, 300);

                const formData = new FormData();
                formData.append('toUserId', json.data.id);
                formData.append('message', "Hello!");

                res = await fetch('http://localhost:3001/api/user/initial-message', {
                    method: 'POST',
                    headers: {
                        'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                    },
                    body: formData
                });
            }
  };

  const handleClickClose = () => {
    setIsContactActionOpen(false);
    input.current.value = '';
  };

//   useEffect(() => {
//     if (chatContainer.current.lastElementChild == null) return;
//     chatContainer.current.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'end' });
//   }, [message]);

  return (
    <div className={"justify-center items-center mb-10 mt-5 flex absolute mx-auto my-auto inset-x-0 inset-y-0 sm:max-w-[80vw] rounded-[2rem] bg-gray-500/50 z-50  "}>
        <div className="flex-col justify-center items-start bg-gray-300 w-[39rem] h-[7.9rem] rounded-[1rem]">
            
            {/* Header */}
            <div className="flex justify-between items-center px-4  w-full h-[4.5rem] z-30 bg-[#eeedef] rounded-tr-[1rem] rounded-tl-[1rem]"></div>
            <div className="ml-[1rem] -mt-[3.75rem] relative flex items-center">
              <div className="pl-2 items-center flex h-[3.1rem]">
                <p className="font-bold text-[18px] text-black/90">Add a contact...</p>
              </div>
              <AiOutlineClose onClick={handleClickClose} className="absolute right-5 w-8 h-8 cursor-pointer hover:bg-gray-300 rounded-[1rem]"/>
            </div>

            {/* Messages */}
            {/* <div className="comment-chat mt-[0.75rem] h-[29rem] pb-2 overflow-auto relative">
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
            </div> */}
      
            {/* Input for message */}
            <div className="h-[4rem] relative z-20  bottom-0 bg-[#eeedef]  w-full px-4 py-2 flex items-center rounded-br-[1rem] rounded-bl-[1rem]">
              <div className="">
                <FiAtSign className="w-10 h-10 cursor-pointer text-gray-400 rounded-[0.5rem]"/>
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full mx-4 p-2 rounded-full pl-4"
                ref={input}
              />
              <div
                className={"flex -mt-[0.1rem] -ml-1 w-[2.5rem] h-[2.5rem] rounded-[1rem] items-start " + (!isLoading ? "hover:bg-gray-300" : "")}
              >
                {!isLoading && <AiOutlinePlusCircle className="w-[2.5rem] h-[2.5rem]" onClick={handleClickSend}/>}
                {(isLoading && resultStatus == "loading") && <AiOutlineLoading3Quarters className="animate-spin p-[0.3rem]  w-[2.5rem] h-[2.5rem]" onClick={handleClickSend}/>}
                {(isLoading && resultStatus == "success") && <AiOutlineCheckCircle className="text-green-500 animate-ping  p-[0.5rem]  w-[2.5rem] h-[2.5rem]" onClick={handleClickSend}/>}
                {(isLoading && resultStatus == "fail") && <AiOutlineCloseCircle className="text-red-500 animate-ping p-[0.5rem]  w-[2.5rem] h-[2.5rem]" onClick={handleClickSend}/>}
              </div>
            </div>

        </div>
    </div>
  );
};

export default ContactActionPage;
