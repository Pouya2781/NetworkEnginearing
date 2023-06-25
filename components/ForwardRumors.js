import React from "react";
import ForwardRumor from "./ForwardRumor";

const ForwardRumors = ({ className, rumors, setSelectedChats }) => {

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
    <div className={`${className} contacts w-[30rem] md:px-4  `}>
      {rumors.map((rumor) => (
        <ForwardRumor
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
          setSelectedChats={setSelectedChats}
        />
      ))}
    </div>
  );
};

export default ForwardRumors;
