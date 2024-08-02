import React from "react";
import { IActor } from "../../../common/types";

import styles from "./index.module.less";

const Actor: React.FC<IActor> = (props) => {
  const { position: { x: posX, y: posY }, direction: { x: dirX, y: dirY } } = props;

  return (
    <div
      className={styles["actor"]}
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
