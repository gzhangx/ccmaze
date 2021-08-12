import core from '../engine/core';
import game from '../engine/game';

export default function playerBase({ x, y, owner, life = 100 }) {
    const obj = game.createMapObj({ x, y, owner, objType: 'playerBase', life});    
    obj.processingObj = () => {
        if (obj.life <= 0) {
            obj.isDead = true;
            game.removeMapObject(obj);            
        }
    };
    return obj;
}