import React,{useState} from 'react'
import Signin from '../Components/Auth/Signin'
import Signup from '../Components/Auth/Signup'

const Login = () => {

  const [login,setLogin] = useState(false)

  return (
    <div>
      {login?(
        <Signin setLogin={setLogin}/>
      ):(<Signup setLogin={setLogin}/>)}
    </div>
  )
}

export default Login
