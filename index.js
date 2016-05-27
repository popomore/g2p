'use strict';

const debug = require('debug')('g2p');

module.exports = function(genF, self) {
  return function() {
    const args = [];
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    return new Promise(function(resolve, reject) {
      const gen = genF.apply(self, args);

      function step(nextF) {
        let next;
        try {
          next = nextF();
          debug(next);
        } catch (e) {
          reject(e);
          return;
        }
        if (next.done) {
          resolve(next.value);
          return;
        }
        Promise.resolve(next.value).then(function(v) {
          step(function() {
            return gen.next(v);
          });
        }, function(e) {
          step(function() {
            return gen.throw(e);
          });
        });
      }
      step(function() {
        return gen.next(undefined);
      });
    });
  };
};
