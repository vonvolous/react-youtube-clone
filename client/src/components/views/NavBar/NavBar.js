import React, {useState} from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { FiLogOut } from "react-icons/fi";
import "./NavBar.css";
import { useSelector } from 'react-redux';
import {RiMovie2Line} from 'react-icons/ri';

//https://react-icons.github.io/react-icons

function NavBar() {
  let navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const user = useSelector(state => state.user)

  const userCheck = user.userData && !user.userData.isAuth;

  const onClickHandler = () => {
    axios.get('/api/users/logout')
    .then(response => {
      if(response.data.success) {
        navigate('/login')
      } else {
        alert('로그아웃 하는데 실패하였습니다.')
      }
    })
  }

    return (
      <nav className='navbar'>
        <Link to = '/' className="nav-logo" onClick={() => setOpen(false)}>
          <p style={{marginTop: '30px', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}> 
            <RiMovie2Line style={{fontSize: '2rem'}}/>
            <h2 style={{fonSize: '2rem'}}>Logo</h2>
          </p>
        </Link>
        <ul className={open ? 'nav-links active' : 'nav-links'}>
          <li className='nav-item' style={{marginRight: '380px'}}>
            <Link to = '/' className='nav-link' onClick={() => setOpen(false)}>
              Main
            </Link>
          </li>
        </ul>

        {userCheck ? (
        <ul className={open ? 'nav-links active' : 'nav-links'}>
          <li className='nav-item'>
            <Link to = '/login' className='nav-link' onClick={() => setOpen(false)}>
              Sign In
            </Link>
          </li>
          <li className='nav-item'>
            <Link to = '/register' className='nav-link' onClick={() => setOpen(false)}>
              Sign Up
            </Link>
          </li>
        </ul>) : (
        <ul className={open ? 'nav-links active' : 'nav-links'}>
        <li className='nav-item'>
          <button className='logout' onClick={onClickHandler}>
            <FiLogOut style={{fontSize: '1rem'}} />&nbsp;Logout
          </button>
        </li>
      </ul>)}
    </nav>
    )
}

export default NavBar
