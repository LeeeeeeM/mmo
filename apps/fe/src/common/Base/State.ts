import StateMachine from "../StateMachine/StateMachine";
class State {
  constructor(private fsm: StateMachine) {
    this.init();
  }

  init() {
  }

  run() {
    this.fsm.animationComponent.play();
  }
}


export default State;