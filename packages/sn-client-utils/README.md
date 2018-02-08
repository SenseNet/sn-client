# sn-client-utils

General sensenet ECM independent client side utilities

[![Gitter chat](https://img.shields.io/gitter/room/SenseNet/SN7ClientAPI.svg?style=flat)](https://gitter.im/SenseNet/SN7ClientAPI)
[![Build Status](https://travis-ci.org/SenseNet/sn-client-utils.svg?branch=master)](https://travis-ci.org/SenseNet/sn-client-utils)
[![codecov](https://codecov.io/gh/SenseNet/sn-client-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/SenseNet/sn-client-utils)
[![Greenkeeper badge](https://badges.greenkeeper.io/SenseNet/sn-client-utils.svg)](https://greenkeeper.io/)
[![NPM version](https://img.shields.io/npm/v/@sensenet/client-utils.svg?style=flat)](https://www.npmjs.com/package/@sensenet/client-utils)
[![NPM downloads](https://img.shields.io/npm/dt/@sensenet/client-utils.svg?style=flat)](https://www.npmjs.com/package/@sensenet/client-utils)
[![License](https://img.shields.io/github/license/SenseNet/sn-client-js.svg?style=flat)](https://github.com/sn-client-utils/LICENSE.txt)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat)](http://commitizen.github.io/cz-cli/)

### Disposable

You can implement *disposable* resources and use them with a *using()* or *usingAsync()* syntax.
Example:
```ts
class Resource implements IDisposable{
      dispose(){
          // cleanup logics
     }
}

using(new Resource(), (resource)=>{
     // do something with the resource
})

usingAsync(new Resource(), async (resource)=>{
     // do something with the resource, allows awaiting promises
})
```

### ObservableValue and ValueObservers

You can track value changes using with this simple Observable implementation.

Example:
```ts

const observableValue = new ObservableValue<number>(0);
const observer = observableValue.subscribe((newValue) => {
    console.log("Value changed:", newValue);
});

// To update the value
observableValue.setValue(Math.random());
// if you want to dispose a single observer
observer.dispose();
// if you want to dispose the whole observableValue with all of its observers:
observableValue.dispose();
```

### PathHelper

The class contains small helper methods for path transformation and manipulation.

### Retrier

Retrier is a utility that can keep trying an operation until it succeeds, times out or reach a specified retry limit.

```ts
const funcToRetry: () => Promise<boolean> = async () => {
            const hasSucceeded = false;
            // ...
            // custom logic
            // ...
            return hasSucceeded;
        };
        const retrierSuccess = await Retrier.create(funcToRetry)
            .setup({
                Retries: 3,
                RetryIntervalMs: 1,
                timeoutMs: 1000,
            })
            .run();
```

### Trace

Trace is an utility that can be used to track method calls, method returns and errors

```ts
const methodTracer: IDisposable = Trace.method({
    object: myObjectInstance,           // You can define an object constructor for static methods as well
    method: myObjectInstance.method,    // The method to be tracked
    isAsync: true,                      // if you set to async, method finished will be *await*-ed
    onCalled: (traceData) => {
        console.log("Method called:", traceData)
    },
    onFinished: (traceData) => {
        console.log("Method call finished:", traceData)
    },
    onError: (traceData) => {
        console.log("Method throwed an error:", traceData)
    }
});

// if you want to stop receiving events
methodTracer.dispose();
```