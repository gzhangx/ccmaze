import core from '../engine/core';

const REFRESH = 50;
export const BLKSIZE = 10;
const BLKSH = BLKSIZE / 2;
let test = 1;

export const uiInfo = {
    mousePos: { x: 0, y: 0 },
    searchOpt: null, //debug opt
}

let showDelay = 0;
let lastTimeSpent = 0;
function runLoop(thisRender) {
    const { context: c, canvas } = thisRender;
    c.clearRect(0, 0, canvas.width, canvas.height);
    const debugF = core.origMap;
    c.strokeStyle = '#ff0000';
    c.lineWidth = 2;
    const CPAD = 2;
    const drect = (ml, opt={}) => {
        const x = ml.x * BLKSIZE;
        const y = ml.y * BLKSIZE;
        const { actualSize, fillStyle, text } = opt;
        c.fillStyle = fillStyle || "#000000" ;
        if (!actualSize) {            
            c.fillRect(x - BLKSH, y - BLKSH, BLKSIZE, BLKSIZE);
            c.beginPath();
            c.moveTo(x - BLKSH + CPAD, y - BLKSH + CPAD);
            c.lineTo(x + BLKSH - CPAD, y + BLKSH - CPAD);
            c.stroke();
        } else {            
            const hf = actualSize / 2;
            c.fillRect(x - hf, y - hf, actualSize, actualSize);            
        }
        if (text) {
            c.fillText(text, x, y);
        }
    }

    const start = new Date();
    //if (test === 1)
        //console.log(debugF.map)
    //core.cleanMap();
    //core.getRoute(core.getMapAt(2, 4));
    let showDebugStats = false;
    if (uiInfo.debugStart) {
        uiInfo.debugStart = false;
        showDebugStats = true;
        core.cleanMap();
        uiInfo.searchOpt = core.findPath({
            x: 3, y: 4,
            checkCur: (opt, c) => {
                if (opt.processCount > 1000) return 2;
                return 0;
            }
        });
    }
    if (uiInfo.searchOpt) {
        uiInfo.searchOpt.processCount = 0;
        core.processRoute(uiInfo.searchOpt);

        const { gScore } = uiInfo.searchOpt;
        debugF.map.forEach(ml => {
            ml.forEach(c => {
                //console.log(`rect at ${ml.x} ${ml.y}`);
                //console.log(ml)            
                if (c.cellType !== ' ')
                    drect(c);
                else {
                    const score = gScore[c.id] || core.MAXWEIGHT;
                    if (score < 99999) {
                        c.strokeStyle = '#ffFF00';
                        c.lineWidth = 2;
                        drect(c, { actualSize: 4, fillStyle: '#330033', text: score.toString() });
                    }
                    c.strokeStyle = '#ff0000';
                    c.lineWidth = 2;
                }
            });
        });
    }

    
    


    
    const mouseObjX = parseInt(uiInfo.mousePos.x / BLKSIZE);
    const mouseObjY = parseInt(uiInfo.mousePos.y / BLKSIZE);
    const mouseObj = core.getMapAt(mouseObjX, mouseObjY);
    if (mouseObj && uiInfo.searchOpt) {
        let cur = mouseObj;        
        while (cur) {
            //console.log(`${cur.x},${cur.y} ${cur.shortestSpLinkDist}`);
            drect(cur, { actualSize: 4, fillStyle: '#cccccc', text:(uiInfo.searchOpt.gScore[cur.id]||'NA').toString() });
            cur = uiInfo.searchOpt.cameFrom[cur.id];
        }
    }
    drect({ x: 2, y: 4 });

    drect({ x: 2, y: 4 });
    test++;
    
    const timeSpent = new Date() - start;
    if (timeSpent > 100)
        console.log(`rendering time ${timeSpent}`);
    if (mouseObj) {
        uiInfo.setGameState(v => ({
            ...v,
            debugText: `${mouseObj.x},${mouseObj.y}`
        }))
    }
    if (showDebugStats || showDelay) {
        if (!showDelay) showDelay = 100;
        showDelay--;
        if (showDebugStats) lastTimeSpent = timeSpent;
        uiInfo.setGameState(v=>({
            ...v,
            debugText: `rendering time ${lastTimeSpent}`
        }))
    }
}


const thisRender = {
    started: false,
    runLoop,
};

function run() {
    //setTimeout(run, REFRESH);
    thisRender.runLoop(thisRender);
    window.requestAnimationFrame(run);
}
export const createRender = (canvas)=> {
    const context = canvas.getContext('2d');
    thisRender.context = context;
    thisRender.canvas = canvas;

    thisRender.start = () => {
        if (!thisRender.started) {
            console.log('starting ui thread')
            thisRender.started = true;
            run();
        }
    }
    thisRender.start();
    return thisRender;
}
