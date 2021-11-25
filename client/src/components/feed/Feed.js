import Post from '../post/Post'
import Share from '../share/Share'
import './Feed.css'
import {useState,useEffect, useContext} from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { PostContext } from '../../context/PostContext';
import FlipMove from 'react-flip-move';
export default function Feed({username}) {
    
    const[post,setPost]=useState([])
    const[newPost,setNewPost]=useState(false)
    const {user} = useContext(AuthContext);
    const {postFetching} = useContext(PostContext)
    useEffect(()=>{
        const fetchPosts = async () =>{
            const res = username?await axios.get("http://localhost:8800/api/posts/profile/"+username):
            await axios.get(`http://localhost:8800/api/posts/timeline/${user._id}`);
            setPost(res.data.sort((p1,p2)=>{
                return new Date(p2.createdAt) - new Date(p1.createdAt)
            }));
            setNewPost(postFetching);
        }
        fetchPosts();
    },[username,user._id,postFetching])
    console.log(post)
    return (
        <div className="feed">
            {newPost?<></>:<></>}
            <div className="feedWrapper">
                {(!username || username===user.username) && <Share/>}
                <FlipMove>
                    {post.map((p)=>(<Post key={p._id} post={p}/>))}
                </FlipMove>
            </div>
        </div>
    )
}