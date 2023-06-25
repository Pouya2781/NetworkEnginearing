import React, { useState, useEffect, useRef } from "react";
import { TbApps } from "react-icons/tb";
import { AiOutlineSend } from "react-icons/ai";
import eagle from "../assets/eagle.jpg";
import Message from "./Message";
import mountains from "../assets/mountains.jpg"
import { TbReplace } from "react-icons/tb";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import Tab from "./Tab";
import ForwardContacts from "./ForwardContacts";
import ForwardRumors from "./ForwardRumors";

const ForwardActionPage = ({ className, contacts, userId, rumors, messageDataId, setIsForwardActionOpen }) => {

  const [ tab, setTab ] = useState("contacts");
  const [ selectedChats, setSelectedChats ] = useState([]);

  const handleTabChange = (tabName) => {
    setTab(tabName);
  }

  const chatContainer = useRef(null);

  const handleClickSend = async () => {
    for (let i = 0; i < selectedChats.length; i++) {
        await fetch('http://localhost:3001/api/user/forward', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                    messageDataId: messageDataId,
                    chatId: selectedChats[i].chatId,
                    chatType: selectedChats[i].chatType
                }),
            });
    }

    setIsForwardActionOpen(false); 
  };

  const handleClickClose = () => {
    setIsForwardActionOpen(false);
  };

  return (
    <div className={`${className} justify-center items-center mb-10 mt-5 flex absolute mx-auto my-auto inset-x-0 inset-y-0 sm:max-w-[80vw] rounded-[2rem] bg-gray-500/50 z-50 `}>
        <div className="flex-col justify-center items-start bg-gray-300 w-[30rem] h-[37rem] rounded-[1rem]">
            
            <div className="flex justify-between items-center px-4  w-full h-[4.5rem] z-30 bg-[#eeedef] rounded-tr-[1rem] rounded-tl-[1rem]"></div>
            <div className="ml-[1rem] -mt-[3.75rem] relative flex items-center">
              <div className="pl-2 items-center flex h-[3.1rem]">
                <p className="font-bold text-black/90">Forward to...</p>
              </div>
              <AiOutlineClose onClick={handleClickClose} className="absolute right-5 w-8 h-8 cursor-pointer hover:bg-gray-300 rounded-[1rem]"/>
            </div>
            <Tab className="border-t-2 bg-[#eeedef] mt-2" onChange={handleTabChange}/>

            <div className="comment-chat bg-white -mt-[0.2rem] h-[25.8rem] pb-2 overflow-auto relative">
              <div ref={chatContainer} className="relative z-20">
                <ForwardContacts className={(tab === "contacts") ? "" : "hidden"} contacts={contacts} userId={userId} setSelectedChats={setSelectedChats}/>
                <ForwardRumors className={(tab === "rumors") ? "" : "hidden"} rumors={rumors} setSelectedChats={setSelectedChats}/>
              </div>
            </div>
      
            <div  onClick={handleClickSend} className="hover:bg-gray-200 cursor-pointer h-[3.5rem] justify-between relative z-20  bottom-0 bg-[#eeedef]  w-full px-4 py-2 flex items-center rounded-br-[1rem] rounded-bl-[1rem]">
              <p className="font-medium text-[17px]">Send</p>
              <div
                className="flex w-8 h-8 rounded-[1rem] items-start"
              >
                <AiOutlineSend className="pb-1 pl-1 w-9 h-9"/>
              </div>
            </div>

        </div>
    </div>
  );
};

export default ForwardActionPage;
