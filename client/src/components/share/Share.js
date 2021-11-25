import './Share.css'
import { PermMedia,Label,Room,EmojiEmotions, ContactlessOutlined,Cancel } from '@material-ui/icons'
import { useContext,useState,useRef } from 'react'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'
import { PostContext } from '../../context/PostContext'
export default function Share() {

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const {user}=useContext(AuthContext)
    const desc = useRef();
    const [file, setFile] = useState(null)
    const {setState,postFetching} = useContext(PostContext)

    const submitHandler = async (e) =>{
         e.preventDefault();
         const newPost={
             userId:user._id,
             desc: desc.current.value
         }
         if(file){
             const data=new FormData();
             const fileName = Date.now()+file.name;
             data.append("file",file)
             data.append("name",fileName)
             newPost.img = fileName
             console.log(newPost.img);
             try{
                await axios.post("http://localhost:8800/api/upload",data,{
                    params:{
                        name:fileName
                    }
                })
                setState({postFetching:!postFetching})
             }catch(err){
                 console.log(err)
             }
         }
         try{
            await axios.post("http://localhost:8800/api/posts/",newPost)
            setState({postFetching:!postFetching})
         }catch(error){
            console.log(error);
         }
    }

    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img className="shareProfileImg" src={user.profilePicture? PF+user.profilePicture : PF+"/person/noAvatar.jpg" } alt=""/>
                    <input placeholder={"what's in your mind "+user.username+" ?"} className="shareInput" ref={desc}/>
                </div>
                <hr className="shareHr"/>
                {file && (
                    <div className="shareImgContainer">
                        <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
                        <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
                    </div>
                )}
                <form className="shareBottom" onSubmit={submitHandler} encType="multipart/form-data">
                    <div className="shareOptions">
                        <label htmlFor="file" className="shareOption">
                            <PermMedia htmlColor="tomato" className="shareIcon"/>
                            <span className="shareOptionText">Photo or Video</span>
                            <input  style={{display:"none"}} type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e)=>setFile(e.target.files[0])}/>
                        </label>
                        <div className="shareOption">
                            <Label htmlColor="blue" className="shareIcon"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption">
                            <Room htmlColor="green" className="shareIcon"/>
                            <span className="shareOptionText">Location</span>
                        </div>
                        <div className="shareOption">
                            <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                            <span className="shareOptionText">Feelings</span>
                        </div>
                    </div>
                    <button className="shareButton" type="submit">Share</button>
                </form>
            </div>
        </div>
    )
}
