'use strict';

require('should');
const g2p = require('..');

describe('generator2promise', function() {

  it('should wrap generator function', function(done) {
    g2p(function* gen() {
      return 'done';
    })()
    .then(val => {
      val.should.eql('done');
    })
    .then(() => done(), done);
  });

  it('should yield value', function(done) {
    g2p(function* gen() {
      return yield 'done';
    })()
    .then(val => {
      val.should.eql('done');
    })
    .then(() => done(), done);
  });

  it('should yield promise', function(done) {
    const yieldable = Promise.resolve('done');

    g2p(function* gen() {
      return yield yieldable;
    })()
    .then(val => {
      val.should.eql('done');
    })
    .then(() => done(), done);
  });

  it('should not yield generator', function(done) {
    const yieldable = function*() {
      return 'done';
    };

    g2p(function* gen() {
      return yield yieldable();
    })()
    .then(val => {
      val.should.not.eql('done');
    })
    .then(() => done(), done);
  });

  it('should not yield thunk', function(done) {
    const yieldable = function() {
      return function(cb) {
        cb(null, 'done');
      };
    };

    g2p(function* gen() {
      return yield yieldable();
    })()
    .then(val => {
      val.should.not.eql('done');
    })
    .then(() => done(), done);
  });

  it('should reject when throw', function(done) {
    g2p(function* gen() {
      throw new Error('fail');
    })()
    .catch(err => {
      err.message.should.eql('fail');
    })
    .then(() => done(), done);
  });

  it('should reject when throw from promise', function(done) {
    const yieldable = Promise.reject(new Error('fail'));

    g2p(function* gen() {
      return yield yieldable;
    })()
    .catch(err => {
      err.message.should.eql('fail');
    })
    .then(() => done(), done);
  });

  it('should bind this', function(done) {
    const obj = {
      member: 'done',
      gen: function*() {
        return this.member;
      },
    };

    obj.gen = g2p(obj.gen, obj);

    obj.gen()
    .then(value => {
      value.should.eql('done');
    })
    .then(() => done(), done);
  });

  it('should pass argument', function(done) {
    const obj = {
      gen: function*(arg1, arg2) {
        return arg1 + arg2;
      },
    };

    obj.gen = g2p(obj.gen, obj);

    obj.gen('do', 'ne')
    .then(value => {
      value.should.eql('done');
    })
    .then(() => done(), done);
  });
});
