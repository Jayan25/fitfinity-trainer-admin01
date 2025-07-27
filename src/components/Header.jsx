import React from 'react';

const Header = () => {
  return (
    <header
      className='flex w-full items-center justify-end bg-white p-4 shadow-md'
      style={{ height: '4rem' }}
    >
      <div className='relative'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 bg-gray-300'>
          <span className='text-sm text-black'>👤</span>
        </div>
        <span className='absolute right-0 bottom-0 h-2 w-2 rounded-full border-2 border-white bg-green-500'></span>
      </div>
    </header>
  );
};

export default Header;
