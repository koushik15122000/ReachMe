import axios from 'axios'
import './Conversation.css'
import {useEffect,useState} from 'react'
export default function Conversation({conversation,currentUser}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const[user,setUser]=useState(null);
    useEffect(() => {
        const friendId = conversation.members.find(m=>m!==currentUser._id)
        const getUser = async () =>{
            try{
                const res =  await axios.get(`http://localhost:8800/api/users?userId=${friendId}`)
                setUser(res.data);
            }catch(err){
                console.log(err)
            }
        }
        getUser();
    }, [currentUser,conversation])
    return (
        <div className="conversation">
            {user && <img className="conversationImg" src={user.profilePicture || PF+"/person/noAvatar.jpg"} alt=""/>}
            {user && <span className="conversationName">{user.username}</span>}
        </div>
    )
}
