import {useState} from 'react';
import axios from 'axios'
const Demo = () =>{
    const [file, setfile] = useState(null)
    const submitHandler = async (e) =>{
        e.preventDefault();
        const newPost={
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
            }catch(err){
                console.log(err)
            }
        }
   }
    return(
        <form onSubmit={submitHandler}>
            <input   type="file" id="file" accept=".png,.jpeg,.jpg" onChange={(e)=>setfile(e.target.files[0])} formEncType="application/x-www-form-urlencoded"/>
            <button type="submit">click me</button>
        </form>
    )
}
export default Demo;