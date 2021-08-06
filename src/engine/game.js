import {doWork } from './work';
const RUNINT = 100;
let started = false;

const data = {
    soliders: [],
};

const core = {
    data,
    inputInfo: {
        mousePos: { x: 0, y: 0 },
        mouseClickType: null,
    },
    addSolider: s => {
        data.soliders.push(s);
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