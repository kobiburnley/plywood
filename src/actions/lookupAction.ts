/*
 * Copyright 2015-2016 Imply Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


import { Action, ActionJS, ActionValue } from "./baseAction";
import { PlyType, DatasetFullType, PlyTypeSingleValue, FullType } from "../types";
import { SQLDialect } from "../dialect/baseDialect";
import { ComputeFn } from "../datatypes/dataset";

export class LookupAction extends Action {
  static fromJS(parameters: ActionJS): LookupAction {
    var value = Action.jsToValue(parameters);
    value.lookup = parameters.lookup;
    return new LookupAction(value);
  }

  public lookup: string;

  constructor(parameters: ActionValue) {
    super(parameters, dummyObject);
    this.lookup = parameters.lookup;
    this._ensureAction("lookup");
  }

  public valueOf(): ActionValue {
    var value = super.valueOf();
    value.lookup = this.lookup;
    return value;
  }

  public toJS(): ActionJS {
    var js = super.toJS();
    js.lookup = this.lookup;
    return js;
  }

  public equals(other: LookupAction): boolean {
    return super.equals(other) &&
      this.lookup === other.lookup;
  }

  protected _toStringParameters(expressionString: string): string[] {
    return [String(this.lookup)];
  }

  public getNecessaryInputTypes(): PlyType | PlyType[] {
    return this._stringTransformInputType;
  }

  public getOutputType(inputType: PlyType): PlyType {
    return this._stringTransformOutputType(inputType);
  }

  public _fillRefSubstitutions(typeContext: DatasetFullType, inputType: FullType): FullType {
    return inputType;
  }

  public fullyDefined(): boolean {
    return false;
  }

  protected _getFnHelper(inputType: PlyType, inputFn: ComputeFn): ComputeFn {
    throw new Error('can not express as JS');
  }

  protected _getJSHelper(inputType: PlyType, inputJS: string): string {
    throw new Error('can not express as JS');
  }

  protected _getSQLHelper(inputType: PlyType, dialect: SQLDialect, inputSQL: string, expressionSQL: string): string {
    throw new Error('can not express as SQL');
  }
}

Action.register(LookupAction);
