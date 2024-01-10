// @ts-check
import assert from 'node:assert';
import { test  } from 'node:test';
import createCachedPromiseGetter from "./index.js";

test('Simplest use case', async () => {
  const timeout = setTimeout(() => {
    console.log('timeout');
  }, 2000);
  /**
  * @typedef {object} MyData
  * @property {string} someProp
  */
  const cache = (func) => {
    let cachedValue;
    const funcWithCache = (...args) => cachedValue ? cachedValue : (cachedValue = func(...args));
    return funcWithCache;
  }
  const myDataPromiseGetter = /** @type {typeof createCachedPromiseGetter<MyData>} */(createCachedPromiseGetter)(cache);
  const obj = {someProp: "some value"};
  myDataPromiseGetter().resolve(obj);
  
  const myData = await myDataPromiseGetter();
  assert.strictEqual(myData, obj);
  clearTimeout(timeout);
});

