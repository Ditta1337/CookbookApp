import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';

const LandingPage = () => {


  return(
    <div>
    <Navbar/>
    <div>
        <h1>Welcome to Cookbook App</h1>
        <p>This is a safe space for all you recipes to be stored locally without worrying that they will get lost!</p>

    </div>
  </div>
  ) 
};

export default LandingPage;