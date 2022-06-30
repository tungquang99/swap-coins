import React, { useEffect, useRef, useState } from 'react';
import './index.scss';
import YourGear from './YourGear';
import YourGearBox from './YourGearBox';
import YourVicGem from './YourVicGem';

const TabComponent = () => {
    const [tab, setTab] = useState(1);
    const list = ['Your GEAR', 'Your GEARBOX', 'Your VICGEM'];
    const refs = useRef([]);
    const lineRef = useRef([]);
    useEffect(() => {
        // refs.current[tab].offsetWidth 
        // lineRef.current.style.top = '100%'
    }, [])
    
    const handleSelectTab = (index) => {
        setTab(index)
        console.log(refs.current[index].offsetWidth);
    }

    return (
        <div className='container-body tab'>
            <div className="tab-list">
                <div className='line' ref={lineRef}></div>
                {list.map((item, i) => (
                    <div key={i} ref={el => refs.current[i] = el} className={`tab-item ${tab === i ? 'active' : ''}`} onClick={() => handleSelectTab(i)}>{item}</div>
                ))}
            </div>

            { tab === 0 && <YourGear /> }
            { tab === 1 && <YourGearBox />}
            { tab === 2 && <YourVicGem />}
        </div>
    );
};

export default TabComponent;