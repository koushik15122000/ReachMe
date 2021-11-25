import './Post.css';
import { MoreVert } from '@material-ui/icons';
import { useState,useEffect, useContext, forwardRef } from 'react';
import axios from 'axios';
import {format} from 'timeago.js';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';

const Post = forwardRef(({post},ref) => {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const[like,setLike]=useState(post.likes.length)
    const[isliked,setIsLiked]=useState(false)
    const[user,setUser]=useState({})
    const {user:currentUser} = useContext(AuthContext)

    useEffect(()=>{
        setIsLiked(post.likes.includes(currentUser._id))
    },[currentUser._id,post.likes])

    useEffect(()=>{
        const fetchUser = async () =>{
            const res = await axios.get(`http://localhost:8800/api/users?userId=${post.userId}`);
            setUser(res.data);
        }
        fetchUser();
    },[post.userId])

    const likeHandler = async () =>{
        try{
            await axios.put(`http://localhost:8800/api/posts/${post._id}/like`,{userId:currentUser._id})
        }catch(error){
            console.log(error)
        }
        setLike(isliked ? like-1 : like+1)
        setIsLiked(!isliked)
    }
    
    return (
        <div className="post" ref={ref}>
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`profile/${user.username}`}>
                            <img className="postProfileImg" src={user.profilePicture || PF+"/person/noAvatar.jpg"} alt=""/>
                        </Link>
                        <span className="postUserName">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert className="postDot"/>
                    </div>
                </div>
                <div className="postCenter">
                    {post.desc && <span className="postText">{post.desc}</span>}
                    <img className="postImg" src={PF+`/${post.img}`} alt=""/>
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        {!isliked ? <div onClick={likeHandler} className="likeIcon1"><ThumbUpOutlinedIcon color="primary" className="icon"/></div> : <div className="likeIcon1" onClick={likeHandler}><ThumbUpIcon className="icon" color="primary"/></div>}
                        <span className="postLikeCounter">{like} people liked</span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">9</span>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default Post;