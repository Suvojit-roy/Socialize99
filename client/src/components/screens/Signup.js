import React, { useEffect, useState } from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'


const Signup=()=>{
    const [name,setName]=useState("")
    const [password,setPassword]=useState("")
    const [email,setEmail]=useState("")
    const history=useHistory()
    const [image,setImage]=useState("")
    const [url,setUrl]=useState(null)

    useEffect(()=>{
        if(url){
            uploadFields();
        }
    },[url])


    const uploadpic=()=>{
        
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
    
    const uploadFields=()=>{
        if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            M.toast({html:"Invalid email",classes:"#f44336 red"});
            return;
            // setEmail()
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html:data.error,classes:"#f44336 red"});
            }
            else{
                M.toast({html:data.message,classes:"#1de9b6 teal accent-3"});
                history.push("/signin")
            }
                
        }).catch(err=>{
            console.log(err);
        })
    }

    const PostData= ()=>{
        if(image){
            uploadpic();
        }
        else{
            uploadFields();
        }
       
        
    }


    return(
        <div>
      <div className="mycard">
            <div className="card auth-card">
                <h2>Instagram</h2>
                <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(event)=>setName(event.target.value)}
                />
                <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(event)=>setEmail(event.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event)=>setPassword(event.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Profile Pic</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button onClick={PostData} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                    SignUp
                </button> 
                <h5>
                    <Link to="/signin">Already have an account?</Link>
                </h5>
            </div>
      </div>
    </div>
        
    )
}

export default Signup;