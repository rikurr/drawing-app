import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./components/button";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStore, setDrawStore] = useState<ImageData[]>([]);
  const [drawIndex, setDrawIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;

    // Retina対応
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
    if (!contextRef.current) return;

    contextRef.current?.closePath();
    setIsDrawing(false);
    const newDrawDate = [
      ...drawStore,
      contextRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      ),
    ];
    setDrawStore(newDrawDate);
    setDrawIndex((prev) => prev + 1);
  };

  const draw = ({
    nativeEvent,
  }: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;

    const { offsetX, offsetY } = nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const clearDraw = () => {
    contextRef.current?.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    setDrawStore([]);
    setDrawIndex(-1);
  };
  const undoDraw = () => {
    if (!contextRef.current) return;
    if (drawIndex <= 0) {
      return clearDraw();
    }

    const newIndex = drawIndex - 1;
    const undoDrawDate = drawStore.slice(0, -1);
    setDrawIndex(newIndex);
    setDrawStore(undoDrawDate);
    contextRef.current?.putImageData(undoDrawDate[newIndex], 0, 0);
  };

  const selectColor = useCallback((color: string) => {
    if (!contextRef.current) return;
    contextRef.current.strokeStyle = color;
  }, []);

  const changeDrawWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!contextRef.current) return;
    contextRef.current.lineWidth = parseInt(event.target.value);
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
      <div className="pt-8 flex gap-40">
        <div className="flex gap-4">
          <Button type="button" onClick={undoDraw} label="undo" />
          <Button type="button" onClick={clearDraw} label="clear" />
        </div>

        <div className="flex items-center gap-4">
          <button
            className="bg-black w-8 h-8 rounded-full shadow-md"
            onClick={() => selectColor("black")}
          ></button>
          <button
            className="bg-white w-8 h-8 rounded-full shadow-md"
            onClick={() => selectColor("white")}
          ></button>
          <button
            className="bg-red-500 w-8 h-8 rounded-full shadow-md"
            onClick={() => selectColor("red")}
          ></button>
          <button
            className="bg-blue-500 w-8 h-8 rounded-full shadow-md"
            onClick={() => selectColor("blue")}
          ></button>
          <button
            className="bg-yellow-500 w-8 h-8 rounded-full shadow-md"
            onClick={() => selectColor("yellow")}
          ></button>
          <button
            className="bg-green-500 w-8 h-8 rounded-full shadow-md"
            onClick={() => selectColor("green")}
          ></button>
        </div>
        <input type="range" min={1} max={100} onChange={changeDrawWidth} />
      </div>
    </div>
  );
}

export default App;
