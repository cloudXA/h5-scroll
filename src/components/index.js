import React, { useState, useEffect, useCallback, memo } from 'react';

const Live = ({ live, handleClick }) => {
    const [sub, setSub] = useState(1);
    const subClick = useCallback(
        (e) => {
            console.log(e.nativeEvent, 'event nativeEvent')
            console.log(e, 'event')
            setSub((sub) => sub + 1); // 连续点击实时更新
            // setSub(sub + 1);       // 连续点击不会不会实时更新

        },
        [],
    )
    useEffect(() => {
        console.log('live update')
    })
    return (
        <div>
            <button onClick={(e) => handleClick(e, 'hi')}> live click me</button>
            {live}
            <button onClick={subClick}>sub click me</button>
            {sub}

        </div>
    )
}

export default memo(Live);