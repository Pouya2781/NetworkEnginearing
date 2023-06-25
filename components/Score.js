import React from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiFillPauseCircle } from "react-icons/ai";

const Score = ({ score, className }) => {
    const greenColor = [
        "text-green-400",
        "text-green-500",
        "text-green-700",
        "text-green-800",
        "text-green-900",
    ]
    const redColor = [
        "text-red-400",
        "text-red-500",
        "text-red-700",
        "text-red-800",
        "text-red-900",
    ]
  return (
    <div className={"flex align-middle justify-end block ml-2 " + className}>
        <p className={"text-end mr-1 leading-[1rem] text-[12px] text-gray-500 block"}>
          {((score > 0) ? "+" : "") + score}
        </p>
        {score > 0 && <AiFillCheckCircle className={greenColor[Math.ceil(score) - 1]}/>}
        {score < 0 && <AiFillCloseCircle className={redColor[Math.ceil(-score) - 1]}/>}
        {score == 0 && <AiFillPauseCircle className="text-gray-500 rotate-90"/>}
    </div>
  );
};

export default Score;
