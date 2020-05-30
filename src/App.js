import React, { useState, useCallback, useRef } from "react";
import { produce } from 'immer';

const numRows = 20;
const numCols = 20;
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
const countNeighbors = (grid, x, y) => {
  return operations.reduce((acc, [i, j]) => {
    const row = (x + i + numRows) % numRows;
    const col = (y + j + numCols) % numCols;
    acc += grid[row][col];
    return acc;
  }, 0);
};

const App = () => {
  const [grid, setGrid] = useState(Array.from({length: numRows}).map(() => Array.from({length: numCols}).fill(0)));
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running; 
  
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;

    setGrid(grid => produce(grid, newGrid => {
      for (let i = 0; i < numRows; i++) {
        for (let k = 0; k < numCols; k++) {
          let neighbours = countNeighbors(grid, i, k);

          if (neighbours < 2 || neighbours > 3) {
            newGrid[i][k] = 0;
          } else if (newGrid[i][k] === 0 && neighbours == 3) {
            newGrid[i][k] = 1;
          }
        };
      }
    }));

    setTimeout(runSimulation, 500);
  }, []);

  
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