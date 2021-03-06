/*
 * Copyright 2012-2015 Metamarkets Group Inc.
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

import * as Q from 'q-tsc';

export interface VerboseRequesterParameters<T> {
  requester: Requester.PlywoodRequester<T>;
  printLine?: (line: string) => void;
  preQuery?: (query: any) => void;
  onSuccess?: (data: any, time: number, query: any) => void;
  onError?: (error: Error, time: number, query: any) => void;
}

export function verboseRequesterFactory<T>(parameters: VerboseRequesterParameters<T>): Requester.PlywoodRequester<any> {
  var requester = parameters.requester;

  var printLine = parameters.printLine || ((line: string): void => {
      console['log'](line);
    });

  var preQuery = parameters.preQuery || ((query: any, queryNumber: int): void => {
      printLine("vvvvvvvvvvvvvvvvvvvvvvvvvv");
      printLine(`Sending query ${queryNumber}:`);
      printLine(JSON.stringify(query, null, 2));
      printLine("^^^^^^^^^^^^^^^^^^^^^^^^^^");
    });

  var onSuccess = parameters.onSuccess || ((data: any, time: number, query: any, queryNumber: int): void => {
      printLine("vvvvvvvvvvvvvvvvvvvvvvvvvv");
      printLine(`Got result from query ${queryNumber}: (in ${time}ms)`);
      printLine(JSON.stringify(data, null, 2));
      printLine("^^^^^^^^^^^^^^^^^^^^^^^^^^");
    });

  var onError = parameters.onError || ((error: Error, time: number, query: any, queryNumber: int): void => {
      printLine("vvvvvvvvvvvvvvvvvvvvvvvvvv");
      printLine(`Got error in query ${queryNumber}: ${error.message} (in ${time}ms)`);
      printLine("^^^^^^^^^^^^^^^^^^^^^^^^^^");
    });

  var queryNumber: int = 0;
  return (request: Requester.DatabaseRequest<any>): Q.Promise<any> => {
    queryNumber++;
    var myQueryNumber = queryNumber;
    preQuery(request.query, myQueryNumber);
    var startTime = Date.now();
    return requester(request)
      .then(data => {
        onSuccess(data, Date.now() - startTime, request.query, myQueryNumber);
        return data;
      }, (error) => {
        onError(error, Date.now() - startTime, request.query, myQueryNumber);
        throw error;
      });
  };
}
