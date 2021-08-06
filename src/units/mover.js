import core from '../engine/core';
import game from '../engine/game';

export default function mover({ x, y, name }) {
    const obj = { id: game.getNextItemId(), x, y, moveTo: [], speed: 1, curMoveTime: 0, name, hasPath: false, };
    game.addMapObject(obj);
    obj.processingObj = () => {
        if (!obj.hasPath) {
            const res = core.findPath({
                x: 3, y: 4,
                checkCur: (opt, c) => {
                    if (opt.processCount > 1000) return 2;
                    return 0;
                }
            });
            obj.moveTo = res.getWaypointsFromPath(obj);
            obj.hasPath = true;
        }

        const mto = obj.moveTo[0];
        if (mto) {
            const speed = obj.speed;
            const dx = mto.x - obj.x;
            const dy = mto.y - obj.y;
            obj.curMoveTime++;
            const xtime = Math.abs(dx * 1.0 / speed);
            const ytime = Math.abs(dy * 1.0 / speed);
            if (obj.curMoveTime > xtime && obj.curMoveTime > ytime) {
                obj.curMoveTime -= xtime + ytime;
                const toaddr = obj.moveTo.shift();
                obj.x = toaddr.x;
                obj.y = toaddr.y;                
            }            
        } else {
            game.removeMapObject(obj);
        }
    };
    return obj;
}