import core from '../engine/core';
import game from '../engine/game';
import { last } from 'lodash';

export default function mover({ x, y, owner, life=10 }) {
    //const obj = { id: game.getNextItemId(), x, y, moveTo: [], speed: 1, curMoveTime: 0, hasPath: false, };
    //game.addMapObject(obj);
    const obj = game.createMapObj({ x, y, objType: 'mover', owner, speed: 2, life})
    obj.processingObj = () => {
        if (!obj.target || obj.target.isDead) {
            obj.target = null;
            game.setObjMapTarget(obj, c => {
                if (c.objType === 'tanker') {
                    return c;
                }
            });            
        }

        obj.calculateMoveInfo();
        
        if (obj.target && obj.moveInfo.moveTo.length === 0) {
            obj.isDead = true;
            game.removeMapObject(obj);
            if (obj.target) {
                obj.target.life -= 10;
            }
        }
        if (obj.life <= 0) {
            obj.isDead = true;
            game.removeMapObject(obj);
        }
    };
    return obj;
}