let apiService = {
	apiUrl: "https://api.openweathermap.org/data/2.5/",
	city: "Skopje",
	apiKey: "fb53d4003145d769efdfa6f63e9f8cec",
	dataTypeForecast: "forecast",
	dataTypeCurrent: "weather",
	currentData: {}, 

	getDataCurrent: function(){
		$.ajax({
				url: `${this.apiUrl}${this.dataTypeCurrent}?q=${this.city}&appid=${this.apiKey}`,
				success: function (res) {
						console.log(res);
						uiService.loadCurrentWeather(res);
				}, 
				error: function(res){
						console.log(res.status)
						console.log(res.statusText)
						console.log(res)
						let div = document.createElement('div');
						div.innerText = `<strong>Error:</strong> ${res.status}!	${res.statusText}.`
					  div.setAttribute('class', "alert alert-light")

					
				}
		});
	},

	getDataForecast: function(){
		$.ajax({
				url: `${this.apiUrl}${this.dataTypeForecast}?q=${this.city}&units=metric&APPID=${this.apiKey}`,
				success: function (res) {
						console.log('The request succeeded!');
						console.log(res);
						uiService.loadStatistics(res);
						uiService.loadHourlyWeather(res);
				}, 
				error: function(res){
						console.log('The request failed!');
						console.log(res.responseText);
				}
		});
	},

	getDataStats: function(data){
		let weatherData = data.list;
		let sumTemp = 0;
		let highestTemp = weatherData[0];
		let lowestTemp = weatherData[0];
		let sumHum = 0;
		let highestHum = weatherData[0];
		let lowestHum = weatherData[0];
		let highestT = highestTemp.main.temp;
		let lowestT  = lowestTemp.main.temp;
		let highestH = highestHum.main.humidity;
		let lowestH  = lowestHum.main.humidity;
		for (let data of weatherData) {
			let tData = data.main.temp;
			let hData = data.main.humidity;
			if(highestT < tData) highestTemp = data;
			if(lowestT  > tData) lowestTemp = data;
			if(highestH < hData) highestHum = data;
			if(lowestH  > hData) lowestHum = data;
			sumTemp += tData;
			sumHum += hData;
		};
			let dateTempHigh = highestTemp.dt;
			let dateTempLow = lowestTemp.dt;

		return {
			temperature: {
				highest: Math.round(highestT),
				average: Math.round(sumTemp/weatherData.length),
				lowest:  Math.round(lowestT)
			},
			humidity: {
				highest: Math.round(highestH),
				average: Math.round(sumHum/weatherData.length),
				lowest:  Math.round(lowestH)
			},
			warmestTime: new Date(dateTempHigh * 1000),
			coldestTime: new Date(dateTempLow * 1000)
			}
		}
	}


let navService = {
	navItems: document.getElementsByClassName('nav-item'),
	navSearch: document.querySelector('#citySearchInput'),
	searchBtn: document.querySelector('#citySearchBtn'),
	pages: document.getElementById('pages').children,

	activateItem: function(item){
		for (let navItem of this.navItems) {
			navItem.classList.remove('active');
		} item.classList.add('active');
	},

	showPage(page){
		for (let pageEl of this.pages){
			pageEl.style.display = 'none';
		} page.style.display = "block";
	},

	addNavEvents(){
		for(let i = 0; i < this.navItems.length; i++){
			this.navItems[i].addEventListener("click", function(){
					navService.activateItem(this);
					navService.showPage(navService.pages[i]);
			})
		}
		this.searchBtn.addEventListener("click", function(e){
			e.preventDefault();
			apiService.city = navService.navSearch.value;
			apiService.getDataForecast();
			apiService.getDataCurrent();
		})
	}
}

let uiService = {
	homePage: document.querySelector(".homePage"),
	statisticsResult: document.querySelector(".statisticsResult"),
	tableResult: document.querySelector(".tableResult"),
	
	loadCurrentWeather: function(data){
		homePage.style.display = "block";
		homePage.innerHTML = `
		<div>
			<h5>The weather in ${apiService.city.charAt(0).toUpperCase() + apiService.city.slice(1)} at the moment is:<h5>
			<div><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png"></div>
			<div>${data.weather[0].description.charAt(0).toUpperCase() + data.weather[0].description.slice(1)}</div>
			<div>${Math.round(data.main.temp - 273.15)}&#8451;  (${Math.round(data.main.feels_like - 273.15)}&#8451;)</div>
		</div>`
	},

	loadStatistics: function(data){
		let statisticsData = apiService.getDataStats(data);
		statisticsResult.innerHTML = `
			<div class="row mx-auto" style="max-width: 37rem;">
				<div class="card bg-transparent mb-3 mx-auto" style="width: 18rem;">
					<div class="card-header">Temperature Statistics for ${apiService.city.charAt(0).toUpperCase() + apiService.city.slice(1)}</div>
					<div class="card-body">
						<div>Maximum temperature: ${statisticsData.temperature.highest}&#8451;</div>
						<div>Average temperature: ${statisticsData.temperature.average}&#8451;</div>
						<div>Lowest temperature:  ${statisticsData.temperature.lowest}&#8451;</div>
					</div>
				</div>
				<div class="card bg-transparent mb-3 mx-auto" style="width: 18rem;">
					<div class="card-header">Humidity statistics for ${apiService.city.charAt(0).toUpperCase() + apiService.city.slice(1)}</div>
					<div class="card-body">
						<div>Maximum humidity: ${statisticsData.humidity.highest} %</div>
						<div>Average humidity: ${statisticsData.humidity.average} %</div>
						<div>Lowest humidity:  ${statisticsData.humidity.lowest} %</div>
					</div>
				</div>
			</div>
			<div>
				<h6>Warmest time of the following period: ${statisticsData.warmestTime.toLocaleString()}</h3>
				<h6>Coldest time of the following period: ${statisticsData.coldestTime.toLocaleString()}</h3>
			</div>
		`;
	},

	loadHourlyWeather: function(data){
			let hourlyData = data.list;
			tableResult.innerHTML = "";
			for (let i = 0; i <= 20; i++) {
					let dateTime = new Date(hourlyData[i].dt * 1000);
					tableResult.innerHTML += `
					<div class="row">
							<div class="col-md-2"><img src="http://openweathermap.org/img/w/${hourlyData[i].weather[0].icon}.png"></div>
							<div class="col-md-2">${hourlyData[i].weather[0].description.charAt(0).toUpperCase() + hourlyData[i].weather[0].description.slice(1)}</div>
							<div class="col-md-2">${dateTime.toLocaleString()}</div>
							<div class="col-md-2">${Math.round(hourlyData[i].main.temp)}&#8451; (${Math.round(hourlyData[i].main.feels_like)}&#8451;)</div>
							<div class="col-md-2">${Math.round(hourlyData[i].main.humidity)} %</div>
							<div class="col-md-2">${hourlyData[i].wind.speed} km/h</div>
					</div>`;
			}
		}
	}


navService.addNavEvents();
apiService.getDataForecast();
apiService.getDataCurrent();