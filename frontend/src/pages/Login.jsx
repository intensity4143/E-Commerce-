import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const {token, setToken, navigate, backendUrl} = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // for Sign Up
      if(currentState === 'Sign Up'){
        const resp = await axios.post(`${backendUrl}/api/user/register`, {
          name, email, password  
        })

        if(resp.data.success){
          setToken(resp.data.token)
          localStorage.setItem("token", resp.data.token)
          setEmail('');
          setPassword('');
          setName('');
          navigate('/')
        }
        else{
          toast.error(resp.data.message || "Something went wrong");
        }
      }

      // login
      else{
        const resp = await axios.post(`${backendUrl}/api/user/login`, {
          email, password  
        })

        if(resp.data.success){
          setToken(resp.data.token)
          localStorage.setItem("token", resp.data.token)
          setEmail('');
          setPassword('');
          setName('');
          navigate('/')
        }
        else{
          toast.error(resp.data.message || "Something went wrong");
        }
      }
      console.log("Form Submitted", currentState);
    } 
    catch (error) {
      toast.error(error.response?.data?.message || "something went wrong");
    }
  };

useEffect(() => {
  if (token) {
    navigate('/');
  }
}, [token]);

  const handleGoogleAuth = () => {
    // Google Auth Logic will go here later
    toast.error("functionality not added yet")
    console.log("Google Auth Triggered");
    return;
  };

  return (
    <form 
      onSubmit={onSubmitHandler} 
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 animate-in fade-in duration-500'
    >
      {/* Header Section */}
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl transition-all duration-300'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      {/* Input Fields */}
      <div className='w-full flex flex-col gap-4'>
        {currentState === 'Sign Up' && (
          <input 
            onChange={(e)=>{setName(e.target.value)}}
            value={name}
            type="text" 
            className='w-full px-4 py-2 border border-gray-400 focus:border-gray-800 outline-none transition-all placeholder:text-gray-400' 
            placeholder='Name' 
            required 
          />
        )}
        <input 
          onChange={(e)=>{setEmail(e.target.value)}}
          value={email}
          type="email" 
          className='w-full px-4 py-2 border border-gray-400 focus:border-gray-800 outline-none transition-all placeholder:text-gray-400' 
          placeholder='Email' 
          required 
        />
        <input 
          onChange={(e)=>{setPassword(e.target.value)}}
          value={password}
          type="password" 
          className='w-full px-4 py-2 border border-gray-400 focus:border-gray-800 outline-none transition-all placeholder:text-gray-400' 
          placeholder='Password' 
          required 
        />
      </div>

      {/* Navigation & Forgot Password */}
      <div className='w-full flex justify-between text-sm mt-[-4px] text-gray-600'>
        <p className='cursor-pointer hover:text-black transition-colors'>Forgot password?</p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:text-black transition-colors underline underline-offset-4'>
            Create Account
          </p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:text-black transition-colors underline underline-offset-4'>
            Login Here
          </p>
        )}
      </div>

      {/* Main Action Button */}
      <button className='w-full bg-black text-white font-light px-8 py-2.5 mt-4 active:bg-gray-700 transition-all hover:shadow-md active:scale-[0.98]'>
        {currentState === 'Login' ? 'Sign In' : "Sign Up"}
      </button>

      {/* Divider */}
      <div className='flex items-center w-full my-2'>
        <hr className='flex-1 border-gray-200' />
        <span className='px-3 text-gray-400 text-[10px] uppercase tracking-[0.2em]'>or</span>
        <hr className='flex-1 border-gray-200' />
      </div>

      {/* Google Auth Button */}
      <button 
        type="button" 
        onClick={handleGoogleAuth}
        className='w-full border border-gray-300 py-2.5 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors active:scale-[0.98]'
      >
        <img 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google" 
          className='w-5'
        />
        <span className='text-sm text-gray-700'>Continue with Google</span>
      </button>
    </form>
  );
};

export default Login;