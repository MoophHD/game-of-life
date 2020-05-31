import React, { useState, useCallback, useRef, useEffect } from "react";
import { produce } from 'immer';

const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, 0],
  [-1, -1]
]

const App = () => {
  const generateEmptyGrid = (numRows, numCols) => {
    return Array.from({length: numRows}).map(() => Array.from({length: numCols}).fill(0));
  }

  const [running, setRunning] = useState(false);
  const [numRows, setNumRows] = useState(20);
  const [numCols, setNumCols] = useState(20);
  const [interval, setInterval] = useState(1000);
  const [grid, setGrid] = useState(generateEmptyGrid(numRows, numCols));
  
  const runningRef = useRef(running);
  runningRef.current = running; 
  const intervalRef = useRef(interval);
  intervalRef.current = interval;
  const numRowsRef = useRef(numRows);
  numRowsRef.current = numRows; 
  const numColsRef = useRef(numCols);
  numColsRef.current = numCols; 

  const countNeighbors = (grid, x, y, numRows, numCols) => {
    return operations.reduce((acc, [i, j]) => {
      const row = (x + i + numRows) % numRows;
      const col = (y + j + numCols) % numCols;
      acc += grid[row][col];
      return acc;
    }, 0);
  };
  
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    const numRows = numRowsRef.current;
    const numCols = numColsRef.current;

    setGrid(grid => produce(grid, newGrid => {
      for (let i = 0; i < numRows; i++) {
        for (let k = 0; k < numCols; k++) {
          let neighbours = countNeighbors(grid, i, k, numRows, numCols);
          if (neighbours < 2 || neighbours > 3) {
            newGrid[i][k] = 0;
          } else if (newGrid[i][k] === 0 && neighbours == 3) {
            newGrid[i][k] = 1;
          }
        };
      }
    }));

    setTimeout(runSimulation, intervalRef.current);
  }, []);

  useEffect(() => {
    setGrid(generateEmptyGrid(numRows, numCols));
  }, [numCols, numRows])

  return (
    <div>
      <button onClick= {() => {
        setRunning(!running);
        if (!running) {
          runningRef.current = true;
          runSimulation();
        }
      }}>
        {running ? "stop" : "start"}
      </button>

      <button 
        onClick={() => {
          setGrid(generateEmptyGrid(numCols, numRows))
       }}
      >
        clear
      </button>

      <button 
        onClick={() => {
          const grid = [];
          for (let i = 0; i < numRows; i++) {
            grid.push(Array.from(Array(numCols), () => Math.random() > .7 ? 1 : 0));
          }

          setGrid(grid);
        }}
      >
        generate
      </button>
      rows:
      <input
        placeholder={numRows}
        onChange={(e) => { 
          setRunning(false);
          setNumRows(parseInt(e.target.value))
        }}
      />
      cols:
      <input
        placeholder={numCols}
        onChange={(e) => { 
          setRunning(false);
          setNumCols(parseInt(e.target.value))
        }}
      />
      speed:
      <input 
        style={{direction: "rtl"}}
        type="range" min="50" max="1050" step={100} value={interval}
        onInput={(e) => setInterval(e.target.value)}
        onChange={(e) => setInterval(e.target.value)}
      />

      <div style={{
        gridTemplateColumns: `repeat(${numCols}, 20px)`,
        display: 'grid',
      }}>
        {grid.map((row, i) => 
          row.map((col, k) => 
            <div 
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                })
                setGrid(newGrid);
              }}
              key={`${i}-${k}`}
              style={{
                width: 20,
                height: 20, backgroundColor: grid[i][k] ? 'red' : 'white',
                border: 'solid 1px black'
              }}>
            </div>))}
      </div>
    </div>

  )
}


export default App;