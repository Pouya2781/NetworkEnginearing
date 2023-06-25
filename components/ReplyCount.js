import React from "react";
import { FiCornerUpLeft } from "react-icons/fi";

const ReplyCount = ({ replyCount }) => {

    function formatNumber(number) {
        if (number >= 1000000) {
          return (number / 1000000).toFixed(1) + 'M';
        } else if (number >= 1000) {
          return (number / 1000).toFixed(1) + 'K';
        }
        
        return number.toString();
      }

  return (
    <div className={"flex align-middle justify-end block ml-2"}>
        <p className={"text-end mr-1 leading-[1rem] text-[12px] text-gray-500 block"}>
          {formatNumber(replyCount)}
        </p>
        <FiCornerUpLeft className="text-blue-500"/>
    </div>
  );
};

export default ReplyCount;
