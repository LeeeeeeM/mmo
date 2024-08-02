import DataManager from "./DataManager";
import { InputType } from "../Enum";
import { EntityManager } from "./EntityManager";
import PlayStateMachine from "../StateMachine/PlayerStateMachine";
import { EntityStateEnum } from "../Enum/EntityStateEnum";

class ActorManager extends EntityManager {
  static get Instance() {
    return super.GetInstance<ActorManager>();
  }

  init(node: Element) {
    this.fsm = new PlayStateMachine(node);
    this.fsm.init();
    this.state = EntityStateEnum.Idle;
  }

  update(dt: number) {
    const manager = DataManager.Instance;
    const { x, y } = manager.input;

    if (manager.input.length()) {
      manager.applyInput({
        id: 1,
        type: InputType.ActorMove,
        direction: {
          x,
          y,
        },
        dt,
      });
      this.state = EntityStateEnum.Run;
    } else {
      this.state = EntityStateEnum.Idle;
    }
  }
}

export default ActorManager;
