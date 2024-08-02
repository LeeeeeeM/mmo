import State from "../Base/State";
import { FsmParamTypeEnum, ParamsNameEnum } from "../Enum/EntityStateEnum";
import StateMachine, { IParamsValue } from "./StateMachine";

export const getInitParamsTrigger = () => {
  return {
    type: FsmParamTypeEnum.Trigger,
    value: false,
  };
};

class PlayStateMachine extends StateMachine {
  params: Map<string, IParamsValue> = new Map();
  stateMachines: Map<string, State> = new Map();

  animationNode: Element;

  constructor(node: Element) {
    super();
    this.animationNode = node;
    const rollingKeyframes = new KeyframeEffect(
      node,
      [
        { transform: "scale(0.8)" }, // keyframe
        { transform: "scale(1)" }, // keyframe
        { transform: "scale(1.2)" }
      ],
      {
        // keyframe options
        duration: 500,
        direction: "alternate",
        easing: "ease-in-out",
        fill: "forwards"
      }
    );
    rollingKeyframes.composite = 'add';
    this.animationComponent = new Animation(rollingKeyframes, document.timeline);
  }

  init() {
    this.initParams();
    this.initStateMachines();
    this.initAnimationEvent();
  }

  initAnimationEvent() {
    // 动画结束，重置IDLE状态
    // this.animationNode.addEventListener("animationend", () => {
    //   this.setParams(ParamsNameEnum.Idle, true);
    // });
    this.animationComponent.addEventListener("finish", () => {
      this.animationComponent.cancel();
      // this.setParams(ParamsNameEnum.Idle, true);
    });
  }

  initParams() {
    this.params.set(ParamsNameEnum.Idle, getInitParamsTrigger());
    this.params.set(ParamsNameEnum.Run, getInitParamsTrigger());
  }

  initStateMachines() {
    this.stateMachines.set(ParamsNameEnum.Idle, new State(this));
    this.stateMachines.set(ParamsNameEnum.Run, new State(this));
  }

  stopCurrentAnimation() {
    if (this.animationComponent) {
      this.animationComponent.cancel();
    }
  }

  run() {
    this.stopCurrentAnimation();
    switch (this.currentState) {
      case this.stateMachines.get(ParamsNameEnum.Idle):
      case this.stateMachines.get(ParamsNameEnum.Run):
        if (this.params.get(ParamsNameEnum.Run)?.value) {
          this.currentState = this.stateMachines.get(ParamsNameEnum.Run)!;
        } else if (this.params.get(ParamsNameEnum.Idle)?.value) {
          this.currentState = this.stateMachines.get(ParamsNameEnum.Idle)!;
        } else {
          this.currentState = this.currentState;
        }
        break;
      default:
        this.currentState = this.stateMachines.get(ParamsNameEnum.Idle)!;
        break;
    }
  }
}

export default PlayStateMachine;
