import React, {useRef, useState} from 'react';
import './App.css';

const colours = [
  "black",
  "blue",
  "red",
  "green",
  "yellow",
  "orange",
  "purple"
]


function App() {

  // const canvasRef = useRef(null);
  // const ctx = useRef(null);

  

  const [mouseDown, setMouseDown] = useState(false);
  const [positionX, setX] = useState(null);
  const [positionY, setY] = useState(null);
  const [selectColour, setColour] = useState("black");


  const draw = (x, y) => {
    if(mouseDown) {
      var canvas = document.getElementById('canvas');
      if(canvas.getContext){
        console.log(positionX, positionY)

        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = selectColour;
        ctx.lineWidth = 10;
        // ctx.lineJoin = 'round';
        ctx.moveTo(positionX, positionY);
        ctx.lineTo(x-document.getElementById("canvas").offsetLeft, y);
        ctx.stroke();
        // setPosition(x-200, y)
        setX(x-document.getElementById("canvas").offsetLeft);
        setY(y);
      }
    }
  }

  const clear = () => {
    var canvas = document.getElementById('canvas');
    if(canvas.getContext){
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
    }
  }

  const handleMouseDown = (e) => {
    setX(e.pageX-document.getElementById("canvas").offsetLeft);
    setY(e.pageY);
    // setPosition({x: e.pageX-100, y: e.pageY});
    setMouseDown(true);
    // console.log(e)
  }

  const handleMouseUp = () => {
    setMouseDown(false);
  }

  const handleMouseMove = (x) => {
    // console.log("hello ", x.pageX, x.pageY, mouseDown, selectColour)
    draw(x.pageX, x.pageY)
  }

  const changeColour = () => {
    setColour(document.getElementById("colours").value);
  }

  return (
    <div className="App">
      <script src="paintScript"></script>
      <canvas
        id="canvas"
        style={{
          border: "1px solid #000"
        }}
        width={400} 
        height={400}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        // ref={canvasRef}
      />
      <br/>
      <label for="colours">Colour: </label>
      <select name="colours" id="colours" onChange={changeColour}>
      
        {colours.map(
          colour => <option value={colour}>{colour}</option>
          )}
      </select>
      <button onClick={clear}>Clear</button>
      
    </div>
  );
}



export default App;
