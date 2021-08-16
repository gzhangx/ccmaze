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
    const obj = game.createMapObj({
        x, y, w, h, owner, life, objType: 'tanker', facingInfo,
        firingInfo: {
            lastFireTime: null,
            loadTime: 1500,
        }
    })
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
            const curTime = new Date().getTime();
            if (!obj.firingInfo.lastFireTime) {
                obj.firingInfo.lastFireTime = curTime;
            } else {
                const laps = curTime - obj.firingInfo.lastFireTime;
                if (laps >= obj.firingInfo.loadTime) {
                    obj.target.life -= 10;
                    obj.firingInfo.lastFireTime = curTime;
                    const dx = obj.target.x - obj.x;
                    const dy = obj.target.y - obj.y;
                    let dd = dx;
                    if (Math.abs(dy) > Math.abs(dx)) {
                        dd = dy;
                    }
                    if (dd !== 0) {
                        game.data.renderObjs.push({
                            renderType: 'bullet',
                            from: { x: obj.x, y: obj.y },
                            to: { x: obj.target.x, y: obj.target.y },
                            cur: 0,
                            maxSteps: dd,
                            dx: dx/dd,
                            dy: dy/dd,
                        });
                    }
                }
            }
        }
    };
    return obj;
}