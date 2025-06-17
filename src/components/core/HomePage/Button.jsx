import React from 'react'
import { Link } from 'react-router-dom'
import { setProgress } from '../../../slices/loadingBarSlice'
import { useDispatch } from 'react-redux'

const Button = ({children,active,linkto}) => {
    const dispatch = useDispatch();
  return (
    <Link onClick={()=>{dispatch(setProgress(100))}}  to={linkto}>
    <div className={`text-center text-[13px] px-6 py-3 rounded-md font-semibold 
      ${active ? "bg-yellow-50 shadow-yellow-400 text-black" : "bg-richblack-800 shadow-richblack-400"} 
      shadow-md  
      hover:scale-95 transition-all duration-200`}>
        {children}
        </div>
        </Link>
  )
}

export default Button