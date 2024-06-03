import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Edit.css';
import { FaUndo, FaEraser } from 'react-icons/fa';

const Edit = () => {
  const [board, setBoard] = useState(Array(9).fill(Array(9).fill('')));
  const [history, setHistory] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the initial board data from the backend (placeholder)
    fetch('http://localhost:5000/get-initial-board')
      .then(response => response.json())
      .then(data => {
        setBoard(data.board);
        setHistory([data.board]);
      });
  }, []);

  const handleCellClick = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleNumberClick = (number) => {
    if (selectedCell) {
      const newBoard = board.map((r, rowIndex) => 
        r.map((cell, colIndex) => 
          rowIndex === selectedCell.row && colIndex === selectedCell.col ? number : cell
        )
      );
      setBoard(newBoard);
      setHistory([...history, newBoard]);
      setSelectedCell(null);
    }
  };

  const handleKeyDown = (e) => {
    if (selectedCell && /^[1-9]$/.test(e.key)) {
      handleNumberClick(parseInt(e.key, 10));
    } else if (selectedCell && e.key === 'Backspace') {
      handleErase();
    }
  };

  const handleErase = () => {
    if (selectedCell) {
      const newBoard = board.map((r, rowIndex) => 
        r.map((cell, colIndex) => 
          rowIndex === selectedCell.row && colIndex === selectedCell.col ? '' : cell
        )
      );
      setBoard(newBoard);
      setHistory([...history, newBoard]);
      setSelectedCell(null);
    }
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setBoard(newHistory[newHistory.length - 1]);
      setHistory(newHistory);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell]);

  const handleConfirm = () => {
    navigate('/solve');
  };

  return (
    <div className="edit-page-container">
      <div className="header">Confirm your Board</div>
      <div className="content-container">
        <div className="sudoku-grid">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="sudoku-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`sudoku-cell ${selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex ? 'selected' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell}
                </div>
              ))}
            </div>
          ))}
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
            {Array.from({ length: 9 }, (_, i) => i + 1).map(number => (
              <button key={number} className="number-button" onClick={() => handleNumberClick(number)}>
                {number}
              </button>
            ))}
          </div>
          <button className="confirm-button" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default Edit;
