// @ts-check
import React from 'react';

/**
 * @template T
 */
class PromiseWithResolverAccess {
  constructor() {
    /** @type {undefined | null | ((arg: T) => void)} */
    this.resolver = undefined;
    /** @type {undefined | null | ((arg: any) => void)} */
    this.rejecter = undefined;
    /** @readonly @type {Promise<T>} */
    this.promise = new Promise((resolve, reject) => {
      this.resolver = resolve;
      this.rejecter = reject;
    });
  }

  /**
   * @param {T} res
   */
  setPromiseResolution (res) {
    this.checkResolverAndRejecter();
    /** @type {(arg: T) => void}*/(this.resolver)(res);
    this.resolver = null;
  }

  setPromiseRejection (err) {
    this.checkResolverAndRejecter();
    /** @type {(arg: any) => void}*/(this.rejecter)(err);
    this.rejecter = null;
  }

  checkResolverAndRejecter() {
    const sharedText =  'has already been called, can\'t call it twice in the same request';
    if (this.resolver === null) throw new Error(`setPromiseResolution ${sharedText}`);
    if (this.rejecter === null) throw new Error(`setPromiseRejecter ${sharedText}`);
  }
}

/**
 * @template T
 * @param {any} [cache]
 * @returns {() => PromiseWithResolverAccess<T>}
 */
// @param {<U extends ((...args: any[]) => any)>(func: U) => U} [cache]
export const createCachedPromiseGetter = (cache) => {
  const getPromise = () => new PromiseWithResolverAccess();
  // @ts-ignore
  return (cache ?? /** @type {NonNullable<typeof cache>} */ (React.cache))(getPromise);
};

export default createCachedPromiseGetter;