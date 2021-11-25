import './Register.css'
import TextField from '@material-ui/core/TextField';
import { useRef } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';
import { useHistory,Link } from 'react-router-dom';
export default function Register() {
    const username = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();
    const history = useHistory();

    const submitHandler = async (event) =>{
        event.preventDefault();
        if(password.current.value!==confirmPassword.current.value){
            confirmPassword.current.setCustomValidity("Passwords don't match")
        }else{
            const user = {
                username:username.current.value,
                email:email.current.value,
                password:confirmPassword.current.value
            }
            try{
                const res = await axios.post("http://localhost:8800/api/auth/register",user);
                history.push("/login");
            }catch(error){
                console.log(error)
            }
        }
    }

    return (
        <div className="register">
            <div className="registerWrapper">
                <div className="registerLeft">
                    <img className="logo" src="/assets/logo12.jpg" alt=""/>
                    <h3 className="registerLogo">
                        Reach Me
                    </h3>
                    <span className="registerDesc">
                        Connect with friends and the world around you on Reach Me.
                    </span>
                </div>
                <div className="registerRight" onSubmit={submitHandler}>
                    <form className="registerBox">
                        <TextField className="textField" id="outlined-basic" required label="Username" variant="outlined" inputRef={username}/>
                        <TextField className="textField" id="outlined-basic" required label="Email" variant="outlined" inputRef={email} type="email"/>
                        <TextField className="textField" id="outlined-basic" required label="Password" variant="outlined" inputRef={password} type="password" minLength="6"/>
                        <TextField className="textField" id="outlined-basic" required label="Confirm Password" variant="outlined" inputRef={confirmPassword} type="password"/>
                        <button className="registerButton" type="submit">Sign Up</button>
                        <span className="registerForgot">Forgot Password?</span>
                        <Link to="/login" style={{textDecoration:"none"}}>
                            <button className="registerRegisterButton">Log In</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
