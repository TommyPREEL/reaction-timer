// import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

import mainPage from './pages/mainPage/mainPage';

function App() {
  useEffect(() => {
    fetch('http://localhost:4000/api/')
  })
  
  return (
    
  <mainPage/>
  );
}

export default App;
