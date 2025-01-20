import React from 'react'

const IconBtn = ({
    text,onClick,children,
    disabled,outline=false,customClasses,type
}) => {

  return (
    <button 
    disabled={disabled}
    onClick={onClick}   
    type={type}
    className={` ${customClasses}`}
    
    >
        {
            children? (
            <div className='flex items-center gap-2 ' >
                <span>
                {text}
                </span>
                {children}    
                
            </div>):(text)
        }
    </button>
  )
}

export default IconBtn