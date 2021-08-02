import  core from '../engine/core';
const REFRESH = 500;
const BLKSIZE = 10;
const BLKSH = BLKSIZE / 2;
let test = 1;
function runLoop(thisRender) {
    const { context: c, canvas } = thisRender;
    c.clearRect(0, 0, canvas.width, canvas.height);
    const debugF = core.origMap;
    c.strokeStyle = '#ff0000';
    c.lineWidth = 2;
    const CPAD = 2;
    const drect = (ml,fillStyle) => {
        const x = ml.x * BLKSIZE;
        const y = ml.y * BLKSIZE;
        c.fillStyle = fillStyle || "#000000";
        c.fillRect(x - BLKSH, y - BLKSH, BLKSIZE, BLKSIZE);
        c.beginPath();        
        c.moveTo(x - BLKSH + CPAD, y - BLKSH + CPAD);
        c.lineTo(x + BLKSH - CPAD, y + BLKSH - CPAD);
        c.stroke();
    }

    const start = new Date();
    //if (test === 1)
        //console.log(debugF.map)
    core.cleanMap();
    core.getRoute(core.getMapAt(2, 4));

    debugF.map.forEach(ml => {
        ml.forEach(c => {
            //console.log(`rect at ${ml.x} ${ml.y}`);
            //console.log(ml)            
            if (!c.isFreeSpace)
                drect(c);
            else {
                if (c.shortestSpLinkDist < 9999) {
                    c.strokeStyle = '#ffFF00';
                    c.lineWidth = 2;
                    //drect(c);
                }
                c.strokeStyle = '#ff0000';
                c.lineWidth = 2;
            }
        });        
    });

    
    const mouseObjX = parseInt(uiInfo.mousePos.x / BLKSIZE);
    const mouseObjY = parseInt(uiInfo.mousePos.y / BLKSIZE);
    const mouseObj = core.getMapAt(mouseObjX, mouseObjY);
    if (mouseObj) {        
        let cur = mouseObj;
        console.log(cur)
        while (cur.shortestSpLink) {
            //console.log(cur.shortestSpLink)
            drect(cur,'#aaaaaa');
            cur = cur.shortestSpLink;
        }
    }
    drect({ x: 2, y: 4 });

    drect({ x: 2, y: 4 });
    test++;
    const timeSpent = new Date() - start;
    console.log(`rendering time ${timeSpent}`);
}

export const uiInfo = {
    mousePos: {x:0, y:0}
}

const thisRender = {
    started: false,
    runLoop,
};

function run() {
    setTimeout(run, REFRESH);
    thisRender.runLoop(thisRender);
}
export const createRender = (canvas, mousePos)=> {
    const context = canvas.getContext('2d');
    thisRender.context = context;
    thisRender.canvas = canvas;
    thisRender.mousePos = mousePos;

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
