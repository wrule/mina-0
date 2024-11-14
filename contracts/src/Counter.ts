import { Field, SmartContract, state, State, method } from 'o1js';

export class Counter extends SmartContract {
  @state(Field) num = State<Field>();

  init() {
    super.init();
    this.num.set(Field(1993));
  }

  @method async inc() {
    const currentState = this.num.getAndRequireEquals();
    const newState = currentState.add(1);
    this.num.set(newState);
  }

  @method async dec() {
    const currentState = this.num.getAndRequireEquals();
    const newState = currentState.sub(1);
    this.num.set(newState);
  }
}
