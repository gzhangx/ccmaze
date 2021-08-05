import React, {useEffect, useState} from "react";

import core from './engine/core';

import { createRender, uiInfo, BLKSIZE } from './ui/render';
import game from './engine/game';

function Scene () {
  const drawRef = React.createRef();
  const [gameState, setGameState] = useState({
    gcanv: {
      width: 1024,
      height: 768,
    }
  });
  uiInfo.setGameState = setGameState;

  useEffect(() => {
    const render = createRender(drawRef.current);
    game.start();
    const width = core.origMap.w * BLKSIZE;
    const height = core.origMap.h * BLKSIZE;
    setGameState({
      ...gameState,
      debugText: '',
      gcanv: {
        width,
        height,
      }
    })
  },[])



  const obtainMousePos = e => {
    const y = (e.clientY - e.target.offsetTop)
    const x = (e.clientX - e.target.offsetLeft);
    const mousePos = game.inputInfo.mousePos;
    mousePos.x = x;
    mousePos.y = y;
    mousePos.blkx = parseInt((x + 1) / BLKSIZE);
    mousePos.blky = parseInt((y + 1) / BLKSIZE);
    return { x, y };
  }
    //core.inputs.isDesignMode = this.props.inputs.isDesignMode;
    return <div>      
      <canvas ref={drawRef} onDragStart={e => e.preventDefault()}
        onMouseMove={(e) => {
          const mp = obtainMousePos(e);
        }}
        onClick={e => {
          obtainMousePos(e);
          game.inputInfo.mousePos.clicked = true;          
        }}
        width={gameState.gcanv.width} height={gameState.gcanv.height} style={{ background: 'gray' }}></canvas>
      <br></br>
      <span>{gameState.gcanv.width},{gameState.gcanv.height} {core.origMap.w}-{core.origMap.h}</span>
      <br/>
      <span>{gameState.debugText}</span>
      <button onClick={() => {
        uiInfo.debugStart = true;
      } }>Start</button>
    </div>;
}
export default Scene;