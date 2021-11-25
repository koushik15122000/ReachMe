import './RightBar.css'
import Online from '../online/Online'
import {Users} from '../../dumyData'
import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext';
import {Add, Remove} from '@material-ui/icons';

export default function RightBar({user}) {

    

    const {user:currentUser} = useContext(AuthContext)

    

    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const HomePageRightbar = () =>{
        return (
            <>
                <div className="birthdayContainer">
                    <img className="birthdayImg" src="/assets/gift.png" alt=""/>
                    <span className="birthdayText"> <b>Koushik</b> and <b>3 other friends</b> have birthday today.</span>
                </div>
                <div>
                    <img className="rightbarAd" src="/assets/ad12.jpg" alt=""/>
                    <h4 className="rightbarTitle">Online friends</h4>
                    <ul className="rightbarFriendList">
                        {Users.map(user=>(<Online key={user.id} user={user}/>))}
                    </ul>
                </div>
            </>
        )
    }

    const ProfilePageRightbar = () =>{

        const[followed,setFollowed]=useState(currentUser.followings.includes(user?._id));
        useEffect(()=>{

        },[currentUser.followings])
        const followHandler = async () => {
        try{
            if(followed){
               const res = await axios.put(`http://localhost:8800/api/users/${user._id}/unfollow`,{userId:currentUser._id})
            }
            else{
                await axios.put(`http://localhost:8800/api/users/${user._id}/follow`,{userId:currentUser._id})
            }
        }catch(err){
            console.log(err)
        }
        setFollowed(!followed)
    }
    console.log(currentUser.followings.includes(user?._id))
        const[friends,setFriends]=useState([])
        useEffect(()=>{
            const getFriends = async () =>{
                try{
                    const res = await axios.get(`http://localhost:8800/api/users/friends/${user._id}`);
                    setFriends(res.data);
                }catch(err){
                    console.log(err)
                }
            }
            getFriends();
        },[user])

        return (
            <>
            {user.username!==currentUser.username && (
                <button className="rightbarFollowButton" onClick={followHandler}>
                   {followed ? "Unfollow" : "Follow"}
                   {followed ? <Remove/> : <Add/>}
                </button>)}
                <h4 className="rightbarTitle">User Information</h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">City:</span>
                        <span className="rightbarInfoValue">{user.city}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">From:</span>
                        <span className="rightbarInfoValue">{user.from}</span>
                    </div>
                    <div className="rightbarInfoItem">
                        <span className="rightbarInfoKey">Relationship:</span>
                        <span className="rightbarInfoValue">{user.relationship===1?"Single":user.relationship===2?"married":user.relationship===3?"committed":""}</span>
                    </div>
                </div>
                <h4 className="rightbarTitle">User Friends</h4>
                <div className="rightbarFollowings">
                    {friends.map((friend)=>(
                        <Link to={`/profile/${friend.username}`} style={{textDecoration:"none"}}>
                            <div className="rightbarFollowing" key={friend._id}>
                            <img className="rightbarFollowingImg" src={friend.ProfilePicture ? PF+friend.profilePicture : PF + "/person/noAvatar.jpg"} alt=""/>
                            <span className="rightbarFollowingName">{friend.username}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </>
        )
    }
    return (
        <div className="rightbar" >
            <div className="rightbarWrapper">
                {user?<ProfilePageRightbar/>:<HomePageRightbar/>}
            </div>
        </div>
    )
}
