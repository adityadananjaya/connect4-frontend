import React from 'react';
import redToken from '../assets/red_token.svg';
import yellowToken from '../assets/yellow_token.svg';

const Slot = ({ch, y, x}) => {
    return (
        <div className="slot" x={x} y={y}>
            {ch && ch !== '.' && (
                <img src={ch === 'X' ? redToken : yellowToken} width='100%' height='100%' />
            )}
        </div>
    )
};

export default Slot;