import './Online.css'
export default function Online({user}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <li className="rightbarFriends">
            <div className="rightbarProfileImgContainer">
                <img className="rightbarProfileImg" src={PF+user.profilePicture} alt=""/>
                <span className="rightbarOnline"/>
            </div>
            <span className="rightbarUsername">{user.username}</span>
        </li>
    )
}
