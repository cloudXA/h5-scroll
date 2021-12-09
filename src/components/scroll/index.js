import React, { useState, useRef, useEffect } from "react";
import BScroll from '@better-scroll/core';
import PullUp from '@better-scroll/pull-up';
import PullDown from '@better-scroll/pull-down'
import './index.css';

BScroll.use(PullUp);;;
BScroll.use(PullDown);

const generateData = () => {
    const BASE = 40
    const begin = BASE * STEP
    const end = BASE * (STEP + 1)
    let ret = []
    for (let i = end; i > begin; i--) {
        ret.push(i)
    }
    return ret
}
// pulldownRefresh state
const PHASE = {
    moving: {
        enter: 'enter',
        leave: 'leave'
    },
    fetching: 'fetching',
    succeed: 'succeed'
}
const TIME_BOUNCE = 800
const REQUEST_TIME = 2000
const THRESHOLD = 70
const STOP = 56
let STEP = 0
const ARROW_BOTTOM = '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M367.997 338.75l-95.998 95.997V17.503h-32v417.242l-95.996-95.995l-22.627 22.627L256 496l134.624-134.623l-22.627-22.627z"></path></svg>'
const ARROW_UP = '<svg width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M390.624 150.625L256 16L121.376 150.625l22.628 22.627l95.997-95.998v417.982h32V77.257l95.995 95.995l22.628-22.627z"></path></svg>'
let bscroll = null;

const Scroll = () => {
    const [tipText, setTipStateText] = useState(null);
    const [dataList, setDataList] = useState([]);
    const [isPullUpLoad, setIsPullUpLoad] = useState(false);
    const [times, setTimes] = useState(1)
    const bsWrapper = useRef(null);

    const initBscroll = () => {
        bscroll = new BScroll(bsWrapper.current, {
            scrollY: true,
            bounceTime: TIME_BOUNCE,
            useTransition: false,
            pullDownRefresh: {
                threshold: THRESHOLD,
                stop: STOP
            },
            pullUpLoad: {
                threshold: 0
            }
        })
    }

    const setTipText = (phase = PHASE.default) => {
        const TEXTS_MAP = {
            'enter': `${ARROW_BOTTOM} Pull down`,
            'leave': `${ARROW_UP} Release`,
            'fetching': 'Loading...',
            'succeed': 'Refresh succeed'
        }

        setTipStateText(TEXTS_MAP[phase]);
    }

    const mockFetchData = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                const dataList = generateData()
                resolve(dataList)
            }, REQUEST_TIME)
        })
    }


    const getData = async () => {
        mockFetchData().then(data => {
            setDataList(data);
            
        })

    }

    const pullingDownHandler = async () => {
        setTipText(PHASE.fetching)
        STEP += 1
        await getData()

        setTipText(PHASE.succeed)
        // tell BetterScroll to finish pull down
        bscroll.finishPullDown()
        // waiting for BetterScroll's bounceAnimation then refresh size
        setTimeout(() => {
            bscroll.refresh()
        }, TIME_BOUNCE + 50)
    }

    const pullingUpHandler = async () => {
        setDataList((current) => current)
        console.log('up here')
        setIsPullUpLoad(true);
        bscroll.finishPullUp()
        bscroll.refresh()
        setIsPullUpLoad(false);
    }


    useEffect(async () => {
        await getData();
        console.log(dataList, 'dataList effect')

        initBscroll();

        // 下拉
        bscroll.on('pullingDown', pullingDownHandler)
        // 上卷
        bscroll.on('pullingUp', pullingUpHandler)

        bscroll.on('scrollEnd', e => {
            console.log('scrollEnd')
        })
        // v2.4.0 supported
        bscroll.on('enterThreshold', () => {
            setTipText(PHASE.moving.enter)
        })
        bscroll.on('leaveThreshold', () => {
            setTipText(PHASE.moving.leave)
        })

    }, []);


    return (
        <div>
            <div className="pulldown-sina">
                <div
                    className="pulldown-bswrapper"
                    ref={bsWrapper}
                    >
                        
                    <div className="pulldown-scroller">
                        <div className="pulldown-wrapper">
                        <div>
                            {tipText}
                        </div>
                        
                        </div>
                        <ul className="pulldown-list">
                            {
                                dataList?.map((item, i) => {
                                    return (
                                        <li
                                            key={i}
                                            className="pulldown-list-item"
                                        >
                                            { `I am item ${i} ` }
                                        </li>
                                    )
                                })
                            }
                        
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Scroll;