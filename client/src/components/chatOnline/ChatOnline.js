import './ChatOnline.css'
import {useState,useEffect} from 'react';
import axios from 'axios';

export default function ChatOnline({onlineUsers,currentUserId,setCurrentChat}) {
    const [friends,setFriends] = useState([]);
    const [onlineFriends,setOnlineFriends] = useState([]);
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    useEffect(()=>{
        const getFriends = async () =>{
            const res = await axios.get("http://localhost:8800/api/users/friends/"+currentUserId);
            setFriends(res.data);
        }
        getFriends();
    },[currentUserId])

    useEffect(()=>{
        friends.length!==0 && setOnlineFriends(friends.filter((f)=>onlineUsers.includes(f._id)));
    },[onlineUsers,friends])

    const handleClick = async (user) =>{
        try{
            const res = await axios.get(`http://localhost:8800/api/conversation/find/${currentUserId}/${user._id}`);
            setCurrentChat(res.data);
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="chatOnline">
            {onlineFriends.map((friend)=>(<div className="chatOnlineFriend" onClick={()=>handleClick(friend)}>
                <div className="chatOnlineImgContainer">
                    <img className="chatOnlineImg" src={friend.profilePicture===""?PF+"/person/noAvatar.jpg":PF+friend.profilePicture} alt=""/>
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">{friend.username}</span>
            </div>))}
        </div>
    )
}
 