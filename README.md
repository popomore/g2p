# generator2promise

Transform generator to promise

## Usage

Wrap the generator function yield a function that can return a Promise.

```js
const g2p = require('g2p');
const func = g2p(function*() {
  return yield Promise.resolve('done');
});

func()
.then(function(val) {
  console.log(val); // => done
})
```

You can bind the context and pass argument.

```js
const g2p = require('g2p');
const ctx = { key: 'done' };
const func = g2p(function*(val) {
  return this.key + val;
}, ctx);

func('done')
.then(function(val) {
  console.log(val); // => donedone
})
```

**You can't yield another generator function or thunk in the wrapped generator function.**

## Why?

If you have ever used co, and it's same as co.wrap. But it's simple for the future, it desugers from the async function.

async function will return a promise after calling, same as g2p. and always await a promise, not thunk or generator function. If you write code follow this, you can easily use async/await after it releases.

**Write you API in generator function and wrap it with g2p.**

```js
// lib/index.js
exports.test = function*() {
  return yield promise;
};

// index.js
const g2p = require('g2p');
const lib = require('./lib');
exports.test = g2p(lib.test, lib);
```

**Make sure modules that you depend on always return promise**

If it's a generator function, you can use g2p.

If it's a thunk, you can wrap it with co.

If it's a callback, you can wrap it with co.

You can also wrap thunk or callback by yourself, leave co alone.
