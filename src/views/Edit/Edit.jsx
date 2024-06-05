import React, { useState, useEffect } from 'react';
import { FaUndo, FaEraser } from 'react-icons/fa';
import './Edit.css';

const Edit = () => {
  const [board, setBoard] = useState([
    // Example initial board state
    [5, null, null, 8, 4, null, 9, 7, 6],
    [null, null, 9, 5, null, null, null, null, null],
    [null, 3, null, null, null, 9, null, null, null],
    [1, null, null, null, 9, null, null, null, 6],
    [7, null, 5, null, 9, 8, null, 4, null],
    [4, null, 9, null, null, 2, null, 1, null],
    [null, 6, null, 2, null, 3, null, 1, null],
    [null, 4, null, 1, 2, 9, 4, null, 3],
    [null, null, null, null, null, null, null, 7, null],
  ]);

  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
  const [history, setHistory] = useState([]);

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberClick = (number) => {
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newBoard = [...board];
      const previousValue = newBoard[selectedCell.row][selectedCell.col];
      newBoard[selectedCell.row][selectedCell.col] = number;
      setBoard(newBoard);
      setHistory([...history, { ...selectedCell, value: previousValue }]);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastAction = history.pop();
      const newBoard = [...board];
      newBoard[lastAction.row][lastAction.col] = lastAction.value;
      setBoard(newBoard);
      setHistory(history);
    }
  };

  const handleErase = () => {
    if (selectedCell.row !== null && selectedCell.col !== null) {
      const newBoard = [...board];
      const previousValue = newBoard[selectedCell.row][selectedCell.col];
      newBoard[selectedCell.row][selectedCell.col] = null;
      setBoard(newBoard);
      setHistory([...history, { ...selectedCell, value: previousValue }]);
    }
  };

  const handleKeyPress = (event) => {
    if (selectedCell.row !== null && selectedCell.col !== null) {
      if (event.key >= '1' && event.key <= '9') {
        handleNumberClick(parseInt(event.key));
      } else if (event.key === 'Backspace') {
        handleErase();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [selectedCell, handleKeyPress]);

  return (
    <div className="edit-page-container">
      <div className="header">Confirm your Board</div>
      <div className="content-container">
        <div className="sudoku-grid">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`sudoku-cell ${
                  selectedCell.row === rowIndex && selectedCell.col === colIndex ? 'selected' : ''
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))
          )}
        </div>
        <div className="controls">
          <div className="control-buttons">
            <button className="control-button" onClick={handleUndo}>
              <FaUndo /> Undo
            </button>
            <button className="control-button" onClick={handleErase}>
              <FaEraser /> Erase
            </button>
          </div>
          <div className="number-pad">
            {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                className="number-button"
                onClick={() => handleNumberClick(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <button className="confirm-button">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
