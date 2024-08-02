import { Singleton } from "@mmo/common";
import DataManager from "./DataManager";
import { InputType } from "../Enum";

class ActorManager extends Singleton {
  static get Instance() {
    return super.GetInstance<ActorManager>();
  }
  update(dt: number) {
    const manager = DataManager.Instance;
    const { x, y } = manager.input;

    if (manager.input.length() === 0) return;

    manager.applyInput({
      id: 1,
      type: InputType.ActorMove,
      direction: {
        x,
        y,
      },
      dt,
    });
  }
}

export default ActorManager;
