import React, { useState, useEffect, useRef } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { AiFillCloseCircle } from "react-icons/ai";
import { AiFillPauseCircle } from "react-icons/ai";

const RateAction = ({ className, messageDataId }) => {

    const [ score, setScore ] = useState(null);
    const [ scored, setScored ] = useState(null);

    useEffect(() => {
      if (messageDataId == null) return;
      const fetchData = async () => {
        let res = await fetch('http://localhost:3001/api/user/scored', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                  },
                  body: JSON.stringify({
                    id: messageDataId,
                  }),
              });
              const json = await res.json();

              if (json.status != "ok") return;
              console.log(json);

              setScored(json.data.score);
      };
  
      fetchData();
    }, [messageDataId]);

    const handleClickRate = async (score) => {
      let res = await fetch('http://localhost:3001/api/user/score', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                  },
                  body: JSON.stringify({
                    messageDataId: messageDataId,
                    score: score
                  }),
              });

              if (scored == score) {
                setScored(null);
              } else {
                setScored(score);
              }
    };

    const handleMouseOver = (score) => {
        setScore(score);
    };

    const handleMouseOut = () => {
        setScore(null);
    };

  return (
    <div className={`${className} p-[0.15rem] border-gray-900 rounded-[0.4rem] flex m-auto items-center`}>
      <div className="mr-1 leading-[1.1rem] pl-[0.25rem] border-2 border-red-600 text-red-600 rounded-[0.4rem] w-6 h-6 text-[13px]">-5</div>
      <AiFillCloseCircle onClick={() => handleClickRate(-5)} onMouseOver={() => handleMouseOver(-5)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-red-900 " + ((score + 5 <= 0) ? "bg-red-500/40 " : "") + ((scored + 5 <= 0) ? "p-[0.1rem] bg-red-600/50 " : "")}/>
      <AiFillCloseCircle onClick={() => handleClickRate(-4)} onMouseOver={() => handleMouseOver(-4)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-red-800 " + ((score + 4 <= 0) ? "bg-red-500/40 " : "") + ((scored + 4 <= 0) ? "p-[0.1rem] bg-red-600/50 " : "")}/>
      <AiFillCloseCircle onClick={() => handleClickRate(-3)} onMouseOver={() => handleMouseOver(-3)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-red-700 " + ((score + 3 <= 0) ? "bg-red-500/40 " : "") + ((scored + 3 <= 0) ? "p-[0.1rem] bg-red-600/50 " : "")}/>
      <AiFillCloseCircle onClick={() => handleClickRate(-2)} onMouseOver={() => handleMouseOver(-2)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-red-600 " + ((score + 2 <= 0) ? "bg-red-500/40 " : "") + ((scored + 2 <= 0) ? "p-[0.1rem] bg-red-600/50 " : "")}/>
      <AiFillCloseCircle onClick={() => handleClickRate(-1)} onMouseOver={() => handleMouseOver(-1)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-red-500 " + ((score + 1 <= 0) ? "bg-red-500/40 " : "") + ((scored + 1 <= 0) ? "p-[0.1rem] bg-red-600/50 " : "")}/>
      <AiFillPauseCircle onClick={() => handleClickRate(0)} onMouseOver={() => handleMouseOver(0)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-gray-500 rotate-90 " + ((score != null) ? "bg-gray-500/40 " : "") + ((scored != null) ? "p-[0.1rem] bg-gray-500/40 " : "")}/>
      <AiFillCheckCircle onClick={() => handleClickRate(1)} onMouseOver={() => handleMouseOver(1)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-green-500 " + ((score - 1 >= 0) ? "bg-green-400/80 " : "") + ((scored - 1 >= 0) ? "p-[0.1rem] bg-green-500/50 " : "")}/>
      <AiFillCheckCircle onClick={() => handleClickRate(2)} onMouseOver={() => handleMouseOver(2)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-green-600 " + ((score - 2 >= 0) ? "bg-green-400/80 " : "") + ((scored - 2 >= 0) ? "p-[0.1rem] bg-green-500/50 " : "")}/>
      <AiFillCheckCircle onClick={() => handleClickRate(3)} onMouseOver={() => handleMouseOver(3)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-green-700 " + ((score - 3 >= 0) ? "bg-green-400/80 " : "") + ((scored - 3 >= 0) ? "p-[0.1rem] bg-green-500/50 " : "")}/>
      <AiFillCheckCircle onClick={() => handleClickRate(4)} onMouseOver={() => handleMouseOver(4)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-green-800 " + ((score - 4 >= 0) ? "bg-green-400/80 " : "") + ((scored - 4 >= 0) ? "p-[0.1rem] bg-green-500/50 " : "")}/>
      <AiFillCheckCircle onClick={() => handleClickRate(5)} onMouseOver={() => handleMouseOver(5)} onMouseOut={handleMouseOut} className={"rounded-[1.3rem] cursor-pointer w-[1.3rem] h-[1.3rem] text-green-900 " + ((score - 5 >= 0) ? "bg-green-400/80 " : "") + ((scored - 5 >= 0) ? "p-[0.1rem] bg-green-500/50 " : "")}/>
      <div className="ml-1 leading-[1.1rem] pl-[0.1rem] border-2 border-green-600 text-green-600 rounded-[0.4rem] w-6 h-6 text-[13px]">+5</div>
    </div>
  );
};

export default RateAction;
