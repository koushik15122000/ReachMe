import axios from 'axios'
import Notiflix from 'notiflix';
export const loginCall = (user,dispatch,BE) =>{
    dispatch({type:"LOGIN_START"})
    try{
        axios.post(`http://localhost:8800/api/auth/login`,user).then(res=>{
            console.log(res.data)
            if(res.status===200){
                dispatch({type:"LOGIN_SUCCESS",payload:res.data})
            }
            else if(res.status===202){
                Notiflix.Notify.failure("user not found")
                dispatch({type:"LOGIN_NO_USER"})
            }else if(res.status===201){
                Notiflix.Notify.failure("wrong password")
                dispatch({type:"LOGIN_NO_USER"})
            }
        });
    }catch(error){
        dispatch({type:"LOGIN_FAILURE",payload:error})
    }
}