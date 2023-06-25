import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { TbArrowForwardUp } from "react-icons/tb";

const ForwardCount = ({ forwardCount }) => {

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
          {formatNumber(forwardCount)}
        </p>
        <TbArrowForwardUp className="text-blue-500"/>
    </div>
  );
};

export default ForwardCount;
