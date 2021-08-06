import {doWork } from './work';
const RUNINT = 100;
let started = false;

const data = {
    mapObjects: [],
};

const core = {
    data,
    inputInfo: {
        mousePos: { x: 0, y: 0 },
        mouseClickType: null,
    },
    addMapObject: s => {
        data.mapObjects.push(s);
    },
    doWork,
    start: () => {
        if (started) return;
        started = true;
        run();
    },    
};

function run() {
    setTimeout(run, RUNINT);
    core.doWork(core);
}

export default core;