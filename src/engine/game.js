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
    const anchorCell = core.getMapAt({ x, y });
    if (!anchorCell) return;
    const obj = { id: getNextItemId(), anchorCell, ...prm };
    //if (!anchorCell.mapObjs) anchorCell.mapObjs = [];
    //anchorCell.mapObjs.push(obj);
    addObjToCell(anchorCell, obj);
    addMapObject(obj);
    return obj;
}

function addObjToCell(cell, obj) {
    if (!cell.mapObjs) cell.mapObjs = [];
    cell.mapObjs.push(obj);
}

function removeObjFromAnchorCell(obj) {
    const anchorCell = obj.anchorCell;
    if (anchorCell)
        anchorCell.mapObjs = anchorCell.mapObjs.filter(x => x !== obj);
}

function moveMapObject(obj, toPos) {
    const newCell = core.getMapAt(toPos);
    if (!newCell) {
        console.log(`bad mov3 loc ${toPos.x} ${toPos.y}`)
        return;
    }
    obj.x = toPos.x;
    obj.y = toPos.y;
    removeObjFromAnchorCell(obj);
    addObjToCell(newCell, obj);
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
    //addMapObject,
    removeMapObject: s => {
        remove(data.mapObjects, { id: s.id });
        removeObjFromAnchorCell(s);
    },
    createMapObj,
    moveMapObject,
    //doWork,    
    start: () => {
        if (started) return;
        started = true;
        run();
    },    
};

function run() {
    setTimeout(run, RUNINT);
    doWork(gameCore);
}

export default gameCore;