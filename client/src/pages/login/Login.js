import'./Login.css';
import TextField from '@material-ui/core/TextField';
import { useRef,useContext,useEffect, useState } from 'react';
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

const random1=Math.random();

export default function Login() {
    const email=useRef();
    const password=useRef();
    const {isFetching, user, dispatch }= useContext(AuthContext)
    const[csrf,setCsrf]=useState("")

    // useEffect(()=>{
    //     const func = async () =>{
    //         const res = await axios.get("http://localhost:8800/api/auth/csrf")
    //         setCsrf(res.data)
    //     }
    //     func()
    // },[])

    const handleClick=(event)=>{
    event.preventDefault();
    loginCall({email:email.current.value,password:password.current.value},dispatch)
    }

    useEffect(() => {
        console.log(isFetching, user)
      }, [isFetching, user])

    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <img className="logo" src="/assets/logo12.jpg" alt=""/>
                    <h3 className="loginLogo">
                        Reach Me
                    </h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on Reach Me.
                    </span>
                </div>
                <div className="loginRight" onSubmit={handleClick}>
                    <form className="loginBox">
                        <TextField className="textField" id="outlined-basic" type="email" label="Email" variant="outlined" inputRef={email} required/>
                        {/* <input name="csrf" value={csrf}/> */}
                        <TextField className="textField" id="outlined-basic" label="Password" type="password" variant="outlined" inputRef={password} required minLength="6"/>
                        <button type="submit" className="loginButton" disabled={isFetching}>{isFetching ? <CircularProgress color="white" size="25px"/>:"Log In"}</button>
                        <span className="loginForgot">Forgot Password?</span>
                        <Link to="/register">
                        <button className="loginRegisterButton" disabled={isFetching}>{isFetching ? <CircularProgress color="white" size="25px"/>:"Create new account"}</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}