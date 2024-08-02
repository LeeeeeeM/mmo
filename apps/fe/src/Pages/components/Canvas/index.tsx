import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import styles from "./index.module.less";

interface CanvasInterface {
  width: number;
  height: number;
  children?: React.ReactNode;
  callback: (dt: number) => void;
}

export interface CanvasRef {
  start: () => void;
  pause: () => void;
}

const Canvas: React.ForwardRefExoticComponent<CanvasInterface & React.RefAttributes<CanvasRef>> = forwardRef<CanvasRef, CanvasInterface>((props, ref) => {
  const { width = 600, height = 400, children = [], callback = () => {} } = props;
  const [isRunning, setIsRunning] = useState(false);

  const rafId = useRef<number | null>(null);

  const curTimeRef = useRef<number>(performance.now());

  useImperativeHandle(ref ,() => ({
    start() {
      setIsRunning(true);
    },
    pause() {
      setIsRunning(false);
    }
  }));

  const flush = () => {
    if (!isRunning) return;
    const curTime = performance.now();
    const dt =  curTime - curTimeRef.current;
    curTimeRef.current = curTime;
    callback(dt);
    requestAnimationFrame(flush);
  };

  useEffect(() => {
    if (!isRunning) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    } else {
      rafId.current = requestAnimationFrame(flush);
    }
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isRunning]);

  return (
    <div
      className={styles["canvas-box"]}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {children}
    </div>
  );
});

export default Canvas;
