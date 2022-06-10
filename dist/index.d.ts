interface Debounced<F extends (...args: any) => any> {
    (...args: Parameters<F>): ReturnType<F>;
    clear(): void;
    flush(): void;
}
/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing. The function also has a property 'clear'
 * that is a function which will clear the timer to prevent previously scheduled executions.
 *
 * @source underscore.js
 * @see http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
 * @param {Function} function to wrap
 * @param {Number} timeout in ms (`100`)
 * @param {Boolean} whether to execute at the beginning (`false`)
 * @api public
 */
export declare function debounce<A extends (...args: any) => any>(func: A, wait?: number, immediate?: boolean): Debounced<A>;
export default debounce;
//# sourceMappingURL=index.d.ts.map