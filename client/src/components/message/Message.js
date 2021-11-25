import './Message.css'
import {format} from 'timeago.js'
export default function Message({message,own}) {
    return (
        <div className={own?"message own":"message"}>
            <div className="messageTop">
                {!own && <img src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80" alt="" className="messageImg"/>}
                <p className="messageText">{message.text}</p>
            </div>
            <div className="messageBottom">
                {format(message.createdAt)}
            </div>
        </div>
    )
}

