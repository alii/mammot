export function isNumOrInt(val: unknown): val is 'NUMBER' | 'INTEGER' {
	return typeof val === 'string' && ['NUMBER', 'INTEGER'].includes(val);
}
