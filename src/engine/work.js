import core from './core';
import mover from '../units/mover';
import tanker from '../units/tanker';

export function doWork(game) {
    const { mousePos, mouseClickType, owner } = game.inputInfo;
    const clicked = mousePos.clicked;
    if (clicked) {
        mousePos.clicked = false;
        const handler = mouseClickTypeMap[mouseClickType];
        if (handler) handler({...mousePos, owner });
    }


    game.data.mapObjects.forEach(s => s.processingObj());


}

const mouseClickTypeMap = {
    'defTank': placeTank,
    'solider': placeSolider,
}

function placeSolider(mousePos) {
    //{x,y, owneer} = mousePos
    mover(mousePos)
}
function placeTank(mousePos) {
    tanker(mousePos);
}