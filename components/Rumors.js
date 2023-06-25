import React from "react";
import Rumor from "./Rumor";

const Rumors = ({ rumors, setChatId, setIsShowingContactChat }) => {

  function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    hours %= 12;
    hours = hours || 12;
  
    return `${year}/${month}/${day} ${hours}:${minutes} ${amOrPm}`;
  }

  return (
    <div className="contacts md:w-[20rem] lg:w-[30rem] md:px-4  ">
      {rumors.map((rumor) => (
        <Rumor
          image={rumor.RumorChat.MessageDatum.image}
          loadImage={true}
          timeStamp={formatTimestamp(rumor.RumorChat.MessageDatum.createdAt)}
          score={rumor.RumorChat.MessageDatum.score}
          scoreCount={rumor.RumorChat.MessageDatum.scoreCount}
          messageDataId={rumor.RumorChat.MessageDatum.id}
          message={rumor.RumorChat.MessageDatum.message}
          firstName={rumor.RumorChat.MessageDatum.User.firstName}
          lastName={rumor.RumorChat.MessageDatum.User.lastName}
          chatId={rumor.chatId}
          setChatId={setChatId}
          setIsShowingContactChat={setIsShowingContactChat}
        />
      ))}
    </div>
  );
};

export default Rumors;
