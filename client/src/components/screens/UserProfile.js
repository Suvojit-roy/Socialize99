import React, { useContext, useEffect, useState } from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const UserProfile=()=>{

    
    const [userProfile,setProfile]=useState(null)
    const {state,dispatch}=useContext(UserContext)
    const {userid}=useParams()
    const [showfollow,setShowfollow]=useState(state?!state.following.includes(userid):true)
    // console.log(userid);
    
    useEffect(()=>{
        fetch(`/user/${userid}`,{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result) 
            
            setProfile(result)
        })
     },[])

     const followUser=()=>{
         fetch('/follow',{
             method:"put",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                 followId:userid
             })
         }).then(res=>res.json())
         .then(data=>{
             console.log(data);
             dispatch({"type":"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return{
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                     }
                 }
             })
             setShowfollow(false);  
         })
     }
     const unfollowUser=()=>{
         fetch('/unfollow',{
             method:"put",
             headers:{
                 "Content-Type":"application/json",
                 "Authorization":"Bearer "+localStorage.getItem("jwt")
             },
             body:JSON.stringify({
                 unfollowId:userid
             })
         }).then(res=>res.json())
         .then(data=>{
             console.log(data);
             dispatch({"type":"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 const newfollower=prevState.user.followers.filter(item=>{
                     return (item!=data._id)
                 })
                 return{
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newfollower
                     }
                 }
             })
             setShowfollow(true);  
             
         })
     }

    return(
        <>
        {userProfile?
        
        <div style={{maxWidth:"90%",margin:"0 auto"}}>
            <div  style={{display:"flex",justifyContent:"space-around",margin:"18px 0px",borderBottom:"1px solid grey"}}>

                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={userProfile.user.pic}/>
                </div>
                <div>
                    <h4>{userProfile.user.name}</h4>
                    <h5>{userProfile.user.email}</h5>
                    <div style={{display:"flex",justifyContent:"space-between",width:"109%"}}>
                        <h6>{userProfile.posts.length} posts</h6>
                        <h6>{userProfile.user.followers.length} followers</h6>
                        <h6>{userProfile.user.following.length} following</h6>
                    </div>
                    {
                        showfollow?
                        <button style={{margin:"1rem"}} onClick={()=>followUser()} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                        Follow
                        </button>
                        : 
                        <button style={{margin:"1rem"}} onClick={()=>unfollowUser()} className="btn waves-effect waves-light #42a5f5 blue darken-1">
                        Unfollow
                        </button> 
                    }
                    
                    
                </div>
            </div>
            <div className="gallery">
            {userProfile.posts.map(item=>{
                return <img key={item._id} className="item card" src={item.photo} alt={item.title} style={{maxWidth:"33rem",maxHeight:"33rem",justifyContent:"space-between"}}/>
            })}
                
            </div>
        </div>
        :<h3>Loading..</h3>}
        
        </>
        
    )
}

export default UserProfile;