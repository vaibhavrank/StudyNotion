import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, signUp } from '../services/operations/authAPI';

const VerifyEmail = () => {
    const {signupData, loading} = useSelector((state)=>state.auth);
    const navigate = useNavigate();
    const [otp,setOtp] = useState("");
    const dispatch = useDispatch();
    useEffect( () =>{
        // navigate("/signup  ")
        if(!signupData){
            navigate("/signup");
        }
    },[])
    const handleOnSubmit = (e)=>{
        e.preventDefault();
        const {
            accountType,
            firstName,
            lastName,
            email,password,
            confirmPassword,

        } = signupData;
        console.log("OTP AT FRONTEND...........",otp);
        dispatch(signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate))
    }
    
  return (
    <div>
        {
             loading? (
                <div>
                Loading...
                </div>
            ) : (
                <div className='flex flex-col gap-2 text-white'>
                    <h1>Choose new password</h1>
                    <p>Almost done, Enter your new password and your all set</p>
                    <form onSubmit={handleOnSubmit}>
                        <OTPInput 
                        inputType='number'
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderSeparator={<span>-</span>}
                        renderInput={(props)=> <input {...props} placeholder='-' className='text-richblack-900 bg-richblack-100' />}
                        className="w-full h-2 p-6 bg-richblack-600 text-black"
                        />
                        <button type='submit'>
                            Verify Email
                        </button>
                        
                    </form>
                    <div>
                    <Link to="/login">
                    <p>Back to Login </p>
                    </Link>
                    <button
                    onClick={()=>dispatch(sendOtp(signupData.email,navigate))}>
                        Resend It
                    </button>        
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default VerifyEmail