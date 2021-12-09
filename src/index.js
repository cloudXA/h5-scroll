import { hot } from 'react-hot-loader/root';
import React, { useEffect, useCallback, useState } from 'react';
import Live from './components/index';
import Scroll from './components/scroll/index';

/**
 * hook、 闭包 、状态 、性能 、 通信、 更新
 * use 为hook
 * 闭包： 每次渲染函数组件，为独立闭包，存在状态有props/ state/ 事件处理函数
 * 状态： useState 作为替代class setState状态的方式
 * 性能： useCallback useMemo: 父组件更新，子组件根据是否依赖父组件state进行更新
 * 通信：传递子组件值，value值，function函数
 * 更新：setState(current => current + 1)
 * @returns 
 */
const App = () => {
    const [live, setLive] = useState(3001);
    const [immutate, setImmutate] = useState(0);
    const add = (a, b) => {
        console.log(a + b)
    }
    const handleClick = useCallback(
        (event, rest) => {
            console.log(event.nativeEvent, 'from child live');
            console.log(rest, 'rest')
            setLive((current) => current + 1)
            // setImmutate((current) => current + 1);
        },
        [],
    )
    

    useEffect(() => {
        add(1, 4);
    })

    return (
        <div>
            {/* <Live handleClick={handleClick} live={live}></Live> */}
            <Scroll></Scroll>
        </div>
    )
}

export default App;