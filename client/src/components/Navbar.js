import React, { useContext } from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar=()=>{
    const {state,dispatch}=useContext(UserContext)
    const history=useHistory()
    const renderList=()=>{
        if(state){
            return[
                <li><Link to="/profile">Profile</Link></li>,
                <li><Link to="/create">Add Post</Link></li>,
                <li><Link to="/myfollowerspost">My following post</Link></li>,
                <li>
                    <button className="btn waves-effect waves-light  #f44336 red"
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
                <li><Link to="/signin">Signin</Link></li>,              
                <li><Link to="/signup">Signup</Link></li>
            ]

        }
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
        </>
        
    )
}

export default Navbar;