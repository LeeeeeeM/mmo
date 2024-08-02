import { Singleton } from "@mmo/common";
import { IActorMove, IState, Vec } from "../types";

const ACTOR_SPEED = 200 / 1000;

class DataManager extends Singleton {
  static get Instance() {
    return super.GetInstance<DataManager>();
  }

  getState() {
    return this.state;
  }

  input: Vec = Vec.ZERO;

  state: IState = {
    actors: [
      {
        id: 1,
        position: {
          x: 0,
          y: 0,
        },
        direction: {
          x: 1,
          y: 0,
        },
      },
    ],
  };

  applyInput(input: IActorMove) {
    const {
      id,
      dt,
      direction: { x, y },
    } = input;
    const actor = this.state.actors.find((actor) => actor.id === id);

    if (!actor) return;

    actor.direction.x = x;
    actor.direction.y = y;

    actor.position.x += x * dt * ACTOR_SPEED;
    actor.position.y += y * dt * ACTOR_SPEED;
  }
}

export default DataManager;
