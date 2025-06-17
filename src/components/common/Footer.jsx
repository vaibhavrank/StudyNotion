import React from 'react'
import { CiInstagram,CiLinkedin,CiMail } from "react-icons/ci";
import { BsTelephone } from "react-icons/bs";
const Footer = () => {
  return (
    <div className='bg-transparent h-[70] px-3 py-2 text-white flex  justify-around items-start gap-5'>
      <div className='flex flex-col gap-3 items-start justify-center'>
        <div className='flex gap-2 items-center justify-center'>
          <BsTelephone />
          <p>+91 9687798433</p>
        </div>
        <div className='flex gap-2 items-center justify-center'>
          <CiMail />
          <p>vaibhavrank20@gmail.com</p>
        </div>
      </div>
      <div className='flex flex-col gap-3 items-start justify-center'>
          <div className='flex gap-2 items-center justify-center'>
            <CiInstagram />
          </div>
          <div className='flex gap-2 items-center justify-center'>
            <CiLinkedin />
          </div>
      </div>
        
    </div>
  )
}

export default Footer   