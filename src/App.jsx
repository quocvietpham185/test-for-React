import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const generateRandomNumbers = (length) => {
    let numbers = Array.from({ length }, (_, index) => ({
      number: index + 1,
      x: Math.random() * 350, // Vị trí x ngẫu nhiên
      y: Math.random() * 350  // Vị trí y ngẫu nhiên
    }));
    numbers.sort((a, b) => b.number - a.number);
    return numbers;
  };

  const [numbers, setNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(1); 
  const [points, setPoints] = useState(0);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setTime((prevTime) => parseFloat((prevTime + 0.1).toFixed(1)));
      }, 100);

      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const handleClick = (number) => {
    if (number === currentNumber) {
      setNumbers(numbers.map(n => 
        n.number === number ? { ...n, isClicked: true } : n
      ));
      setTimeout(() => {
        setNumbers(numbers.filter(n => n.number !== number)); 
      }, 500); 
      setCurrentNumber(currentNumber + 1);

      if (currentNumber === points) {
        setStatusMessage('All cleared'); 
        setIsPlaying(false); 
      }
    } else {
      setStatusMessage('Game Over');
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    setNumbers(generateRandomNumbers(points));
    setCurrentNumber(1);
    setTime(0);
    setStatusMessage('LET\'S PLAY');
    setGameStarted(true);
    setIsPlaying(true);
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    if (!inputValue || /^[0-9]+$/.test(inputValue)) {
      setPoints(Number(inputValue));
    }
  }

  return (
    <div className="game">
      <h1 className={statusMessage === 'Game Over' ? 'game-over' : statusMessage === 'All cleared' ? 'all-cleared' : ''}>
        {gameStarted ? statusMessage : 'LET\'S PLAY'}
      </h1>
      <div className="stats">
        <p>Points: </p> 
        <input type="text" className='Points' value={points} onChange={handleChange}></input>
        <p className="time-label">Time:</p>
        <p className="time-value">{time}s</p>
        <button className='button' onClick={handleRestart}>{gameStarted ? 'Restart' : 'Play'}</button>
      </div>
      <div className="play-area">
        {numbers.map((item) => (
          <div
            key={item.number}
            className={`circle ${item.isClicked ? 'circle-clicked' : ''}`}
            style={{ top: `${item.y}px`, left: `${item.x}px` }}
            onClick={() => handleClick(item.number)}
          >
            {item.number}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
