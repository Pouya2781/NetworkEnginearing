import autoAnimate from '@formkit/auto-animate'
import '../login.css';
import React, { useState, useRef, useEffect } from 'react';
import { BsStarHalf } from "react-icons/bs";
import LoginContent from './LoginContent';

function Login({ setIsLoginOpen, setUserId }) {

  const parentRef = useRef();

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current);
    }
  }, [parentRef]);

  return (
    <div className='relative loginmain pt-6'>
      <div className='box-1' >
        <div className='w-full flex justify-center h-[6rem] mb-2'>
          <BsStarHalf className="cursor-pointer bg-gray-300/60 text-blue-500/90 p-3 rounded-full w-[6rem] h-[6rem]" />
        </div>
        <h1 className='title-1 font-medium text-[20px]'>Wellcome</h1>
        <div className='flex justify-center'>
          <LoginContent setIsLoginOpen={setIsLoginOpen} setUserId={setUserId} />
        </div>
        <div className='clr'></div>
      </div>
    </div>
  );
}

export default Login;
