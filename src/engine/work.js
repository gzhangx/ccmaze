import core from './core';

export function doWork(game) {
    const { mousePos } = game.inputInfo;
    const clicked = mousePos.clicked;
    if (clicked) {
        mousePos.clicked = false;
        const solider = { x: mousePos.blkx, y: mousePos.blky, moveTo:[], speed:1, curMoveTime:0 };
        game.addSolider(solider);
        const res = core.findPath({
            x: 3, y: 4,
            checkCur: (opt, c) => {
                if (opt.processCount > 1000) return 2;
                return 0;
            }
        });
        const mouseObj = core.getMapAt(solider.x, solider.y);
        console.log('mouse');
        console.log(mouseObj)
        if (mouseObj) {
            let cur = mouseObj;            
            while (cur) {
                console.log(`in mouse ${cur.x},${cur.y}`);                
                cur = res.cameFrom[cur.id];
                if (cur) solider.moveTo.push(cur);
            }
        }
    }


    game.data.soliders.forEach(s => {
        const mto = s.moveTo[0];
        if (mto) {
            const dx = mto.x - s.x;
            const dy = mto.y - s.y;
            s.curMoveTime++;
            const xtime = Math.abs(dx * 1.0 / s.speed);
            const ytime = Math.abs(dy * 1.0 / s.speed);
            if (s.curMoveTime > xtime && s.curMoveTime > ytime) {
                s.curMoveTime -= xtime + ytime;
            }
            const toaddr = s.moveTo.shift();
            s.x = toaddr.x;
            s.y = toaddr.y;
        }
    });


}