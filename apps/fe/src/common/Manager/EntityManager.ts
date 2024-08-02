import { Singleton } from "@mmo/common";
import { EntityStateEnum } from "../Enum/EntityStateEnum";
import StateMachine from "../StateMachine/StateMachine";

export class EntityManager extends Singleton {
    
  fsm!: StateMachine;
  private _state!: EntityStateEnum;

  get state() {
    return this._state;
  }

  set state(newState) {
    this._state = newState;
    this.fsm.setParams(newState, true);
  }
}