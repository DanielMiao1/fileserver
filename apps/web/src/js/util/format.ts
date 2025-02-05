export function removePxSuffix(px_number: string) {
	return parseFloat(px_number.slice(0, -2));
}
