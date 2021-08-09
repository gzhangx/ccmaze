//bresenhams search

export function fullCircle(xc, yc, r, doPos) {
    doCircle(xc, yc, r, doPos, (xc, yc, x, y) => {
        const ycy = yc + y;
        const xc_x = xc - x;
        const xcx = xc + x;
        const yc_y = yc - y;
        for (let i = xc_x; i <= xcx; i++) {
            if (doPos(i, ycy)) return true;
            if (doPos(i, yc_y)) return true;
        }
        
        const ycx = yc + x;
        const xc_y = xc - y;
        const xcy = xc + y;
        const yc_x = yc - x;
        for (let i = xc_y; i <= xcy; i++) {
            if (doPos(i, ycx)) return true;
            if (doPos(i, yc_x)) return true;
        }
    });
}

export function doCircle(xc, yc, r, doPos, doPts)
{
    const cirPts = doPts || doCirclePoints;
    let x = 0, y = r;
    let d = Math.round(3 - (2 * r));
    if (cirPts(xc, yc, x, y, doPos)) return true;
    while (y >= x) {                
        if (d > 0) {            
            d = d + (4 * (x - y)) + 10;
            y--;
        }
        else
            d = d + (4 * x) + 6;
        x++;
        if (cirPts(xc, yc, x, y, doPos)) return true;
    }
}

function doCirclePoints(xc, yc, x, y, doPos)
{
    const xcx = xc + x;
    const ycy = yc + y;
    if (doPos(xcx, ycy)) return true;
    const xc_x = xc - x;
    if (doPos(xc_x, ycy)) return true;
    const yc_y = yc - y;
    if (doPos(xcx, yc_y)) return true;
    if (doPos(xc_x, yc_y)) return true;
    const xcy = xc + y;
    const ycx = yc + x;
    if (doPos(xcy, ycx)) return true;
    const xc_y = xc - y;
    if (doPos(xc_y, ycx)) return true;
    const yc_x = yc - x;
    if (doPos(xcy, yc_x)) return true;
    if (doPos(xc_y, yc_x)) return true;    
}