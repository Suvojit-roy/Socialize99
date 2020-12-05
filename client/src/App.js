import React,{useEffect,createContext,useReducer, useContext} from 'react'
import Navbar from './components/Navbar'
import './App.css';
import {BrowserRouter,Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Signin from './components/screens/Signin'
import Profile from './components/screens/Profile'
import Signup from './components/screens/Signup'
import Createpost from './components/screens/Createpost'
import UserProfile from './components/screens/UserProfile'
import {reducer,initialState} from './reducers/userReducer'
import Subuerposts from './components/screens/Subsuserposts'

export const UserContext= createContext()

const Routing=()=>{
  const {state,dispatch}=useContext(UserContext)
  const history=useHistory();
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    console.log(user)

    if(user){
      dispatch({type:"USER",payload:user})
      // history.push('/')
    }
    else{
      history.push('/signin')
    }
  },[])


  return(
    <>
        <Route path="/" component={Home} exact></Route>
        <Route path="/signin" component={Signin} exact></Route>
        <Route path="/profile" component={Profile} exact></Route>
        <Route path="/signup" component={Signup} exact></Route>
        <Route path="/create" component={Createpost} exact></Route>
        <Route path="/profile/:userid" component={UserProfile} exact></Route>
        <Route path="/myfollowerspost" component={Subuerposts} exact></Route>
    </>
  )
}


function App() {

  const [state,dispatch]= useReducer(reducer,initialState)

  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
        
        <Navbar/>
        <Routing/>
      
    </BrowserRouter>
    </UserContext.Provider>

  );
}

export default App;
