function n(number, prec = 0, after1000Prec = 2) {
	if (number == Infinity) return "Infinity"
	if (number < 1e6) {
		return number.toFixed(prec);
	} else {
		var e = Math.floor(Math.log10(number));
		if ((number/Math.pow(10, e)) >= 9.995) number = number*1.001
		return `${(number/Math.pow(10, e)).toFixed(after1000Prec)}e${e}`
	}
}
function nc(num, precision) {
	if (num > 1e9) return n(num, precision)
	return num.toFixed(precision).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}