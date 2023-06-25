import React, { useState } from "react";

const Tab = ({ className, onChange }) => {

    const [ isActiveContacts, setIsActiveContacts ] = useState(true);
    const [ isActiveRumors, setIsActiveRumors ] = useState(false);

  const aTagNormal =
    "inline-flex p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group";
  const svgTagNormal =
    "w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300";
  const aTagActive =
    "inline-flex p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500 group";
  const svgTagActive = "w-5 h-5 mr-2 text-blue-600 dark:text-blue-500";

  const handleClickContacts = () => {
    if (isActiveContacts) return
    setIsActiveContacts(true);
    setIsActiveRumors(false);
    onChange("contacts");
  };

  const handleClickRumors = () => {
    if (isActiveRumors) return
    setIsActiveContacts(false);
    setIsActiveRumors(true);
    onChange("rumors");
  };

  return (
    <div class={`${className} h-[3.4rem] mb-1 border-b border-gray-200 dark:border-gray-700`}>
      <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
        <li class="mr-2" onClick={handleClickContacts}>
          <a href="#" class={isActiveContacts ? aTagActive : aTagNormal}>
            <svg
              aria-hidden="true"
              class={isActiveContacts ? svgTagActive : svgTagNormal}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Contacts
          </a>
        </li>
        <li class="mr-2" onClick={handleClickRumors}>
          <a href="#" class={isActiveRumors ? aTagActive : aTagNormal} aria-current="page">
            <svg
              aria-hidden="true"
              class={isActiveRumors ? svgTagActive : svgTagNormal}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path
                fill-rule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clip-rule="evenodd"
              ></path>
            </svg>
            Rumors
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Tab;
