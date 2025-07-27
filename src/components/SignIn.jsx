import md5 from 'md5';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import Images from '../images/illustration.png';
import { post } from './../services/apiService';

const SignIn = ({ setAuth }) => {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = (e) => {
    e.preventDefault();
    setIsLoading(true);
    const hashedPassword = md5(password);
    console.log(hashedPassword);
    post('/login', { email, password })
      .then((data) => {
        if (data?.response?.token) {
          login(data?.response?.token);
          setAuth(true);
          setIsLoading(false);
          navigate('/dashboard');
        } else {
          setIsLoading(false);
          console.error('Login Error:', data);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Login Error:', error);
      });
  };

  return (
    <div className='p-6'>
      <div className='flex w-full max-w-full overflow-hidden rounded-lg bg-white'>
        {/* Left Side - Illustration */}
        <div className='bg-white-200 hidden items-center justify-center p-6 md:flex md:w-1/2'>
          <img src={Images} alt='Illustration' className='w-3/4' />
        </div>

        {/* Right Side - Sign In Form */}
        <div className='w-full p-8 md:w-1/2'>
          <h2 className='text-center text-2xl font-semibold text-gray-700'>Sign in</h2>

          <form onSubmit={handleSignIn} className='mt-6'>
            <div>
              <label className='block text-gray-700'>Email Address</label>
              <input
                type='email'
                placeholder='email@address.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='mt-2 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none'
              />
            </div>

            <div className='mt-4'>
              <label className='block text-gray-700'>Password</label>
              <input
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='mt-2 w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none'
              />
            </div>

            {/* <div className='mt-4 flex items-center justify-between'>
              <a href='#' className='text-sm text-orange-500 hover:underline'>
                Forgot Password?
              </a>
            </div> */}

            <button
              disabled={isLoading}
              type='submit'
              className='mt-6 w-full rounded-lg bg-orange-500 p-3 text-white transition duration-300 ease-in-out hover:bg-orange-600'
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
