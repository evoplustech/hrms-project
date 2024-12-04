import React from 'react'
import LoginHeader from './LoginHeader'
import LoginForm from './LoginForm'

const Login = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center login-page pt-10">
            <LoginHeader/>
            <LoginForm/>
      </div>
    </>
  )
}

export default Login