let navService = {
    navItems: document.getElementsByClassName("nav-item"),
    navSearch: document.getElementById("citySearchInput"),
    searchBtn: document.getElementById("citySearchBtn"),
    pages: document.getElementById("pages").children,
    activateItem: function(item){
        for (let navItem of this.navItems) {
            navItem.classList.remove("active");
        }
        item.classList.add("active");
    },
    showPage(page){
        for (let pageElement of this.pages) {
            pageElement.style.display = "none";
        }
        page.style.display = "block";
    }, 
    registerNavListeners(){
        for(let i = 0; i < this.navItems.length; i++){
            this.navItems[i].addEventListener("click", function(){
                navService.activateItem(this);
                navService.showPage(navService.pages[i]);
            })
        }
        this.searchBtn.addEventListener("click", function(e){
            e.preventDefault();
						weatherService.city = navService.navSearch.value;
						weatherService.getDataForecast();
						weatherService.getDataCurrent();
        })
        
    }
}

let weatherService = {
    apiKey: "fb53d4003145d769efdfa6f63e9f8cec",
    city: "Skopje",
		apiUrl: "https://api.openweathermap.org/data/2.5/",
		dataTypeForecast: "forecast",
		dataTypeCurrent: "weather",
    currentData: {}, 
    getDataForecast: function(){
        $.ajax({
            url: `${this.apiUrl}${this.dataTypeForecast}?q=${this.city}&units=metric&APPID=${this.apiKey}`,
            success: function (response) {
                console.log('The request succeeded!');
                console.log(response);
                uiService.loadStatistics(response);
                uiService.loadHourlyTable(response);
            }, 
            error: function(response){
                console.log('The request failed!');
                console.log(response.responseText);
            }
        });
		},
		getDataCurrent: function(){
			$.ajax({
					url: `${this.apiUrl}${this.dataTypeCurrent}?q=${this.city}&appid=${this.apiKey}`,
					success: function (response) {
							console.log('The request succeeded!');
							console.log(response);
							uiService.loadCurrentWeather(response);
					}, 
					error: function(response){
							console.log('The request failed!');
							console.log(response.responseText);
					}
			});
	},
		
    aggregateStatistics: function(data){
        let temperatureSum = 0;
        let highestTemp = data.list[0];
        let lowestTemp = data.list[0];
        let humiditySum = 0;
        let highestHumidity = data.list[0];
        let lowestHumidity = data.list[0];
        for (let reading of data.list) {
            temperatureSum += reading.main.temp;
            humiditySum += reading.main.humidity;
            if(highestTemp.main.temp < reading.main.temp) highestTemp = reading;
            if(lowestTemp.main.temp > reading.main.temp) lowestTemp = reading;
            if(highestHumidity.main.humidity < reading.main.humidity) highestHumidity = reading;
            if(lowestHumidity.main.humidity > reading.main.humidity) lowestHumidity = reading;
        }
        return {
            temperature:{
                highest: Math.round(highestTemp.main.temp),
                average: Math.round(temperatureSum/data.list.length),
                lowest: Math.round(lowestTemp.main.temp)
            },
            humidity:{
                highest: Math.round(highestHumidity.main.humidity),
                average: Math.round(humiditySum/data.list.length),
                lowest: Math.round(lowestHumidity.main.humidity)
            },
            warmestTime: helperService.unixTimeStampToDate(highestTemp.dt),
            coldestTime: helperService.unixTimeStampToDate(lowestTemp.dt)
        }
		},

}

let uiService = {
		homePage: document.getElementById("homePage"),
    statisticsResult: document.getElementById("statisticsResult"),
		tableResult: document.getElementById("tableResult"),
		homeMain: document.getElementById('home'),
		loadCurrentWeather: function(data){
			let readings = data;
			this.homePage.style.display = "block";
			this.homePage.innerHTML = `
			<div>
			<h5>The weather in ${weatherService.city} at the moment is:<h5>
			<div><img src="http://openweathermap.org/img/w/${readings.weather[0].icon}.png"></div>
			<div>${readings.weather[0].description}</div>
			<div>${Math.round(readings.main.temp - 273.15)} C (${Math.round(readings.main.feels_like - 273.15)} C)</div>
	</div>
			`
		},
    loadStatistics: function(data){
        let statisticsData = weatherService.aggregateStatistics(data);
				this.statisticsResult.innerHTML = `
				<div class="row mx-auto" style="max-width: 37rem;">
				<div class="card bg-transparent mb-3 mx-auto" style="width: 18rem;">
  				<div class="card-header">Temperature Statistics for ${weatherService.city}</div>
  				<div class="card-body">
						<div>Maximum temperature: ${statisticsData.temperature.highest} C</div>
						<div>Average temperature: ${statisticsData.temperature.average} C</div>
						<div>Lowest temperature: ${statisticsData.temperature.lowest} C</div>
					</div>
				</div>
				
				<div class="card bg-transparent mb-3 mx-auto" style="width: 18rem;">
					<div class="card-header">Humidity statistics for ${weatherService.city}</div>
					<div class="card-body">
						<div>Maximum humidity: ${statisticsData.humidity.highest} %</div>
						<div>Average humidity: ${statisticsData.humidity.average} %</div>
						<div>Lowest humidity: ${statisticsData.humidity.lowest} %</div>
					</div>
				</div>
				</div>
				
				<div>
        	<h6>Warmest time of the following period: ${statisticsData.warmestTime.toLocaleString()}</h3>
					<h6>Coldest time of the following period: ${statisticsData.coldestTime.toLocaleString()}</h3>
				</div>
		
        `;
    },
    loadHourlyTable: function(data){
        let readings = data.list;
				tableResult.innerHTML = "";
				
        for (let i = 0; i <= 20; i++) {
            let dateTime = helperService.unixTimeStampToDate(readings[i].dt);
            tableResult.innerHTML += `
            <div class="row">
                <div class="col-md-2"><img src="http://openweathermap.org/img/w/${readings[i].weather[0].icon}.png"></div>
                <div class="col-md-2">${readings[i].weather[0].description}</div>
                <div class="col-md-2">${dateTime.toLocaleString()}</div>
                <div class="col-md-2">${Math.round(readings[i].main.temp)} C (${Math.round(readings[i].main.feels_like)} C)</div>
                <div class="col-md-2">${Math.round(readings[i].main.humidity)} %</div>
                <div class="col-md-2">${readings[i].wind.speed} km/h</div>
            </div>
            `;
				}
			}
    }


let helperService = {
    unixTimeStampToDate: function(unixTimeStamp){
        return new Date(unixTimeStamp * 1000);
    }
}

navService.registerNavListeners();
weatherService.getDataForecast();
weatherService.getDataCurrent();