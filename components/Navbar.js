import React from "react";
import profile from "../assets/face3.png";
import { BiMessage } from "react-icons/bi";
import { HiOutlineMenu } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { useState, useEffect } from "react";

const Navbar = ({ setRumorActionData, setIsRumorActionOpen, setIsContactActionOpen }) => {

  const [ firstName, setFirstName ] = useState();
  const [ lastName, setLastName ] = useState();
  const [ userId, setUserId ] = useState();

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch('http://localhost:3001/api/user/info', {
                method: 'GET',
                headers: {
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                }
            });
            const json = await res.json();
            setFirstName(json.data.firstName);
            setLastName(json.data.lastName);
            setUserId(json.data.id);
    };

    fetchData();
  }, []);
  
  const handleClickLogout = () => {
    window.localStorage.removeItem('messenger_auth_token');
    window.location.reload();
  }

  const handleClickRumor = async () => {
    setRumorActionData({
      firstName: firstName,
      lastName: lastName,
      userId: userId
    });
    setIsRumorActionOpen(true);
  }

  const handleClickContact = async () => {
    setIsContactActionOpen(true);
  }

  return (
    <div className="flex items-center justify-between px-4 pt-2 pb-2 bg-[#eeedef] h-[4.5rem] w-screen md:w-full md:rounded-tl-[2rem]">
      <div className="items-center h-12 flex ">
        <div className="w-12 h-12 flex ">
          <img src={profile} alt="" className="object-cover  rounded-full" />
        </div>
        <div className="pl-2 ">
            <p className="font-bold text-black/90">{firstName + ((lastName != null) ? " " + lastName : "")}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <AiOutlineUserAdd onClick={handleClickContact} className="cursor-pointer w-7 h-7 -mr-2" />
        <BiMessage onClick={handleClickRumor} className="cursor-pointer w-7 h-7 -mr-3 mt-1" />
        <BiLogOut onClick={handleClickLogout} className="cursor-pointer w-7 h-7" />
      </div>
    </div>
  );
};

export default Navbar;
