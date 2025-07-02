import React, { useState } from 'react'
import {FaRegEye,FaRegEyeSlash} from 'react-icons/fa6'

const Input = (props) => {

    const {value,onChange, placeholder,type,label} = props
    const [showPassword,setShowPassword] = useState(false)

    const togglePassword =() => {
      setShowPassword(!showPassword);
    }


  return (
    <div>
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className='input-box'>
        <input
        className="w-full bg-transparent outline-none"
        type={type=='password'? showPassword? 'text' : 'password' : type }
        placeholder={placeholder}
        onChange={(e)=>onChange(e)}
        value={value}
        />
      {type ==="password" &&(
        <>
        {showPassword? (
          <FaRegEye
          size={22}
          className='text-primary cursor-pointer'
          onClick={()=>togglePassword()}/>
        ):
          <FaRegEyeSlash
          size={22}
          className='text-slate-400 cursor-pointer'
          onClick={()=>togglePassword()}/>
        }
        </>
      )}
      </div>
    </div>

  )
}

export default Input