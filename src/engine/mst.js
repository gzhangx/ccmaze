import { remove, orderBy, sortedIndexBy } from 'lodash';
const WEIGHTMAX = 10;
export function doMst(width, height, start) {
    const map = new Array(height).fill().map((r, rw) => {
        r = new Array(width).fill();
        return r.map((c, rc) => {
            return {
                y: rw,
                x: rc,
            };
        });
    });
    const edgeNames = ['l', 't', 'r', 'b'];
    const setNodes = []; //s1
    const avaNodes = []; //s2
    const resEdges = []; //T;
    let avaEdges = []; //E;        

    for (let y = 0; y < height; y++)
        for (let x = 0; x < width; x++) {
            if (y !== start.y || x !== start.x) {
                avaNodes.push(map[y][x]);
            }
        }
    const getMapNode = (x, y) => {
        return map[y][x];
    }

    const syncWeight = (a, aname, b, bname) => {        
        if (a[aname]) {
            b[bname] = a[aname];
        } else if (b[bname]) {
            a[aname] = b[bname];
        } else {
            const w = parseInt((Math.random() * WEIGHTMAX) + 1);
            a[aname] = b[bname] = w;
        }
    }
    const addNode = nn => {
        nn.mstProcessed = true;
        setNodes.push(nn);
        remove(avaNodes, n => n.x === nn.x && n.y === nn.y);
        edgeNames.forEach(name => {
            let toPush = null;
            let toPushWeight = 0;
            if (name === 'l')
                if (nn.x) {
                    toPush = getMapNode(nn.x - 1, nn.y);                    
                    toPushWeight = nn['l'];
                    syncWeight(nn, 'l', toPush, 'r');
                }
            if (name === 'r')
                if (nn.x < width - 1) {
                    toPush = getMapNode(nn.x + 1, nn.y);                    
                    syncWeight(nn, 'r', toPush, 'l');
                    toPushWeight = nn['r'];
                }
            if (name === 't')
                if (nn.y) {
                    toPush = getMapNode(nn.x, nn.y - 1);                    
                    syncWeight(nn, 't', toPush, 'b');
                    toPushWeight = nn['t'];
                }
            if (name === 'b')
                if (nn.y < height - 1) {
                    toPush = getMapNode(nn.x, nn.y + 1);                    
                    syncWeight(nn, 'b', toPush, 't');
                    toPushWeight = nn['b'];
                }
            if (toPush && !toPush.mstProcessed) {
                const itm = {
                    u: nn,
                    v: toPush,
                    weight: toPushWeight,
                };
                avaEdges.splice(sortedIndexBy(avaEdges, itm, x => -x.weight), 0, itm);
                //avaEdges.push()
            }
        });
        
        //avaEdges = orderBy(avaEdges, 'weight', 'desc');
    }

    addNode({...start});
    while (avaNodes.length) {
        const edge = avaEdges.pop();
        if (edge.v.mstProcessed) continue;
        resEdges.push(edge);
        addNode(edge.v);
    }
    return resEdges;
}