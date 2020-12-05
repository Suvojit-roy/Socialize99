import React, { useContext, useEffect, useState } from 'react'
import {UserContext} from '../../App'
import {Link, useHistory} from 'react-router-dom'

const Profile=()=>{

    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage]=useState("")
    // const [url,setUrl]=useState(null)
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            
            setPics(result.mypost)
            // console.log(state)
        })
     },[])

     useEffect(()=>{
        if(image){
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
            // console.log(data)
            // setUrl(data.url)
            // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            // dispatch({type:"UPDATEPIC",payload:data.url})
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Authorization":"Bearer "+localStorage.getItem("jwt"),
                    "content-Type":"application/json"
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
                window.location.reload()
            })

            // window.location.reload()
            
        })
        .catch(err=>{
            console.log(err)
        })
        }
     },[image])
     
     const updatephoto=(file)=>{
        setImage(file)
        
     }
    
    return(
        <>
        <div style={{maxWidth:"90%",margin:"0 auto"}}>
            <div  style={{display:"flex",justifyContent:"space-around",margin:"18px 0px",borderBottom:"1px solid grey"}}>

                <div  style={{display:"flex",justifyContent:"space-around",flexDirection:"column"}}>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={state?state.pic:"loading"}/>
                    
                    <div className="file-field input-field">
                        <div className="btn">
                            <span>Update pic</span>
                            <input type="file" onChange={(e)=>updatephoto(e.target.files[0])}/>
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text"/>
                        </div>
                    </div>
                    
                </div>
                <div>
                   <h4>{state?state.name:"loading"}</h4>
                   <h5>{state?state.email:"loading"}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{mypics.length} posts</h6>
                       <h6>{state?state.followers.length:"0"} followers</h6>
                       <h6>{state?state.following.length:"0"} following</h6>
                   </div>
                   <button className="btn waves-effect waves-light"  style={{margin:"19px"}}>
                    <Link style={{color:"white"}} to="/create"><span style={{color:"white"}}>Add Post</span></Link>
                    </button> 
                    
                    

               </div>
            </div>
            <div className="gallery">
            {mypics.map(item=>{
                return <img key={item._id} className="item card" src={item.photo} alt={item.title} style={{maxWidth:"33rem",maxHeight:"33rem",justifyContent:"space-between"}}/>
            })}
                
            </div>
        </div>
        </>
        
    )
}

export default Profile;