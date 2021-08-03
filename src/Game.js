import React, {useEffect, useState} from "react";

//import { core } from './core';
//import opt from './components/thisworld/world';
import { createRender, uiInfo } from './ui/render';

function Scene () {
  const drawRef = React.createRef();
  const [mousePos, setMousePos] = useState({x:0,y:0});

  useEffect(() => {
    const render = createRender(drawRef.current, mousePos);
  })



    //core.inputs.isDesignMode = this.props.inputs.isDesignMode;
    return <div>      
      <canvas ref={drawRef} onDragStart={e => e.preventDefault()}
        onMouseMove={(e) => {
          const y = (e.clientY - e.target.offsetTop)
          const x = (e.clientX - e.target.offsetLeft);
          uiInfo.mousePos.x = x;
          uiInfo.mousePos.y = y;
          setMousePos({ x, y });
        }}
        width={1024} height={768}></canvas>
      <button onClick={() => {
        uiInfo.debugStart = true;
      } }></button>
    </div>;
}
export default Scene;