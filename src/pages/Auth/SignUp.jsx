import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/inputs/Input.jsx";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper.js";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATH } from "../../utils/apiPaths.js";
import { UserContext } from "../../context/UserContext.jsx";
import uploadImage from "../../utils/uploadImage.js";

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const {updateUser}  = useContext(UserContext)

  const handleSignup = async (e) => {
    e.preventDefault();

    let profileImageURL = ""

    if(!fullName){
      setError("Please enter your name")
      return
    }
    
    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return
    }

    if(!password){
      setError("Please enter the password")
      return;
    }

    setError("");

    

    //Singup API call
    try{

      if(profilePic){
        const imgUploadRes = await uploadImage(profilePic);
        profileImageURL = imgUploadRes.imageURL || ""
      }

     

      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER,{
        fullName, email, password, profileImageURL,
      });
      const {token,user} = response.data;
      if(token){
        localStorage.setItem("token",token);
        updateUser(user);
        navigate('/dashboard')
      }

    }catch(error){
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }
      else{
        console.log(error.message)
        setError("Something went wrong. Please try again",error.message)
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0  flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">SignUp</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today by entering your details
        </p>

        <form onSubmit={handleSignup}>
          
          <ProfilePhotoSelector image={profilePic}  setImage={setProfilePic}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              placeholder="John"
              label="Full Name"
              onChange={({target}) => setFullName(target.value)}
              type="text"
            />

            <Input
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
              }}
              label="Email Address"
              placeholder="jon@example.com"
              type="text"
            />

            <div className="col-span-2">
              <Input
                value={password}
                onChange={({ target }) => {
                  setPassword(target.value);
                }}
                label="Password"
                placeholder="Min 8 characters"
                type="password"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary cursor-pointer">
            SIGNUP
          </button>

          <p className="text-[13px] text-slate-800 mt-3"> 
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary underline cursor-pointer ">
            Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
