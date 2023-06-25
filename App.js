import Chats from "./components/Chats";
import Contacts from "./components/Contacts";
import Navbar from "./components/Navbar";
import Search from "./components/Search";
import Tab from "./components/Tab";
import CommentActionPage from "./components/CommentActionPage";
import MessageActionPage from "./components/MessageActionPage";
import ReplyActionPage from "./components/ReplyActionPage";
import ForwardActionPage from "./components/ForwardActionPage";
import RumorActionPage from "./components/RumorActionPage";
import ContactActionPage from "./components/ContactActionPage";
import Rumors from "./components/Rumors";
import RumorDiscussion from "./components/RumorDiscussion";
import Login from "./components/Login";
import chatback from "./assets/chatback.jpg";
import { useRef, useState, useEffect } from "react";

function App() {
  
  const [ isLoginOpen, setIsLoginOpen ] = useState(true);
  const [ userId, setUserId ] = useState();
  const [ contactChatId, setContactChatId ] = useState();
  const [ rumorChatId, setRumorChatId ] = useState();
  const [ isShowingContactChat, setIsShowingContactChat ] = useState(null);
  const [ contacts, setContacts ] = useState([]);
  const [ rumors, setRumors ] = useState([]);
  const [ tab, setTab ] = useState("contacts");
  const [ messageActionData, setMessageActionData ] = useState();
  const [ isMessageActionOpen, setIsMessageActionOpen ] = useState(false);
  const [ replyActionData, setReplyActionData ] = useState();
  const [ isReplyActionOpen, setIsReplyActionOpen ] = useState(false);
  const [ forwardActionData, setForwardActionData ] = useState();
  const [ isForwardActionOpen, setIsForwardActionOpen ] = useState(false);
  const [ commentActionData, setCommentActionData ] = useState();
  const [ isCommentActionOpen, setIsCommentActionOpen ] = useState(false);
  const [ rumorActionData, setRumorActionData ] = useState();
  const [ isRumorActionOpen, setIsRumorActionOpen ] = useState(false);
  const [ isContactActionOpen, setIsContactActionOpen ] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      console.log(window.localStorage.getItem("messenger-auth-token") + "dflsjfhskdfhjksdfhjkdhjsfkjdhs");
      let res = await fetch('http://localhost:3001/api/auth/check', {
                method: 'GET',
                headers: {
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
            });
            const json = await res.json();
            
            if (json.status == "ok") {
              setIsLoginOpen(false);
              setUserId(json.data.id);
            } else {
              setIsLoginOpen(true);
            }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      let res = await fetch('http://localhost:3001/api/chat/load-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': window.localStorage.getItem('messenger_auth_token')
                },
                body: JSON.stringify({
                  id: userId
                }),
            });
            const json = await res.json();
            console.log(json);
            const { contacts, rumors } = json.data;

            setContacts(contacts);
            setRumors(rumors);
    };

    fetchData();

    //const interval = setInterval(fetchData, 1000);

    // return () => clearInterval(interval);
  }, [userId]);

  const handleTabChange = (tabName) => {
    setTab(tabName);
  }

  // const contacts = [
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "",
  //   },
  //   {
  //     img: profile2,
  //     name: "Test_Person_2",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile3,
  //     name: "Test_Person_3",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile4,
  //     name: "Test_Person_4",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_5",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile2,
  //     name: "Test_Person_6",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile3,
  //     name: "Test_Person_7",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile4,
  //     name: "Test_Person_8",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  // ];

  // const rumors = [
  //   {
  //     img: profile,
  //     name: "Pouya",
  //     message: "",
  //   },
  //   {
  //     img: null,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  //   {
  //     img: profile,
  //     name: "Test_Person_1",
  //     message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //   },
  // ];

  return (
    <div className="back h-full bg-[url('../src/assets/fullback.jpg')] md:pt-5 md:pb-10 min-h-screen">
      {!isLoginOpen && <div className="window flex sm:max-w-[80vw] md:mx-auto md:my-auto rounded-[2rem] bg-white  ">
        <div className="sidebar">
          {/* Navbar */}
          <Navbar setIsContactActionOpen={setIsContactActionOpen} setRumorActionData={setRumorActionData} setIsRumorActionOpen={setIsRumorActionOpen}/>
          {/* Search */}
          {/* <Search /> */}
          <Tab onChange={handleTabChange}/>
          {/* Contacts */}
          {tab === "contacts" && <Contacts setIsShowingContactChat={setIsShowingContactChat} contacts={contacts} userId={userId} setChatId={setContactChatId}/>}
          {tab === "rumors" && <Rumors setIsShowingContactChat={setIsShowingContactChat} rumors={rumors} setChatId={setRumorChatId}/>}
        </div>
        {/* Chats */}
        {(isShowingContactChat == null) && <div className=""><img src={chatback} alt="" className="object-cover h-full w-full"/></div>}
        {(isShowingContactChat == true) && <Chats chatId={contactChatId} userId={userId} setMessageActionData={setMessageActionData} setIsMessageActionOpen={setIsMessageActionOpen} setIsReplyActionOpen={setIsReplyActionOpen} setReplyActionData={setReplyActionData} setCommentActionData={setCommentActionData} setIsCommentActionOpen={setIsCommentActionOpen} setForwardActionData={setForwardActionData} setIsForwardActionOpen={setIsForwardActionOpen} setChatId={setRumorChatId} setIsShowingContactChat={setIsShowingContactChat}/>}
        {(isShowingContactChat == false) && <RumorDiscussion chatId={rumorChatId} userId={userId}  setCommentActionData={setCommentActionData} setIsCommentActionOpen={setIsCommentActionOpen} setIsReplyActionOpen={setIsReplyActionOpen} setReplyActionData={setReplyActionData} setIsForwardActionOpen={setIsForwardActionOpen} setForwardActionData={setForwardActionData} setChatId={setRumorChatId} setIsShowingContactChat={setIsShowingContactChat}/>}
      </div>}
      {/* Actions */}
      {isLoginOpen && <Login setIsLoginOpen={setIsLoginOpen} setUserId={setUserId}/>}
      {isCommentActionOpen && <CommentActionPage setIsCommentActionOpen={setIsCommentActionOpen} {...commentActionData}/>}
      {isMessageActionOpen && <MessageActionPage setIsMessageActionOpen={setIsMessageActionOpen} {...messageActionData}/>}
      {isReplyActionOpen && <ReplyActionPage setIsReplyActionOpen={setIsReplyActionOpen} {...replyActionData}/>}
      {isForwardActionOpen && <ForwardActionPage setIsForwardActionOpen={setIsForwardActionOpen} contacts={contacts} rumors={rumors} {...forwardActionData}/>}
      {isRumorActionOpen && <RumorActionPage setIsRumorActionOpen={setIsRumorActionOpen} {...rumorActionData}/>}
      {isContactActionOpen && <ContactActionPage setIsContactActionOpen={setIsContactActionOpen}/>}
    </div>
  );
}

export default App;
