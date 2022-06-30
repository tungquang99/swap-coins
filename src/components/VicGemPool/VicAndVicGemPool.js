import React, { createContext, useState } from 'react';
import ChartTransaction from './ChartTransaction';
import SwapVicGem from './SwapVicGem';

function VicAndVicGemPool() {
    const [isChart, setIsChart] = useState(false);
    return (
        <div className='container-body vic-gem'>
        <SwapVicGem isChart={isChart} setIsChart={setIsChart}/>
       { isChart && <ChartTransaction />} 
    </div>
    );
}

export default VicAndVicGemPool;