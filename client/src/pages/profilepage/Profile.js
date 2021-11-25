import './Profile.css'
import Feed from "../../components/feed/Feed";
import RightBar from "../../components/rightbar/RightBar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import {useState,useEffect} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
export default function Profile() {
    const[user,setUser]=useState({})
    const {username}=useParams();
    
    useEffect(()=>{
        const fetchUser = async () =>{
            const res = await axios.get(`http://localhost:8800/api/users?username=${username}`);
            setUser(res.data);
            console.log(username);
        }
        fetchUser();
    },[username])
    return (
        <div>
            <Topbar/>
            <div className="profile">
                <Sidebar/>
                {(user==={})?<CircularProgress/>:<div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                            <img className="profileCoverImg" src={user.coverPicture || "/assets/person/noCover.png"} alt=""/>
                            <img className="profileUserImg" src={user.profilePicture || "/assets/person/noAvatar.jpg"} alt=""/>
                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{user.username}</h4>
                            <span className="profileInfoDesc">{user.desc}</span>
                        </div>
                    </div>
                    <div className="profileRightBottom">
                        <Feed username={username}/>
                        <RightBar user={user}/>
                    </div>
                </div>}
            </div>
        </div>
    )
}
