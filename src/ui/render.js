import core from '../engine/core';
import game from '../engine/game';

import { doMst } from '../engine/mst';
import { doCircle, fullCircle } from '../engine/utils';

const REFRESH = 50;
export const BLKSIZE = 10;
const BLKSH = BLKSIZE / 2;
let test = 1;
let lastDebugMsgTime = new Date();
let lastDebugMsgToggle = false;
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
            //c.fillRect(x - BLKSH, y - BLKSH, BLKSIZE, BLKSIZE);
            c.fillRect(x , y , BLKSIZE, BLKSIZE);
            c.beginPath();
            c.moveTo(x + CPAD, y + CPAD);
            c.lineTo(x + BLKSIZE - CPAD, y + BLKSIZE - CPAD);
            //c.moveTo(x - BLKSH + CPAD, y - BLKSH + CPAD);
            //c.lineTo(x + BLKSH - CPAD, y + BLKSH - CPAD);
            c.stroke();
        } else {
            const sz2 = actualSize / 2;
            if (ml.objType === 'tanker') {
                const cx = x + BLKSH;
                const cy = y + BLKSH;
                c.strokeStyle = "#FFFFFF";
                c.save();
                
                if (ml.facingInfo) {
                    c.translate(cx, cy);
                    c.rotate(ml.facingInfo.curAngle);
                }
                c.fillRect(- sz2, - sz2, actualSize, actualSize);
                c.beginPath();                
                c.moveTo(0,0);
                c.lineTo(sz2, 0);
                c.stroke();                
                c.restore();
            } else {
                const hf = actualSize / 2 - BLKSH;
                c.fillRect(x - hf, y - hf, actualSize, actualSize);
            }
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
            x: 2, y: 2,
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
        
    const mouseObj = core.getMapAt(game.inputInfo.mousePos);
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
        const dops = uiInfo.searchOpt.getWaypointsFromPath(mouseObj);
        dops.forEach(cur => drect(cur, { actualSize: 4, fillStyle: '#cccccc', text: (uiInfo.searchOpt.gScore[cur.id] || 'NA').toString() }));        
    }
    
    game.data.mapObjects.forEach(s => {
        //if (lastDebugMsgToggle)
        //    console.log(`process obj ${s.x} ${s.y} ${s.name}`)
        if (s.objType === 'tanker') {
            drect(s, { actualSize: 15, fillStyle: '#ff00ff', text: 's' });
            if (s.target) {
                //c.beginPath();
                //c.moveTo(s.x * BLKSIZE, s.y * BLKSIZE);
                //c.lineTo(s.target.x * BLKSIZE, s.target.y * BLKSIZE);
                //c.stroke();
            }
        } else {
            let d = s;
            if (s.moveInfo && s.moveInfo.display) {
                d = s.moveInfo.display;
            }
            drect(d, { actualSize: 4, fillStyle: '#ff00ff', text: 's' });
        }
    });

    lastDebugMsgToggle = false;
    if (new Date().getTime() - lastDebugMsgTime.getTime() > 1000) {
        lastDebugMsgTime = new Date();
        lastDebugMsgToggle = true;
    }


    if (mouseObj) {
        core.cirSearch(mouseObj.x, mouseObj.y, 1, (x, y) => {
            //drect({ x, y }, { actualSize: 10, fillStyle: '#ffffff' });
        })
    }

    game.data.renderObjs.forEach(blt => {
        if (blt.cur < blt.maxSteps) {
            blt.cur++;
            const x = blt.from.x + (blt.dx * blt.cur);
            const y = blt.from.y + (blt.dy * blt.cur);
            drect({x,y}, { actualSize: 2, fillStyle: '#ffbbff'});
       }
    });
    game.data.renderObjs = game.data.renderObjs.filter(x => x.cur < x.maxSteps);
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
