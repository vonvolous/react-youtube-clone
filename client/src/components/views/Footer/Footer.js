import React from 'react'
import './Footer.css'

function Footer() {
  return (
    <div className='footer' style={{height: '70px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem'}}>
      <p> Copyright © 2023~ </p>
    </div>
  )
}

export default Footer
