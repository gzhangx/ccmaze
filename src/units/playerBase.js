import core from '../engine/core';
import game from '../engine/game';

export default function playerBase({ x, y, owner, life = 100 }) {
    const obj = { id: game.getNextItemId(), x, y, owner, objType: 'playerBase', life };
    const cell = core.getMapAt({ x, y });
    if (!cell) return;
    if (!cell.mapObjs) cell.mapObjs = [];
    cell.mapObjs.push(obj);
    game.addMapObject(obj);
    obj.processingObj = () => {
        if (obj.life <= 0) {
            obj.isDead = true;
            game.removeMapObject(obj);
            cell.mapObjs = cell.mapObjs.filter(x => x !== obj);
        }
    };
    return obj;
}