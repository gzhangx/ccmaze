import core from './core';
import mover from '../units/mover';
import tanker from '../units/tanker';

export function doWork(game) {
    const { mousePos, mouseClickType } = game.inputInfo;
    const clicked = mousePos.clicked;
    if (clicked) {
        mousePos.clicked = false;
        const handler = mouseClickTypeMap[mouseClickType];
        if (handler) handler(mousePos);
    }


    game.data.mapObjects.forEach(s => s.processingObj());


}

const mouseClickTypeMap = {
    'defTank': placeTank,
    'solider': placeSolider,
}

function placeSolider(mousePos) {
    mover({
        x: mousePos.x,
        y: mousePos.y,
        name: 'solider',
    })
}
function placeTank(mousePos) {
    tanker({
        x: mousePos.x,
        y: mousePos.y,
    });
}