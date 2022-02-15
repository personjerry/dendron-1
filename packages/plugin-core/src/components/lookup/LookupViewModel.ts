import { Disposable, EventEmitter } from "vscode";

export type LookupViewModel = {
  selectionState: TwoWayBinding<boolean>;
  // selectionState: boolean; // TODO: enum state
  // isSplitHorizontally: boolean;
  isApplyDirectChildFilter: TwoWayBinding<boolean>;
  // todo: boolean;
};

// export interface TwoWayBinding<T> {
//   get(): T;

//   set(newValue: T): void;

//   onStateChanged(callback: (prevValue: T, newValue: T) => void): void;
// }

// export class TrueViewModel {
//   private _emitter: EventEmitter<boolean>;

//   constructor() {
//     this._emitter = new EventEmitter<boolean>();
//   }

//   registerTwoWayBinding(blah: TwoWayBinding<boolean>) {}
// }

export class TwoWayBinding<T> {
  private _value: T;
  private _emitter: EventEmitter<T>;

  constructor(initialValue: T) {
    this._value = initialValue;
    this._emitter = new EventEmitter<T>();
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    this._value = newValue;
    this._emitter.fire(newValue);
  }

  bind(callback: (newValue: T) => void): Disposable {
    return this._emitter.event(callback);
  }
}
