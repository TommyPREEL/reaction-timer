import './mainPage.css';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import GlobalContext from '../../context/Context';

function MainPage() {
  const { user, setUser } = useContext(GlobalContext);
  const toast = useRef(null);
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const [classForGameBlock, setClassForGameBlock] =
    useState('circle no-display');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameEndable, setIsGameEndable] = useState(false);
  const [startDate, setStartDate] = useState();
  const [reactionFormat, setReactionFormat] = useState(null);
  const [timeoutIdStart, setTimeoutIdStart] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/getBestTime', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((bestTimeBack) => {
        setBestTime(bestTimeBack);
      });
  }, []);

  useEffect(() => {
    let intervalId;
    if (isGameStarted) {
      intervalId = setInterval(() => {
        if (startDate) {
          const elapsedTime = Math.abs(startDate - Date.now());
          setReactionFormat(elapsedTime);
        }
      }, 15);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [isGameStarted, startDate]);

  useEffect(() => {
    return () => {
      if (timeoutIdStart) {
        clearTimeout(timeoutIdStart);
      }
    };
  }, [timeoutIdStart]);

  function startGame() {
    resetAll();
    setClassForGameBlock('circle no-display');
    setIsGameStarted(true);
    setReactionFormat(null);
    const randomNumber = Math.floor(Math.random() * (7000 - 2000 + 1)) + 2000;

    const newTimeoutId = setTimeout(() => {
      setStartDate(Date.now());
      setIsGameEndable(true);
      setClassForGameBlock('circle');
    }, randomNumber);
    setTimeoutIdStart(newTimeoutId);
  }

  function endGame() {
    if (isGameEndable) {
      const elapsedTime = Math.abs(startDate - Date.now());
      setReactionFormat(elapsedTime);
      toast.current.show({
        severity: 'info',
        summary: 'Info',
        detail: `Your time: ${elapsedTime} ms`,
      });
      resetAll();
    } else {
      clearTimeout(timeoutIdStart);
      toast.current.show({
        severity: 'warn',
        summary: 'Nooo!',
        detail: 'You pressed the button too fast!',
      });
      setReactionFormat(null);
      resetAll();
    }
  }

  function resetAll() {
    setIsGameStarted(false);
    setIsGameEndable(false);
    setStartDate();
  }

  return (
    <div className="all-page">
      <Toast ref={toast} />
      {!user ? (
        <div className="sidebar">Connexion</div>
      ) : (
        <div>Best time : {bestTime} ms</div>
      )}
      <div className="main-page">
        <div>When the green circle appears, stop the game !</div>
        <div>{reactionFormat !== null ? reactionFormat : '0'} ms</div>
        <div className="game-block">
          <div className={classForGameBlock}></div>
        </div>
        {isGameStarted ? (
          <Button
            label="Stop the game !"
            icon="pi pi-check"
            severity="warning"
            onClick={endGame}
          />
        ) : (
          <Button
            label="Start the game !"
            icon="pi pi-check"
            severity="success"
            onClick={startGame}
          />
        )}
      </div>
    </div>
  );
}
export default MainPage;
