import core from '../engine/core';
import game from '../engine/game';

import { doMst } from '../engine/mst';

const REFRESH = 50;
export const BLKSIZE = 10;
const BLKSH = BLKSIZE / 2;
let test = 1;

export const uiInfo = {
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
            //c.fillText(text, x, y);
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
        uiInfo.searchOpt = core.findPath({
            x: 3, y: 4,
            checkCur: (opt, c) => {
                if (opt.processCount > 1000) return 2;
                return 0;
            }
        });
        //uiInfo.debugMst = doMst(20, 20, { x: 1, y: 1 });        
    }
    if (uiInfo.searchOpt) {
        uiInfo.searchOpt.processCount = 0;
        core.processRoute(uiInfo.searchOpt);        
    }

    const { gScore } = uiInfo.searchOpt || { gScore: {}};
    debugF.map.forEach(ml => {
        ml.forEach(c => {
            //console.log(`rect at ${ml.x} ${ml.y}`);
            //console.log(ml)            
            if (c.cellType !== ' ')
                drect(c);
            else {
                const score = gScore[c.id] || core.MAXWEIGHT;
                if (score < 99999) {                    
                    //drect(c, { actualSize: 4, fillStyle: '#330033', text: score.toString() });
                }                
            }
        });
    });
    
    const timeSpent = new Date() - start;
    if (timeSpent > 100)
        console.log(`rendering time ${timeSpent}`);
    
    const mouseObjX = parseInt(game.inputInfo.mousePos.x / BLKSIZE);
    const mouseObjY = parseInt(game.inputInfo.mousePos.y / BLKSIZE);
    const mouseObj = core.getMapAt(mouseObjX, mouseObjY);
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
 
    /*
    if (core.debugEdges) {
        c.strokeStyle = '#ff0000';
        c.lineWidth = 4;
        const MSGBLKSIZE = 20;
        const pad = 0;
        core.debugEdges.edges.forEach(edge=>{
            c.beginPath();
            const { x, y } = edge.u;
            const { x: tx, y: ty } = edge.v;

            c.moveTo(x * MSGBLKSIZE +pad, y * MSGBLKSIZE +pad );
            c.lineTo(tx * MSGBLKSIZE +pad, ty * MSGBLKSIZE +pad);
            c.stroke();
        })
    }
    */
    if (mouseObj && uiInfo.searchOpt) {
        let cur = mouseObj;
        while (cur) {
            //console.log(`${cur.x},${cur.y} ${cur.shortestSpLinkDist}`);
            drect(cur, { actualSize: 4, fillStyle: '#cccccc', text: (uiInfo.searchOpt.gScore[cur.id] || 'NA').toString() });
            cur = uiInfo.searchOpt.cameFrom[cur.id];
        }
    }

    game.data.soliders.forEach(s => {
        drect(s, { actualSize: 4, fillStyle: '#ff00ff', text: 's' });
    })
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
