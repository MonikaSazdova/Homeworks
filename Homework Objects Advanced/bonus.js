function takeNumbers(...numbers){
	let minOfThree = Math.min(numbers[0], numbers[1], numbers[2]);
	let maxOfAll = Math.max(...numbers);
	return {
		stats: {
			minOfThree: minOfThree,
			maxOfAll: maxOfAll
		}
	}
}

let obj = takeNumbers(1, 2, 3, 4, 5, 6, 7, 8)
console.log(obj)

function printMinMax({stats: {minOfThree: min, maxOfAll: max}}){
	console.log(min);
	console.log(max);
}
printMinMax(obj);