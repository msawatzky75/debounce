import { afterEach, beforeEach, describe, it, vi } from "vitest";
import debounce from "./index";

describe("housekeeping", () => {
	it("should be defined as a function", ({ expect }) => {
		expect(typeof debounce).toEqual("function");
	});
});

describe("catch issue #3 - Debounced function executing early?", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should debounce with fast timeout", ({ expect }) => {
		let callback = vi.fn();

		// set up debounced function with wait of 100
		let fn = debounce(callback, 100);

		// call debounced function at interval of 50
		setTimeout(fn, 100);
		setTimeout(fn, 150);
		setTimeout(fn, 200);
		setTimeout(fn, 250);

		// set the clock to 100 (period of the wait) ticks after the last debounced call
		vi.advanceTimersByTime(350);

		// the callback should have been triggered once
		expect(callback).toHaveBeenCalledTimes(1);
	});
});

describe("forcing execution", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should not execute prior to timeout", ({ expect }) => {
		let callback = vi.fn();

		// set up debounced function with wait of 100
		let fn = debounce(callback, 100);

		// call debounced function at interval of 50
		setTimeout(fn, 100);
		setTimeout(fn, 150);

		// set the clock to 25 (period of the wait) ticks after the last debounced call
		vi.advanceTimersByTime(175);

		// the callback should not have been called yet
		expect(callback).toHaveBeenCalledTimes(0);
	});

	it("should execute prior to timeout when flushed", ({ expect }) => {
		let callback = vi.fn();

		// set up debounced function with wait of 100
		let fn = debounce(callback, 100);

		// call debounced function at interval of 50
		setTimeout(fn, 100);
		setTimeout(fn, 150);

		// set the clock to 25 (period of the wait) ticks after the last debounced call
		vi.advanceTimersByTime(175);

		fn.flush();

		// the callback has been called
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should not execute again after timeout when flushed before the timeout", ({
		expect,
	}) => {
		let callback = vi.fn();

		// set up debounced function with wait of 100
		let fn = debounce(callback, 100);

		// call debounced function at interval of 50
		setTimeout(fn, 100);
		setTimeout(fn, 150);

		// set the clock to 25 (period of the wait) ticks after the last debounced call
		vi.advanceTimersByTime(175);

		fn.flush();

		// the callback has been called here
		expect(callback).toHaveBeenCalledTimes(1);

		// move to past the timeout
		vi.advanceTimersByTime(225);

		// the callback should have only been called once
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it("should not execute on a timer after being flushed", ({ expect }) => {
		let callback = vi.fn();

		// set up debounced function with wait of 100
		let fn = debounce(callback, 100);

		// call debounced function at interval of 50
		setTimeout(fn, 100);
		setTimeout(fn, 150);

		// set the clock to 25 (period of the wait) ticks after the last debounced call
		vi.advanceTimersByTime(175);

		fn.flush();

		// the callback has been called here
		expect(callback).toHaveBeenCalledTimes(1);

		// schedule again
		setTimeout(fn, 250);

		// move to past the new timeout
		vi.advanceTimersByTime(400);

		// the callback should have been called again
		expect(callback).toHaveBeenCalledTimes(2);
	});

	it("should not execute when flushed if nothing was scheduled", ({
		expect,
	}) => {
		let callback = vi.fn();

		// set up debounced function with wait of 100
		let fn = debounce(callback, 100);

		fn.flush();

		// the callback should not have been called
		expect(callback).toHaveBeenCalledTimes(0);
	});
});
