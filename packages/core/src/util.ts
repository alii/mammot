/**
 * Checks if a value exists in an array in a type safe manner
 * @param value Value to check
 * @param arr An array of possible matches
 * @returns A boolean indicating if a passed value is one of the items in the array
 */
export function is<V extends string | number, Arr extends readonly [V, ...V[]]>(
	value: unknown,
	arr: Arr,
): value is Arr[number] {
	return arr.includes(value as V);
}
