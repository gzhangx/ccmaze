import { get, orderBy} from 'lodash';

const debugfile = `
 __________________________________________________________________
 |         ___________            |   __________________________   |
 |  Mouse |   _____   |  |  |  |  |  |   ____________________   |  |
 |________|  |     |_____|  |  |_____|  |   _________________   |  |
 |___________|  |___________|  |   _____|  |   ___________   |  |  |
 |   ___________|   ___________|  |  ______|  |   ________|  |_____|
 |  |   ___________|   ___________|___________|  |___________|     |
 |  |  |   __         |   _________________   |_____   |     |  |  |
 |  |  |  |  |  |  |  |  |   ______________|_____   |  |  |  |  |  |
 |  |  |  |  |  |  |_____|  |   _____   |   __   |  |  |  |  |  |  |
 |  |  |  |  |  |___________|  |     |  |  |  |  |  |  |  |  |  |  |
 |  |  |  |  |_________________|  |  |  |  |  |  |  |  |  |  |  |  |
 |  |  |  |  |   _________________|_____|  |  |  |  |  |  |  |  |  |
 |  |  |  |  |  |   __    ______________|  |  |  |  |   __|  |  |  |
 |  |  |  |  |  |  |  |  |   ________   |  |  |  |  |  |  |  |  |  |
 |  |  |  |  |  |  |  |  |  |   _____   |  |  |  |  |  | ____|  |  |
 |  |  |  |  |  |  |  |  |  |  |  ______|  |  |  |  |   ________|  |
 |  |  |_____|  |  |  |  |  |  |_____   |  |  |  |  |  |           |
 |  |_____   |  |__|  |  |  |________|  |  |  |  |__|  |  Cheese   |
 |___________|_______________________|________|________|___________|`;

function getPathWeight(c) {
    if (c === ' ') return 1;
    return 10000;
}
function parseFile(file) {    
    const parsed = file.split('\n').reduce((acc, l) => {
        const curl = l.split('');
        if (acc.w < curl.length) acc.w = curl.length;
        const y = acc.map.length;
        acc.h = y + 2;
        const res = curl.reduce((acc, cellType, x) => {
            if (cellType === '_') {
                acc.top.push({ y, x, cellType: ' ', pathWeight: getPathWeight(' ') });
                acc.btm.push({ y: y + 1, x, cellType, pathWeight: getPathWeight(cellType) });
            } else {
                acc.top.push({ y, x, cellType, pathWeight: getPathWeight(cellType)});
                acc.btm.push({ y: y + 1, x, cellType, pathWeight: getPathWeight(cellType)});
            }
            return acc;
        }, { top: [], btm: [] });
        acc.map.push(res.top);
        acc.map.push(res.btm);
        return acc;
    }, {
        map: [],
        w: 0,
        h: 0,
    });

    parsed.map = parsed.map.map((r,ii) => {
        if (r.length === parsed.w) return r;        
        const lastX = r[r.length - 1] || {x:0, y:ii};
        const diff = parsed.w - r.length;
        for (let i = 0; i < diff; i++) {
            r.push({
                x: lastX.x + i,
                y: lastX.y,
                cellType: ' ',
                pathWeight: getPathWeight(' '),
            });
        }
        return r;
    }).map(r => {
        return r.map(c => {
            if (!c.spLinks) c.spLinks = [];
            c.shortestSpLink = null;
            c.shortestSpLinkDist = MAXWEIGHT;            
            c.getPathWeight = () => c.pathWeight;
            if (c.x > 0) {
                const lft = r[c.x - 1];                
                c.spLinks.push(lft);                
            }
            if (c.y > 0) {
                const tpr = parsed.map[c.y - 1];
                const tp = tpr[c.x];
                c.spLinks.push(tp);                
            }
            const rt = r[c.x + 1];
            if (rt) {
                c.spLinks.push(rt);
            }
            const btr = parsed.map[c.y + 1];
            if (btr) {
                const bt = btr[c.x];
                c.spLinks.push(bt);
            }
            return c;
        });
    });
    return parsed;
}

function run() {
    setTimeout(run, 1000);
}

const MAXWEIGHT = 999999;
function cleanMap() {
    return {
        ...core.origMap,
        map: core.origMap.map.map(r => {
            return r.map(c => {
                c.shortestSpLink = null;
                c.shortestSpLinkDist = MAXWEIGHT;            
                return c;
            })
        })
    }
}

function initSearchStart(x, y) {
    const ret = {
        stock: [],
        processAmount: -1,
        curDbgItems: [],
    };
    ret.stock.push({
        c: core.getMapAt(x, y),
        from: null,
        fromCum: 0,
        level: 0,
    });
    return ret;
}
function getRoute(opt) {
    let pcAmount = opt.processAmount || 1;
        
    let withoutSort = opt.withoutSort || 100;
    while (opt.stock.length) {
        //console.log(stock[0].fromCum + " " + stock[stock.length - 1].fromCum)
        const { c, from, fromCum, level } = opt.stock.pop();        
        if (c.shortestSpLinkDist < fromCum) continue;
        //opt.curDbgItems.push(c);
        c.shortestSpLinkDist = fromCum;
        c.shortestSpLink = from;
        const toLevel = level + 1;
        const toCum = fromCum + c.getPathWeight();
        c.spLinks.forEach(lnk => {
            if (lnk.shortestSpLinkDist > toCum) {
                //lnk.shortestSpLinkDist = toCum;
                //lnk.shortestSpLink = c;
                //lnk.processed = false;
                //console.log(`pushing ${lnk.x} ${lnk.y} ${lnk.shortestSpLinkDist} ${toCum}`);
                opt.stock.push({
                    c: lnk,
                    from: c,
                    fromCum: toCum,
                    level: toLevel,
                });
                //opt.curDbgItems.push(lnk);
            }
        });
        pcAmount--;
        if (!pcAmount) break;
        withoutSort--;
        if (withoutSort < 0) {
            opt.stock = orderBy(opt.stock, 'fromCum', 'desc');
            withoutSort = opt.withoutSortCfg || 100;
        }
    }
    opt.stock = orderBy(opt.stock, 'fromCum', 'desc');
}


function getRouteOverflowed(c, from = null, fromCum = 0, level = 0) {
    if (c.shortestSpLinkDist <= fromCum) return;
    c.shortestSpLinkDist = fromCum;
    c.shortestSpLink = from;
    const toLevel = level + 1;
    const toCum = fromCum + c.getPathWeight();
    c.spLinks.forEach(lnk => getRoute(lnk, c, toCum, toLevel));    
}

function getMap() {
    return core.origMap.map;
}
const core = {
    run,
    parseFile,
    origMap: parseFile(debugfile),
    getRoute,
    initSearchStart,
    cleanMap,
    getMap,
    getMapAt: (x, y) => get(getMap(),[y,x]),
    getMapByObj: obj => get(getMap(), [obj.y, obj.x]),
    curSearch: null,
};

export default core;