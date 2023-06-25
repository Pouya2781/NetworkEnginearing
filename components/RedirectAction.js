import React, { useState, useEffect, useRef } from "react";
import { BsArrowUpRightCircle } from "react-icons/bs";

const RedirectAction = ({ className, onClick }) => {
  return (
    <div onClick={onClick} className={`${className} flex items-center h-10 w-full`}>
      <p className="ml-2 mr-auto text-blue-700 font-medium h-6">Read more about rumor</p>
      <BsArrowUpRightCircle className="text-blue-700 mr-2 w-6 h-6"/>
    </div>
  );
};

export default RedirectAction;
