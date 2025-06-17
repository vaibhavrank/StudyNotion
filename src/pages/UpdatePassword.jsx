import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../services/operations/authAPI';
import { useLocation } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
const UpdatePassword = () => {
    const [formData,setFormData] = useState({
        password:"",
        confirmPassword:"", 
    });
    const [showConfirmPassword,setShowConfirmPassword] = useState(false);
    const [showPassword,setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const {loading} = useSelector( (state) => state.auth );

    const handleOnChange = (e)=>{
        setFormData( (prevData) =>(
            {
                ...prevData,
                [e.target.name]: e.target.value,
            }
        ))
    }

    const handleOnSubmit = (e)=>{
        e.preventDefault();
        const token = location.pathname.split('/').at(-1);
        dispatch(resetPassword(password,confirmPassword,token));
    }
    return (
        <div className='text-white'>
            {
                loading? (
                    <div>
                    Loading ...
                    </div>
                ) : (
                    <div>
                        <h1>Choose new password</h1>
                        <p>Almost done, Enter your new password and your all set</p>
                        <form onSubmit={handleOnSubmit}>
                            <label>
                                <p>
                                    New Password
                                </p>
                                <input 
                                required
                                type={showPassword?'text':"password"}
                                value={password}
                                name='password'
                                onChange={handleOnChange} 
                                placeholder='Password'
                                className='w-full p-6 bg-richblack-600 text-richblack-5'
                                 />
                                 <span
                                 onClick={()=>setShowPassword((prev) => !prev )}
                                 >
                                    {
                                        showPassword ? <AiFillEyeInvisible fontSize={24}/> : <AiFillEye fontSize={24} />
                                    }
                                 </span>
                            </label>

                            <label>
                                <p>
                                   Confirm New Password
                                </p>
                                <input 
                                required
                                type={showConfirmPassword?'text':"password"}
                                visible
                                value={confirmPassword}
                                name='confirmPassword'
                                placeholder='confirm Password'
                                className='w-full p-6 bg-richblack-600 text-richblack-5'
                                onChange={handleOnChange} 
                                 />
                                 <span
                                 onClick={()=>setShowConfirmPassword((prev) => !prev )}
                                 >
                                    {
                                        showConfirmPassword ? <AiFillEyeInvisible fontSize={24}/> : <AiFillEye fontSize={24} />
                                    }
                                 </span>
                            </label>

                            <button type='submit'>
                                Reset Password
                            </button>

                        </form>
                        <div>
                            <Link to="/login">
                            <p>Back to Login </p>
                            </Link>
                        </div>
                    </div>
                )
            }
        </div>
    )
  
}

export default UpdatePassword