import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';
import {Button, Typography, Input} from 'antd'

function LoginPage() {
  const {Title} = Typography;

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); //버튼 누를 때 페이지 refresh되는 거 막아줌

    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body))
    .then(response => {
      if(response.payload.loginSuccess) {
        window.localStorage.setItem('userId', response.payload.userId);
        navigate('/') // 페이지 이동시 navigate 사용
      } else {
        alert('Error')
      }
    })

  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{ maxWidth: '350px' }}
          onSubmit={onSubmitHandler}
      >
        <Title style={{display:'flex', justifyContent: 'center', alignItems: 'center'}} level={2}>🌟 Log In 🌟</Title>
        <label>Email</label>
        <Input type="email" value = {Email} placeholder='Enter your email' onChange = {onEmailHandler} />
        <label>Password</label>
        <Input type="password" value = {Password} placeholder='Enter your password' onChange = {onPasswordHandler} />
        <br />
        <Button type="primary" htmlType="submit"  style={{ minWidth: '100%', marginTop: '15px'}}>
          Log in
        </Button>
      </form>
    </div>
  )
}

export default LoginPage
