import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai";


const Timestamp = ({ timestamp, className }) => {
  return (
    <div className={"flex align-middle justify-end block ml-2 " + className}>
        <p className={"text-end mr-1 leading-[1rem] text-[12px] text-gray-500 block"}>
          {timestamp}
        </p>
        <AiOutlineClockCircle className="text-blue-500"/>
    </div>
  );
};

export default Timestamp;
