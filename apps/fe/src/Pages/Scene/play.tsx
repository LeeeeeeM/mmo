import React, { useEffect, useRef, useState } from "react";
import { clone } from "lodash-es";
import JoyStick from "../components/JoyStick";
import { IActor, Vec } from "../../common/types";
import Canvas, { CanvasRef } from "../components/Canvas";
import DataManager from "../../common/Manager/DataManager";
import ActorManager from "../../common/Manager/ActorManager";
import Actor from "../components/Actor";
// import NetworkManager from "../scripts/global/NetworkManager";

const Play: React.FC = () => {
  const [actors, setActors] = useState<IActor[]>(
    DataManager.Instance.state.actors
  );

  const canvasRef = useRef<CanvasRef>(null);

  const getInput = (vec: Vec) => {
    // console.log(vec)
    DataManager.Instance.input = vec;
  };

  const updateDt = (dt: number) => {
    ActorManager.Instance.update(dt);
    setActors(clone(DataManager.Instance.state.actors));
  };

  useEffect(() => {
    canvasRef.current?.start();
  }, []);

  // useEffect(() => {
  //   console.log(JSON.stringify(actors[0].position), 111);
  // }, [actors]);

  return (
    <div>
      <Canvas width={600} height={400} callback={updateDt} ref={canvasRef}>
        {actors.map((actor) => (
          <Actor {...actor} key={actor.id} />
        ))}
      </Canvas>
      <JoyStick boxRadius={50} stickRadius={20} callback={getInput} />
    </div>
  );
};

export default Play;
