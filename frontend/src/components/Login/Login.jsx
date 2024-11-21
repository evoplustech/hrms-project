import React from 'react'
import LoginHeader from './LoginHeader'
import LoginForm from './LoginForm'

const Login = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center login-page">
            <LoginHeader/>
            <LoginForm/>
      </div>
    </>
  )
}

export default Login