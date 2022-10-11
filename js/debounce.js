export default function debounce(callback, delay) {
	let timer
	return (...args) => {
		timer && clearTimeout(timer)
		timer = setTimeout(() => {
			callback(...args)
		}, delay)
	}
}
