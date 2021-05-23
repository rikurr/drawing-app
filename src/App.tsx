import React, { useEffect, useRef, useState } from "react";
import { Button } from "./components/button";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const toolRef = useRef<HTMLDivElement>(null!);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = (window.innerWidth - 64) * 2;
    canvas.height = (window.innerHeight / 1.5) * 2;

    canvas.style.width = `${window.innerWidth - 64}px`;
    canvas.style.height = `${window.innerHeight / 1.5}`;

    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    context.scale(2, 2);
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 2;

    contextRef.current = context;
  }, []);

  const startDrawing = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    console.log(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current?.closePath();
    setIsDrawing(false);
  };

  const draw = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const clearCanvas = () => {
    contextRef.current?.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
  };

  return (
    <div className="bg-gray-200 pr-8 pl-8 pt-8 h-screen">
      <canvas
        className="cursor-pointer bg-white shadow-md"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
      ></canvas>
      <div className="pt-8 flex gap-40" ref={toolRef}>
        <div className="flex gap-4">
          <Button type="button" label="undo" />
          <Button type="button" onClick={clearCanvas} label="clear" />
        </div>

        <div className="flex items-center gap-4">
          <button className="bg-black w-8 h-8 rounded-full shadow-md"></button>
          <button className="bg-white w-8 h-8 rounded-full shadow-md"></button>
          <button className="bg-red-500 w-8 h-8 rounded-full shadow-md"></button>
          <button className="bg-blue-500 w-8 h-8 rounded-full shadow-md"></button>
          <button className="bg-yellow-500 w-8 h-8 rounded-full shadow-md"></button>
          <button className="bg-green-500 w-8 h-8 rounded-full shadow-md"></button>
        </div>
      </div>
    </div>
  );
}

export default App;
