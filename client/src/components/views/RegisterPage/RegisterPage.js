import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom';
import {Button, Typography, Input} from 'antd'

function RegisterPage() {
  const {Title} = Typography;

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const [Email, setEmail] = useState("")
  const [Password, setPassword] = useState("")
  const [Name, setName] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); //버튼 누를 때 페이지 refresh되는 거 막아줌

    if(Password !== ConfirmPassword) {
      return alert('비밀번호와 비밀번호 확인은 같아야 합니다.')
    }

    let body = {
      email: Email,
      name: Name,
      password: Password
    }

    dispatch(registerUser(body))
    .then(response => {
      if(response.payload.success) {
        navigate('/login') // 페이지 이동시 navigate 사용
      } else {
        alert('Failed to sign up')
      }
    })

  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{ display: 'flex', flexDirection: 'column' }}
          onSubmit={onSubmitHandler}
      >
        <Title style={{display:'flex', justifyContent: 'center', alignItems: 'center'}} level={2}>🌟 Sign In 🌟</Title>
        <label>Email</label>
        <Input type="email" value = {Email} placeholder='Enter your email' onChange = {onEmailHandler} />
        <label>Name</label>
        <Input type="text" value = {Name} placeholder='Enter your name' onChange = {onNameHandler} />
        <label>Password</label>
        <Input type="password" value = {Password} placeholder='Enter your passworc' onChange = {onPasswordHandler} />
        <label>Confirm Password</label>
        <Input type="password" value = {ConfirmPassword} placeholder='Confirm your password' onChange = {onConfirmPasswordHandler} />
        
        <br />
        <Button type="primary" htmlType="submit"  style={{ minWidth: '100%', marginTop: '15px' }}>
          CREATE AN ACCOUNT
        </Button>
      </form>
    </div>
  )
}

export default RegisterPage
