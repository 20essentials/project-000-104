import { useState } from "react";
import "./styles.css";

const TURNS = {
  X: "✖️",
  O: "🟢",
};

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const App = () => {
  const [grid, setGrid] = useState(() => {
    const gridFromStorage = localStorage.getItem("grid");
    if (gridFromStorage) return JSON.parse(gridFromStorage);
    return Array(9).fill(null);
  });
  const [turn, setTurn] = useState(() => {
    return localStorage.getItem("turn") || TURNS.X;
  });
  const [winner, setWinner] = useState(null);

  const checkWinner = (gridToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        gridToCheck[a] &&
        gridToCheck[a] === gridToCheck[b] &&
        gridToCheck[a] === gridToCheck[c]
      ) {
        return gridToCheck[a];
      }
    }

    return null;
  };

  const checkEndGame = (newGrid) => {
    return newGrid.every((el) => el !== null);
  };

  const updateGrid = (index) => {
    if (grid[index] || winner) return;
    const newGrid = [...grid];
    newGrid[index] = turn;
    setGrid(newGrid);
    const newTurn = turn === TURNS.O ? TURNS.X : TURNS.O;
    setTurn(newTurn);
    localStorage.setItem("grid", JSON.stringify(newGrid));
    localStorage.setItem("turn", newTurn);

    const newWinner = checkWinner(newGrid);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkEndGame(newGrid)) {
      setWinner(false);
    }
  };

  const resetGrid = () => {
    setGrid(Array(9).fill(null));
    setWinner(null);
    setTurn(TURNS.X);

    localStorage.removeItem("grid");
    localStorage.removeItem("turn");
  };

  const Modal = ({ resetGrid, winner }) => {
    if (winner === null) return;
    const message = winner ? "Won: " : "Tie";

    return (
      <article className="modal">
        <div className="content">
          <h2>{message}</h2>
          {winner !== false && <Square>{winner}</Square>}
          <footer>
            <button onClick={() => resetGrid()}>Reset Game</button>
          </footer>
        </div>
      </article>
    );
  };

  const Square = ({ index, updateGrid, isSelected, children }) => {
    const className = `square ${isSelected ? "selected" : ""}`;

    return (
      <button
        onClick={() => {
          updateGrid(index);
        }}
        className={className}
      >
        {children}
      </button>
    );
  };

  return (
    <section className="container">
      <h2>TIC-TAC-TOE</h2>
      <div className="container-button">
        <button onClick={() => resetGrid()}>Reset</button>
      </div>
      <div className="grid">
        {grid.map((square, index) => {
          return (
            <Square key={index} index={index} updateGrid={updateGrid}>
              {square}
            </Square>
          );
        })}
      </div>
      <aside className="square-turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </aside>
      <Modal resetGrid={resetGrid} winner={winner} />
    </section>
  );
};

export default App;
