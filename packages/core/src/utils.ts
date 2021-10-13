export type GetConstructorArgs<T> = T extends abstract new (
	...args: infer U
) => unknown
	? U
	: [...never[]];
