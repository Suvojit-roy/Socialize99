import React, { useContext, useEffect, useState } from "react";
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [data, setData] = useState([]);
    const {state,dispatch}=useContext(UserContext)
   
    useEffect(() => {
        fetch("/getsubpost", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
        })
            .then(res => res.json())
            .then((result) => {
                // console.log(result.posts);
                setData(result.posts);
            });
    }, []);

    const likePost=(id)=>{
        fetch('/like',{
            method:"put",  
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"

            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newdata);
        })
        
        
    }
    const unlikePost=(id)=>{
        fetch('/unlike',{
            method:"put",  
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt"),
                "Content-Type":"application/json"

            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newdata=data.map(item=>{
                if(item._id==result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newdata);
        })
        
        
    }

    const makeComment = (text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
           })
          setData(newData)
        }).catch(err=>{
            console.log(err)
        })
  }

  const deletePost=(postid)=>{
      fetch(`/deletepost/${postid}`,{
          method:"delete",
          headers:{
              Authorization:"Bearer "+localStorage.getItem("jwt")
          }
      }).then(res=>res.json())
      .then(result=>{
          console.log(result)
          const newData=data.filter( item =>{
              return (item._id !=result._id)
          })
          setData(newData)
      })
  }

    return data.map((item) => {
        return (
            <div className="home">
                <div className="card home-card" key={item.postedBy._id}>
                    <h5><Link to={item.postedBy._id===state._id?'/profile':'/profile/'+item.postedBy._id}>{item.postedBy.name}</Link>{item.postedBy._id===state._id&&<i style={{float:"right"}} class="material-icons" onClick={e=>deletePost(item._id)}>delete</i>}</h5>
                    <div className="card-image">
                        <img src={item.photo} />
                    </div>
                    <div className="card-content">
                        <i className="material-icons" style={{ color: "red" }}>
                            favorite
                        </i>
                        {item.likes.includes(state._id)
                        ?
                        <i class="material-icons" onClick={e=>unlikePost(item._id)}>thumb_down</i>
                        :
                        <i class="material-icons" onClick={e=>likePost(item._id)}>thumb_up</i>}
                        
                        
                        <h6>{item.likes.length} likes</h6>
                        <h6>{item.title}</h6>
                        <p>{item.body}</p>
                        {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span>{record.text}</h6>
                                        )
                                    })
                                }
                        <form onSubmit={e=>{
                            e.preventDefault();
                            makeComment(e.target[0].value,item._id)
                        }}>
                        <input type="text" placeholder="comment" />
                        </form>
                    </div>
                </div>
            </div>
        );
    });
};

export default Home;
