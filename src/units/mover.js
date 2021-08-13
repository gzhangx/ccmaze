import core from '../engine/core';
import game from '../engine/game';
import { last } from 'lodash';

export default function mover({ x, y, owner }) {
    //const obj = { id: game.getNextItemId(), x, y, moveTo: [], speed: 1, curMoveTime: 0, hasPath: false, };
    //game.addMapObject(obj);
    const obj = game.createMapObj({ x, y, objType: 'mover', owner, speed: 2})
    obj.processingObj = () => {
        if (!obj.target || obj.target.isDead) {
            obj.target = null;
            game.setObjMapTarget(obj, c => {
                const tnk = c.mapObjs.filter(o => o.objType === 'tanker');
                if (tnk.length) return tnk[0];                    
            });            
        }

        obj.calculateMoveInfo();
        const mto = null; //last(obj.moveTo);
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
                    //obj.x = toaddr.x;
                    //obj.y = toaddr.y;
                    game.moveMapObject(obj, toaddr);
                }
            }            
        }
        
        if (obj.target && obj.moveInfo.moveTo.length === 0) {
            game.removeMapObject(obj);
            if (obj.target) {
                obj.target.life -= 10;
            }
        }
    };
    return obj;
}