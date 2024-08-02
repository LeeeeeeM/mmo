import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Vec } from "../../../common/types";

interface JoyStickInterface {
  boxRadius: number;
  stickRadius: number;
  callback: (vec: Vec) => void;
}

const JoyStick: React.FC<JoyStickInterface> = (props) => {
  const [showJoyBox, setShowJoyBox] = useState(false);

  const { boxRadius, stickRadius, callback = () => {} } = props;

  const [joyPos, setJoyPos] = useState<Vec>(Vec.ZERO);

  const [stickPos, setStickPos] = useState<Vec>(Vec.ZERO);

  const initPosRef = useRef<Vec>(Vec.ZERO);

  const moveRef = useRef<boolean>(false);

  const relativeRef = useRef<Vec>(Vec.ZERO);

  useEffect(() => {
    const rel = boxRadius - stickRadius;
    relativeRef.current = new Vec(rel, rel);
  }, [boxRadius, stickRadius]);

  const pointerDown = (e: PointerEvent) => {
    setShowJoyBox(true);
    moveRef.current = true;
    const initPos = new Vec(e.pageX, e.pageY);
    initPosRef.current = initPos;
    setJoyPos(initPos);
    setStickPos(relativeRef.current);
  };

  const pointerMove = (e: PointerEvent) => {
    if (!moveRef.current) return;
    const initPos = initPosRef.current;
    let stickPos = new Vec(e.pageX - initPos.x, e.pageY - initPos.y);
    if (stickPos.length() > boxRadius) {
      stickPos = stickPos.scale(boxRadius / stickPos.length());
    }
    setStickPos(stickPos.add(relativeRef.current));
    callback(stickPos.normalize().clone());
  };

  const pointerUp = () => {
    moveRef.current = false;
    initPosRef.current = Vec.ZERO;
    setShowJoyBox(false);
    setStickPos(relativeRef.current);
    callback(Vec.ZERO);
  };

  useEffect(() => {
    const eventTarget = document.body;

    const lastUserSelect = eventTarget.style.userSelect;
    eventTarget.style.userSelect = "none";

    eventTarget.addEventListener("pointerdown", pointerDown, false);
    eventTarget.addEventListener("pointermove", pointerMove, false);
    eventTarget.addEventListener("pointerup", pointerUp, false);

    return () => {
      eventTarget.style.userSelect = lastUserSelect;
      eventTarget.removeEventListener("pointerdown", pointerDown, false);
      eventTarget.removeEventListener("pointermove", pointerMove, false);
      eventTarget.removeEventListener("pointerup", pointerUp, false);
    };
  }, []);

  if (!showJoyBox) return null;

  return (
    <div
      className={styles["joy-stick-box"]}
      style={{
        width: `${2 * boxRadius}px`,
        height: `${2 * boxRadius}px`,
        transform: `translate(${joyPos.x - boxRadius}px, ${joyPos.y - boxRadius}px)`
      }}
    >
      <div className={styles["stick-box"]}>
        <div
          className={styles["stick"]}
          style={{
            width: `${2 * stickRadius}px`,
            height: `${2 * stickRadius}px`,
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
          }}
        ></div>
      </div>
    </div>
  );
};

export default JoyStick;
