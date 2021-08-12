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
    const { x, y, speed = 0} = prm;    //owner, objType, life
    const anchorCell = core.getMapAt({ x, y });
    if (!anchorCell) return;
    const obj = {
        id: getNextItemId(), anchorCell,
        moveInfo: { display: { x, y }, moveD: { x: 0, y: 0 }, target:null, inMove: false, curTime: 0, endTime: 0, moveTo: [], leftOverTime: 0 },
        ...prm
    };
    obj.calculateMoveInfo = () => {
        const moveInfo = obj.moveInfo;
        const curTime = new Date().getTime();
        const dspXy = moveInfo.display;
        const target = moveInfo.target;
        const moveD = moveInfo.moveD;
        if (!target) {
            const toPos = moveInfo.moveTo.pop();
            if (!toPos) return;
            moveD.x = (toPos.x - dspXy.x) * speed;
            moveD.y = (toPos.y - dspXy.y) * speed;
            const maxMove = moveD[Math.abs(moveD.x) > Math.abs(moveD.y) ? 'x' : 'y'];
            if (maxMove === 0) {
                moveInfo.target = null;
            } else {
                moveInfo.target = toPos;
                moveInfo.curTime = curTime - moveInfo.leftOverTime;
                moveInfo.leftOverTime = 0;
                moveInfo.endTime = moveInfo.curTime + (1000.0 / Math.abs(maxMove));
            }
        } else {
            if (curTime >= moveInfo.endTime) {
                dspXy.x = target.x;
                dspXy.y = target.y;
                obj.x = target.x;
                obj.y = target.y;
                moveInfo.target = null;
                moveInfo.curTime = 0;                
                moveInfo.leftOverTime = curTime - moveInfo.endTime;
                moveInfo.endTime = 0;
                obj.calculateMoveInfo();
            } else {
                const tdiff = (curTime - moveInfo.curTime) / 1000.0;
                dspXy.x = obj.x + tdiff * moveD.x;
                dspXy.y = obj.y + tdiff * moveD.y;
            }
        }    
    };
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