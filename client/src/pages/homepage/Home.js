import Feed from "../../components/feed/Feed";
import RightBar from "../../components/rightbar/RightBar";
import Sidebar from "../../components/sidebar/Sidebar";
import Topbar from "../../components/topbar/Topbar";
import { AuthContext } from "../../context/AuthContext";
import { useEffect,useContext } from "react";
import './Home.css'
const Home = () =>{

    const { isFetching, user, dispatch } = useContext(AuthContext)
    useEffect(() => {
        console.log(isFetching, user)
    }, [isFetching, user])

    
    return(
        <div>
            <Topbar/>
            <div className="homeContainer">
                <Sidebar/>
                {user && <Feed/>}
                <RightBar/>
            </div>
        </div>
    )
}
export default Home;