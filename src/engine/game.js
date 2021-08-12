import { remove } from 'lodash';
import { doWork } from './work';
import core from './core';
const RUNINT = 100;
let started = false;

const data = {
    mapObjects: [],
    mapObjectKeys: {},
};

const getNextItemId = () => ++curItemId;
const addMapObject = s => {
    if (!data.mapObjectKeys[s.id]) {
        data.mapObjects.push(s);
    }
}

function createMapObj(prm) {
    const { x, y, } = prm;    //owner, objType, life
    const cell = core.getMapAt({ x, y });
    if (!cell) return;
    const obj = { id: getNextItemId(), cell, ...prm };
    if (!cell.mapObjs) cell.mapObjs = [];
    cell.mapObjs.push(obj);
    addMapObject(obj);
    return obj;
}
let curItemId = 0;
const gameCore = {
    data,
    curItemId,
    getNextItemId,
    inputInfo: {
        mousePos: { x: 0, y: 0 },
        mouseClickType: null,
    },
    addMapObject,
    removeMapObject: s => {
        remove(data.mapObjects, { id: s.id });
    },
    createMapObj,
    doWork,    
    start: () => {
        if (started) return;
        started = true;
        run();
    },    
};

function run() {
    setTimeout(run, RUNINT);
    gameCore.doWork(gameCore);
}

export default gameCore;