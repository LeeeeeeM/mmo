import React, { useEffect, useRef } from "react";
import { IActor } from "../../../common/types";

import styles from "./index.module.less";
import ActorManager from "../../../common/Manager/ActorManager";

const Actor: React.FC<IActor> = (props) => {
  const { position: { x: posX, y: posY }, direction: { x: dirX, y: dirY } } = props;

  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      ActorManager.Instance.init(divRef.current);
    }
  }, []);

  return (
    <div
      className={styles["actor"]}
      ref={divRef}
      style={{
        width: `50px`,
        height: `50px`,
        left: `-25px`,
        top: `-25px`,
        transform: `translate3d(${posX}px, ${posY}px, 0) scaleX(${dirX > 0 ? 1 : -1})`
      }}
    >
    </div>
  );
};

export default Actor;
