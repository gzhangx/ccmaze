import { remove } from 'lodash';
import { doWork } from './work';
const RUNINT = 100;
let started = false;

const data = {
    mapObjects: [],
};

let curItemId = 0;
const core = {
    data,
    curItemId,
    getNextItemId: ()=>++curItemId,
    inputInfo: {
        mousePos: { x: 0, y: 0 },
        mouseClickType: null,
    },
    addMapObject: s => {
        data.mapObjects.push(s);
    },
    removeMapObject: s => {
        remove(data.mapObjects, { id: s.id });
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