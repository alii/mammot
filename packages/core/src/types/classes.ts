export type GetAbstractConstructorArgs<T> = T extends abstract new (
	...args: infer U
) => unknown
	? U
	: [...never[]];
