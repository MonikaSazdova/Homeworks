let url="https://restcountries.eu/rest/v2/alpha/"

function enterCode(code){
	fetch(url+code)
	.then(res => res.json())
	.then(data => {
		printNeigbouringCountries(data);
		console.log(`Country: ${data.name}`);
		console.log(`Neighbours:`)})
	}
	
function printNeigbouringCountries(data){
for (let index = 0; index < data.borders.length; index++) {
    let neighbour = data.borders[index];
    fetch(url+neighbour)
    .then(res => res.json())
     .then(data => console.log(`${data.name}`))
}

}


enterCode("MK")
