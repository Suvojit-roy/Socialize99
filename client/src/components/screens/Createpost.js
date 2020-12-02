import React,{useEffect, useState} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

const Createpost= ()=>{

    const [title,setTitle]=useState("")
    const [body,setBody]=useState("")
    const [image,setImage]=useState("")
    const [url,setUrl]=useState("")
    const history=useHistory()

    useEffect(()=>{
        if(url){
        fetch("/createpost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                title,
                body,
                pic:url

            })
        }).then(res=>res.json())
        .then(data=>{
        
            if(data.error){
                return M.toast({html:data.error,classes:"#f44336 red"});
            }
            else{
                M.toast({html:"Post created successfully",classes:"#1de9b6 teal accent-3"});
                history.push("/")
            }
                
        }).catch(err=>{
            console.log(err);
        })

    }
    },[url])

    const postDetails=()=>{
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","instagramhere")
        data.append("cloud_name","roy123")

        fetch("https://api.cloudinary.com/v1_1/roy123/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })


        
    }

    return(
        <div className="card input-filed auth-card"
        // style={{
        //     margin:"10px auto",
        //     maxWidth:"500px",
        //     padding:"20px",
        //     textAlign:"center"
        // }}
        >
            <input type="text" placeholder="title" value={title} onChange={e=>{setTitle(e.target.value)}}/>
            <input type="text" placeholder="body" value={body} onChange={e=>{setBody(e.target.value)}}/>

            <div className="file-field input-field">
            <div className="btn">
                <span>Upload Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            <button className="btn waves-effect waves-light #42a5f5 blue lighten-1" onClick={postDetails}>
                    Submit Post
            </button> 
        </div>
    )
}


export default Createpost