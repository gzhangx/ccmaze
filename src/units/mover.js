import core from '../engine/core';
import game from '../engine/game';
import { last } from 'lodash';

export default function mover({ x, y, name }) {
    const obj = { id: game.getNextItemId(), x, y, moveTo: [], speed: 1, curMoveTime: 0, name, hasPath: false, };
    game.addMapObject(obj);
    obj.processingObj = () => {
        if (!obj.hasPath) {
            let found = null;
            const res = core.findPath({
                x, y,
                checkCur: (opt, c) => {
                    if (opt.mapObjs) {
                        const tnk = opt.mapObjs.filter(o => o.objType === 'tanker');
                        if (tnk.length) {
                            found = opt;
                            obj.target = tnk[0];
                            return 1;
                        }
                    }
                    return 0;
                }
            });
            if (found) {
                obj.moveTo = res.getWaypointsFromPath(found);
                obj.hasPath = true;
            }
        }

        const mto = last(obj.moveTo);
        if (mto) {
            const speed = obj.speed;
            const dx = mto.x - obj.x;
            const dy = mto.y - obj.y;
            obj.curMoveTime++;
            const xtime = Math.abs(dx * 1.0 / speed);
            const ytime = Math.abs(dy * 1.0 / speed);
            if (obj.curMoveTime > xtime && obj.curMoveTime > ytime) {
                obj.curMoveTime -= xtime + ytime;
                obj.moveTo.pop();
                const toaddr = last(obj.moveTo);
                if (toaddr) {
                    obj.x = toaddr.x;
                    obj.y = toaddr.y;
                }
            }            
        } else {
            game.removeMapObject(obj);
            if (obj.target) {
                obj.target.life -= 10;
            }
        }
    };
    return obj;
}