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
  resolve (res) {
    this.checkResolverAndRejecter();
    /** @type {(arg: T) => void}*/(this.resolver)(res);
    this.resolver = null;
  }

  reject (err) {
    this.checkResolverAndRejecter();
    /** @type {(arg: any) => void}*/(this.rejecter)(err);
    this.rejecter = null;
  }

  /**
   * 
   * @param {((value: T) => any) | undefined | null} [resolve]
   * @param {((reason: any) => any) | undefined | null} [reject] 
   * @return {PromiseLike<T>}
   */
  then (resolve, reject) {
    return this.promise.then(resolve, reject);
  }

  checkResolverAndRejecter() {
    const sharedText =  'has already been called, can\'t call it twice in the same request';
    if (this.resolver === null) throw new Error(`resolve ${sharedText}`);
    if (this.rejecter === null) throw new Error(`reject ${sharedText}`);
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