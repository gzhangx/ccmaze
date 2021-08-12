import core from '../engine/core';
import game from '../engine/game';

export default function tanker({ x, y, owner, life = 100 }) {
    //const obj = { id: game.getNextItemId(), x, y, owner, objType: 'tanker', life};
    //const cell = core.getMapAt({ x, y });
    //if (!cell) return;
    //if (!cell.mapObjs) cell.mapObjs = [];
    //cell.mapObjs.push(obj);
    //game.addMapObject(obj);    
    const obj = game.createMapObj({x,y,owner, life, objType: 'tanker'})
    obj.processingObj = () => {
        if (obj.life <= 0) {
            obj.isDead = true;
            game.removeMapObject(obj);
            obj.cell.mapObjs = obj.cell.mapObjs.filter(x => x !== obj);
        }
    };
    return obj;
}