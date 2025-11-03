import React from 'react'
import Authsidescreen from '../../components/auth/Authsidescreen'
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="authenctication-section">
        <Authsidescreen />

        <div className="formside">
          <div className="form-box">
            <div className='heading'>
              <h3>Login</h3>
              <p>Don’t use Winku Yet? <Link to="#"> Take the tour </Link> or <Link to="#">Join now </Link></p>
            </div>
            <div className="form">

              <div class="input-wrapper">
                <input type="text" id="emailphone" placeholder=" " />
                <label for="username">Email or Phone</label>
              </div>
              <div class="input-wrapper">
                <input type="password" id="password" placeholder=" " />
                <label for="password">Password</label>
              </div>
              <div className="buttons flex gap-2">
                <button className="submit-btn">Login</button>
                <Link to='/register' className='submit-btn'>Register</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login