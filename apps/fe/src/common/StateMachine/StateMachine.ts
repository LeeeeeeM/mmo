import State from "../Base/State";
import { FsmParamTypeEnum } from "../Enum/EntityStateEnum";

export type ParamsValueType = boolean | number;

export interface IParamsValue {
  type: FsmParamTypeEnum;
  value: ParamsValueType;
}

export const getInitParamsTrigger = () => {
  return {
    type: FsmParamTypeEnum.Trigger,
    value: false,
  };
};

export const getInitParamsNumber = () => {
  return {
    type: FsmParamTypeEnum.Number,
    value: 0,
  };
};

abstract class StateMachine {
  private _currentState!: State;
  params: Map<string, IParamsValue> = new Map();
  stateMachines: Map<string, State> = new Map();

  animationComponent!: Animation;

  get currentState() {
    return this._currentState;
  }

  set currentState(newState: State) {
    if (!newState) return;
    this._currentState = newState;
    this._currentState.run();
  }

  getParams(paramName: string) {
    if (this.params.has(paramName)) {
      return this.params.get(paramName)!.value;
    }
  }

  setParams(paramName: string, value: ParamsValueType) {
    if (this.params.has(paramName)) {
      const param = this.params.get(paramName)!;
      param.value = value;
      this.run();
      this.resetTrigger();
    }
  }

  resetTrigger() {
    for (const [, param] of this.params) {
      if (param.type === FsmParamTypeEnum.Trigger) {
        param.value = false;
      }
    }
  }

  abstract init(): void

  abstract run(): void
}

export default StateMachine;