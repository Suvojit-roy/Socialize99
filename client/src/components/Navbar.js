import React, { useContext ,useRef,useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar=()=>{
    const searchModal=useRef(null)
    const [search,setSearch]=useState()
    const [userDetails,setUserDetails] = useState([])
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])
    const renderList=()=>{
        if(state){
            return[
                <li key="9"><i data-target="modal1" className="material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
                <li key="2"><Link to="/profile" style={{padding:"0 7px"}}>Profile</Link></li>,
                
                <li key="3"><Link to="/myfollowerspost" style={{padding:"0 9px"}}>Following Post</Link></li>,
                <li key="4">
                    <button style={{padding:"0 10px"}} className="btn waves-effect waves-light  #f44336 red"
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                        M.toast({html:"Logged out",classes:"#f44336 red"});
                        
                        
                    }}>
                        Logout
                    </button>
                </li>
            ]
        }
        else{
            return[
                <li key="5"><Link to="/signin">Signin</Link></li>,              
                <li key="6"><Link to="/signup">Signup</Link></li>
            ]

        }
    }

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
          method:"post",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            query
          })
        }).then(res=>res.json())
        .then(results=>{
            console.log(results)
            setUserDetails(results.user)
        })
     }

    return(
        <>
            
        <nav>
            
            <div className="nav-wrapper white">
            <Link to={state?'/':'/signin'} className="brand-logo left">Instagram</Link>
            <ul id="nav-mobile" className="right">
              {renderList()}
            </ul>
            </div>
        </nav>
        
        <div id="modal1" className="modal" ref={searchModal}>
                <input
                type="text"
                placeholder="Search for users"
                value={search}
                onChange={(event)=>fetchUsers(event.target.value)}
                // style={{textAlign:"center"}}
                />  
                <ul className="collection">
                {userDetails.map(item=>{
                 return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                   M.Modal.getInstance(searchModal.current).close()
                   setUserDetails([])
                   setSearch('')
                 }}><li className="collection-item">{item.email}</li></Link> 
               })}
                </ul>
            {/* <div className="modal-content">
                <h4>Modal Header</h4>
                <p>A bunch of text</p>
            </div> */}
            <div className="modal-footer">
                <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>setUserDetails([])}>Close</button>
            </div>
        </div>
        
        </>


        
    )
}

export default Navbar;