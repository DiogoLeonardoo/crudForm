import React from 'react';
import viteLogo from '/vite.svg';
import './index.css';
import CrudForms from './components/crudForms';

function App() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='border border-gray-500 p-4'>
        <CrudForms />
      </div>
    </div>
  );
}

export default App;