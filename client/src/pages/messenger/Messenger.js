import './Messenger.css'
import Topbar from '../../components/topbar/Topbar';
import Conversation from '../../components/conversations/Conversation';
import Message from '../../components/message/Message';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import { useContext, useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client';
export default function Messenger() {
    const [conversations, setConversations] = useState([]);
    const [messages,setMessages] = useState([]);
    const [currentChat,setCurrentChat] = useState(null);
    const [newMessage,setNewMessage] = useState("");
    const [arrivalMessage,setArrivalMessage] = useState(null);
    const scrollRef = useRef(); 
    const { user } = useContext(AuthContext);
    const socket = useRef();
    const [onlineUsers,setOnlineUsers] = useState([]);
    useEffect(() => {
        socket.current=io("ws://localhost:8900");
        socket.current.on("getMessage",data=>{
            setArrivalMessage({
                sender:data.senderId,
                text:data.text,
                createdAt:Date.now(),
            });
        })
    }, [])

    useEffect(() => {
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev)=>[...prev,arrivalMessage])
    }, [arrivalMessage,currentChat])

    useEffect(()=>{
        socket.current.emit("addUser",user._id);
        socket.current.on("getUsers",users=>{
            setOnlineUsers(user.followings.filter((f)=>users.find((u)=>u.userId===f)));
        })
    },[user])

    useEffect(() => {
        const getConversations = async () => {
          try {
            const res = await axios.get("http://localhost:8800/api/conversation/" + user._id);
            setConversations(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getConversations();
    }, [user._id]);

    useEffect(()=>{
        const getMessages = async () =>{
            try{
                const res = await axios.get("http://localhost:8800/api/message/"+currentChat._id);
                setMessages(res.data);
            }catch(err){
                console.log(err)
            }
        }
        currentChat && getMessages();
    },[currentChat])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const mssg = {
            sender : user._id,
            text : newMessage,
            conversationId : currentChat._id
        }
        const recieverId = currentChat.members.find(member=>member!==user._id);
        socket.current.emit("sendMessage",{
            senderId:user._id,
            recieverId: recieverId,
            text:newMessage,
        })
        try{
            const res = await axios.post("http://localhost:8800/api/message/",mssg);
            setMessages([...messages,res.data])
            setNewMessage("");
        }catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior:"smooth"})
    }, [messages])

    
    return (
        <div>
            <Topbar/>
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <input placeholder="Search for friends" className="chatMenuInput"/>
                        {conversations.map((c) => (
                            <div onClick={()=>setCurrentChat(c)}>
                            <Conversation conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {
                           currentChat ? 
                           <>
                        <div className="chatBoxTop">
                            {messages.map((msg)=>(
                                <div ref={scrollRef}>
                                    <Message message={msg} own={msg.sender === user._id}/>
                                </div>
                            ))}
                        </div>
                        <div className="chatBoxBottom">
                            <input className="chatMessageInput" placeholder="write something.." onChange={(e)=>setNewMessage(e.target.value)} value={newMessage}/>
                            <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
                        </div></>
                        : <span className="noConversationText">Open a conversation to start a chat</span>}
                    </div>
                </div>
                <div className="chatOnline">
                    <div className="chatOnlineWrapper">
                        <ChatOnline onlineUsers={onlineUsers} currentUserId={user._id} setCurrentChat={setCurrentChat}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
