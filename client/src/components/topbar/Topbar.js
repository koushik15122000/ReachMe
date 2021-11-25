import './Topbar.css';
import { Search , Person ,Chat,Notifications} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { useContext,useEffect,useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
const Topbar = () =>{
    const {user,dispatch} = useContext(AuthContext);
    const PF=process.env.REACT_APP_PUBLIC_FOLDER;
    const logoutHandler = () =>{
        dispatch({type:"LOGOUT"})
    }
    const[isClicked,setIsCLicked]=useState(false);  
    const[isLoading,setIsLoading]=useState(false);
    const[data,setData]=useState([])
    const[filteredData,setFilteredData]=useState([]);

    useEffect(()=>{
        function fetchData(){
            setIsLoading(true);
            axios.get("http://localhost:8800/api/users/all").then(res=>{
            setIsLoading(false);
            setData(res.data);
            })
        }
        fetchData();
    },[])

    const searchHandler = (event) =>{
        event.preventDefault();
        setIsCLicked(true)
        const searchWord = event.target.value;
        const newFilter = data.filter(value => {
            return value.username.toLowerCase().includes(searchWord.toLowerCase());
        })
        if(searchWord==="")
        {
            setFilteredData([]);
        }else{
            setFilteredData(newFilter);
        }
    }

    return(
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{textDecoration:"none"}}>
                    <span className="topbarLogo">Reach Me</span>
                </Link>
            </div>
            {!isClicked?
            <div className="topbarCenter">
                <div className="searchBar">
                    <Search className="searchIcon"/>
                    <input className="searchInput" onClick={()=>setIsCLicked(!isClicked)} placeholder="search for friends, posts or any video"/>
                </div>
            </div>
            :
            <div className="topbarCenterClicked">
                <div className="searchBarClicked">
                    <Search className="searchIcon"/>
                    <input className="searchInput" onChange={searchHandler} onClick={()=>setIsCLicked(true)} placeholder="search for friends, posts or any video"/>
                </div>
                <div>
                    <div className="dataResult">
                        {isLoading ? <CircularProgress color="white" className="dataItem" size="25px"/> : filteredData.map((Users)=>(
                            Users ?
                            <Link to={`profile/${Users.username}`} className="link" style={{ textDecoration: 'none' }}>
                                <div className="dataItem">
                                    <img className="userImg" src={Users.profilePicture ? PF+Users.profilePicture : PF+"/person/noAvatar.jpg" } alt=""/>
                                    <span className="userUserName">{Users.username}</span>
                                </div>
                            </Link>
                            : 
                            <div className="dataItem">
                                <span className="userUserName">no users found</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>}
            <div className="topbarRight">
                <div className="topbarLinks">
                    <span className="topbarLink">Homepage</span>
                    <span className="topbarLink">Timeline</span>
                    <span onClick={logoutHandler} className="topbarLink">Logout</span>
                </div>
                <div className="topbarIcons">
                    <div className="topbarIconsItem">
                        <Person/>
                        <span className="topbarIconBadge">1</span>
                    </div>
                    <div className="topbarIconsItem">
                        <Link to="/messenger" style={{ textDecoration: 'none' }}>
                            <Chat className="topbarChat"/>
                        </Link>
                        <span className="topbarIconBadge">2</span>
                    </div>
                    <div className="topbarIconsItem">
                        <Notifications />
                        <span className="topbarIconBadge">3</span>
                    </div>
                </div>
                <Link to={`/profile/${user.username}`}>
                <img src={user.profilePicture ? PF+user.profilePicture : PF+"/person/noAvatar.jpg"} alt="" className="topbarImg"/>
                </Link>
            </div>
        </div>
    )
}
export default Topbar