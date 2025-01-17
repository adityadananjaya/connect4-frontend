import React from 'react';
import Slot from "./Slot";
import { useState, useEffect } from "react"; 
import axios from 'axios';

const Board = () => { 

    const [board, setBoard] = useState([
        ['','','','','','',''],
        ['','','','','','',''],
        ['','','','','','',''],
        ['','','','','','',''],
        ['','','','','','',''],
        ['','','','','','','']
    ]);

    const [canClick, setCanClick] = useState(true);

    const [currPlayer, setCurrPlayer] = useState('X');
    const [oppPlayer, setOppPlayer] = useState('O');
    const [gameOver, setGameOver] = useState(false);

    const get_row = column => {
        let row = board.findIndex((rowArr, index) => {
            return (rowArr[column] !== '' || (index === board.length - 1));
        });

        if(row !== board.length - 1) row -= 1;
        if(board[row][column] !== '') row -= 1; 

        return row;
    }

    async function postData(board, currPlayer, oppPlayer, gameOver) {
        
        const body = {board, currPlayer, oppPlayer};
        console.log("body sent: ", body)
        const response = await axios.post(`${process.env.REACT_APP_UPDATE_URL}`, body);
        setGameOver(response.data.gameOver); 
        return response.data;
    }


    async function fetchMinmax(board, currPlayer) {
        
        const body = {"board": board, "currPlayer": currPlayer};
        const response = await axios.post(`${process.env.REACT_APP_MINMAX_URL}`, body);
        console.log("minmax resp: ", response.data);
        const column = response.data.action;
        const row = get_row(column)
        updateBoard(row, column, currPlayer)
        return response.data;
    }

    useEffect(() => {
        console.log("useeffect triggered");
        // fetchData();
    }, []);

    const updateBoard = (row, column, ch) => {
        setBoard(prev => {
            const boardCopy = [...prev];
            boardCopy[row][column] = ch;
            return boardCopy;
        })
    }

    const textify = (board) => {
        return board.map((r, i) => {
            r = r.map((ch, j) => {
                return ch === '' ? '.' : ch;
            });
            const new_row = r.join("");
            return new_row;
        }).join(",");
    }


    const handleClick = async (e) => {

        if (!canClick || gameOver) return;
        setCanClick(false);
        const column = e.target.getAttribute('x');

        try {
            var row = get_row(column)
            updateBoard(row, column, currPlayer)

            var boardCopy = board.slice();
            boardCopy[row][column] = currPlayer;    
            var board_text = textify(boardCopy.reverse())

            await postData(board_text, currPlayer, oppPlayer, gameOver);

            await fetchMinmax(board_text, oppPlayer);

            var board_text = textify(board.slice().reverse())

            await postData(board_text, oppPlayer, currPlayer, gameOver);


        } catch (e) {console.log(e)};
        setCanClick(true);
    };

    return (
        <>
            {gameOver && (
                <h1>Game over!</h1>
            )}

            <div 
                id='board'
                onClick={gameOver && canClick ? null : handleClick}
            >
                {board.map((row, i) => {
                    return row.map((ch, j) => {
                        return <Slot ch={ch} y={i} x={j} />
                    })
                })}
            </div>
        </>
    )
};

export default Board;