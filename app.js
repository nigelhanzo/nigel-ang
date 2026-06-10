const apiKey = "914f5fdada61a092fb10fb8414f2da01";

const cities = [
{
name:"Puchong",
id:"puchong"
},
{
name:"Kuala Lumpur",
id:"kl"
},
{
name:"Selangor",
id:"selangor"
},
{
name:"Klang",
id:"klang"
}
];

async function loadWeather(){

for(const city of cities){

try{

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/weather?q=${city.name},MY&units=metric&appid=${apiKey}`
);

const data = await response.json();

document.getElementById(city.id).innerHTML = `
<div class="city">${city.name}</div>
<div class="temp">${Math.round(data.main.temp)}°C</div>
<div>${data.weather[0].main}</div>
<div>Humidity ${data.main.humidity}%</div>
`;

}
catch(err){

document.getElementById(city.id).innerHTML =
"Weather unavailable";

}

}

}

function updateClock(){

document.getElementById("clock").innerHTML =
new Date().toLocaleString();

}

function greeting(){

const hour = new Date().getHours();

let msg="";

if(hour<12)
msg="☀ Good Morning Nigel";

else if(hour<18)
msg="🌤 Good Afternoon Nigel";

else
msg="🌙 Good Evening Nigel";

document.getElementById("greeting").innerHTML =
msg;

}

loadWeather();
updateClock();
greeting();

setInterval(updateClock,1000);
setInterval(loadWeather,900000);