// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
class InjectionFixtureBuilder<T extends unknown = unknown> {
  public readonly result: T;

  constructor(private _target: T) {
    this.result = _target;
  }

  with<F extends keyof T>(fields: Pick<T, F>): InjectionFixtureBuilder<T> {
    Object.assign<T, Pick<T, F>>(this._target, fields);
    return this;
  }
}

export default InjectionFixtureBuilder;
