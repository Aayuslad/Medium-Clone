import { useEffect, useState } from "react";

// Define the types for the debounced value and the input value
type DebouncedValue<T> = T | undefined;
type InputValue<T> = T;

function useDebounce<T>(value: InputValue<T>, delay: number): DebouncedValue<T> {
	const [debouncedValue, setDebouncedValue] = useState<DebouncedValue<T>>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default useDebounce;
