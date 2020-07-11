var currentDate;
var previousDate;

// checking if the input #city was filled in
function inputValidation() {
    var inputValue = document.getElementById("city").value;
    inputValue = inputValue.trim();
    return inputValue != null && inputValue != "";
}

// adding chosen city name in the header
function insertCity(cityName) {
  var header = document.getElementById("cityName");
  header.innerText = cityName;
  header.style.display = "block";
}

// get data
function getWeather() {
    var result = null;
    var inputValue = document.getElementById("city").value;
    if(inputValidation()) {
        result = fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + inputValue + "&lang=pl&appid=PUT_YOUR_API_KEY_HERE")
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonData) {
            if(jsonData.cod === "200") {
                var index = 0;
                jsonData.list.forEach(function(item) {
                  addNewTableIfNewDate(previousDate, new Date(item.dt).day);
                  addDate(dateFormat(item.dt), index === 0);
                  addTemp(convertTemp(item.main.temp));
                  addIcon(item.weather[0].icon);
                  addDesc(item.weather[0].description);
                  index++;
                })
                insertCity(jsonData.city.name);
            }
            else {
              alert("Dane nie istnieją")
            }
        })
        .catch(function(error) {
          alert("Coś poszło nie tak " + error)
        })
    }
    return result;
}

//checking date
function addNewTableIfNewDate(prevDate, currentDate) {
  if (prevDate != currentDate || previousDate == null) {
    var newTable = document.createElement("table");
    newTable.setAttribute("id", currentDate);
  }
  prevDate = currentDate;
}

// adding DOM element - date and hour 
function addDate(value) {
  var tableHeader = document.createElement("th");
  tableHeader.setAttribute("class", "date");
  tableHeader.innerText = value;
  var dateRes = document.querySelectorAll("#forecastDate");

  for(i=0; i<dateRes.length; i++) {
    dateRes[i].appendChild(tableHeader);
  }
}

// timestamp to datetime
function dateFormat(value) {
  var date = new Date(value * 1000);
  var day = date.getDate();
  var month = date.getMonth()+1;
  month = month >= 10 ? month : "0" + month;
  var year = date.getFullYear();
  var hour = date.getHours();
  var hour = (hour >=10) ? hour : "0" + hour;
  return `${day}.${month}.${year}
  ${hour}:00`;
}

//adding DOM element - temperature
function addTemp(value) {
  var temp = document.createElement("td");
  temp.setAttribute("class", "temp");
  temp.innerText = value;
  var tempRes = document.querySelectorAll("#temp");

  for (i=0; i<tempRes.length; i++) {
    tempRes[i].appendChild(temp);
  }
}

//converting temparature from Kelvin to Celsius
function convertTemp(value) {
  var celsius = Math.round(value - 273.15);
  return `${celsius}°C`;
}

//adding DOM element - icon
function addIcon(value) {
  var icon = document.createElement("td");
  icon.setAttribute("class", "icon");
  icon.innerHTML = "<img src='http://openweathermap.org/img/w/" + value +".png' />";
  var iconRes = document.querySelectorAll("#icon");

  for(i=0; i<iconRes.length; i++) {
    iconRes[i].appendChild(icon);
  }
}

//adding DOM element - description
function addDesc(value) {
  var desc = document.createElement("td");
  desc.setAttribute("class", "desc");
  desc.innerText = value;
  var descRes = document.querySelectorAll("#description");

  for(i=0; i<descRes.length; i++) {
    descRes[i].appendChild(desc);
  }
}