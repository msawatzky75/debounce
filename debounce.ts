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
export function debounce<A extends (...args: any) => any>(
	func: A,
	wait: number = 100,
	immediate: boolean = false
): Debounced<A> {
	let timeout: ReturnType<typeof setTimeout> | null = null,
		args: any,
		context: any,
		timestamp: number,
		result: ReturnType<A>;

	function later() {
		const last = Date.now() - timestamp;

		if (last < wait && last >= 0) {
			timeout = setTimeout(later, wait - last);
		} else {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);
				context = args = null;
			}
		}
	}

	const debounced: Debounced<A> = function (
		this: Debounced<A>,
		...debouncedargs: Parameters<A>
	) {
		context = this;
		args = debouncedargs;
		timestamp = Date.now();
		const callNow = immediate && !timeout;
		if (!timeout) timeout = setTimeout(later, wait);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};

	debounced.clear = function () {
		if (!timeout) return;
		clearTimeout(timeout);
		timeout = null;
	};

	debounced.flush = function () {
		if (!timeout) return;
		result = func.apply(context, args);
		context = args = null;

		clearTimeout(timeout);
		timeout = null;
	};

	return debounced;
}

export default debounce;
