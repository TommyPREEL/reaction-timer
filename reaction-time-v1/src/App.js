// import logo from './logo.svg';
import './App.css';
import MainPage from './pages/mainPage/mainPage';
import GlobalContext from './context/Context';
import { useState } from 'react';


function App() {

  const [user, setUser] = useState();

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      <MainPage/>
    </GlobalContext.Provider>
  );
}

export default App;
