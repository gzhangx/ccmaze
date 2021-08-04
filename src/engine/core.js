import { get, sortedIndexBy, findIndex} from 'lodash';

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

function clearCell(c) {
    //c.shortestSpLink = null;
    //c.shortestSpLinkDist = MAXWEIGHT;
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
            clearCell(c);
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
            c.id = `${c.x}-${c.y}`;
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
    const map = getMap();
    map.forEach(r => {
        r.forEach(clearCell);
    });
}

function initSearchStart(x, y, checkCur) {
    const c = core.getMapAt(x, y);
    const stock = [];
    const gScore = {
        [c.id]: 1,
    };
    const inStock = {};
    const ret = {
        stock,
        inStock,
        gScore,
        cameFrom: {},
        //fastCover: true,
        processCount: 0,
        checkCur,
        addOpenSet: itm => {
            inStock[itm.id] = true;
            stock.splice(sortedIndexBy(stock, itm, x => -(gScore[x.id] || MAXWEIGHT)), 0, itm);
        }
    };
    
    ret.addOpenSet(c);
    return ret;
}
function processRoute(opt) {
    const { stock, inStock, gScore, cameFrom } = opt;
    while (stock.length) {
        const c = stock.pop();
        if (opt.checkCur) {
            const cr = opt.checkCur(c, opt);
            if (cr === 1) return;  //found
            if (cr === -1) continue; //ignore
            if (cr === 2) {
                inStock[c.id] = c;
                opt.addOpenSet(c);
                return;
            }
        }
        delete inStock[c.id];
        opt.processCount++;         
                    
        const cScore = gScore[c.id];
        c.spLinks.forEach(lnk => {
            const toCum = cScore + lnk.getPathWeight();
            const lnkId = lnk.id;
            const lScore = gScore[lnkId] || MAXWEIGHT;
            if (lScore > toCum) {
                cameFrom[lnkId] = c;
                gScore[lnkId] = toCum;
                if (inStock[lnkId]) {
                    const idx = findIndex(stock, s => s.id === lnkId);
                    stock.splice(idx, 1);
                }
                opt.addOpenSet(lnk);
            }
        });
        
    }
}


function findPath(opt) {
    const { x, y } = opt;
    const prm = initSearchStart(x, y, opt.checkCur);
    processRoute(prm);
    return prm;
}

function getMap() {
    return core.origMap.map;
}
const core = {
    MAXWEIGHT,
    run,
    findPath,
    parseFile,
    origMap: parseFile(debugfile),
    processRoute,
    initSearchStart,
    cleanMap,
    getMap,
    getMapAt: (x, y) => get(getMap(),[y,x]),
    getMapByObj: obj => get(getMap(), [obj.y, obj.x]),
    curSearch: null,
};

export default core;