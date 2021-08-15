import core from '../engine/core';
import game from '../engine/game';

const TANKERSIZE = 15;
export default function tanker({ x, y, w = TANKERSIZE, h = TANKERSIZE, owner, life = 100, facingInfo = {
    curAngle: 0,
    angleVel: 0.01,
    lastReportTime: new Date().getTime(),
} }) {
    //const obj = { id: game.getNextItemId(), x, y, owner, objType: 'tanker', life};
    //const cell = core.getMapAt({ x, y });
    //if (!cell) return;
    //if (!cell.mapObjs) cell.mapObjs = [];
    //cell.mapObjs.push(obj);
    //game.addMapObject(obj);    
    const obj = game.createMapObj({x,y, w, h, owner, life, objType: 'tanker', facingInfo})
    obj.processingObj = () => {
        if (obj.life <= 0) {
            obj.isDead = true;
            game.removeMapObject(obj);
            //obj.anchorCell.mapObjs = obj.anchorCell.mapObjs.filter(x => x !== obj);
        } else if (!obj.target || obj.target.isDead){
            const found = game.searchNearByTargets(obj, 15, itm => {
                if (itm.objType === 'mover') {
                    return itm;
                }
            });
            obj.target = found;            
        }
        if (obj.target) {
            const ang = Math.atan2(obj.target.y - obj.y, obj.target.x - obj.x);
            obj.facingInfo.curAngle = ang;
        }
    };
    return obj;
}