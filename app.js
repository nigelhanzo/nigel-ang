const apiKey = "914f5fdada61a092fb10fb8414f2da01";

const locations = [
{
name:"Puchong",
id:"puchong"
},
{
name:"Kuala Lumpur",
id:"kl"
},
{
name:"Klang",
id:"klang"
},
{
name:"Shah Alam",
id:"shahalam"
}
];

const quotes = [

"Every system is perfectly designed to get the results it gets.",
"Simplicity is prerequisite for reliability.",
"Good architecture enables change.",
"Architecture is the decisions you wish you could get right early.",
"The best technology is invisible to the user.",
"First solve the problem. Then write the code.",
"Make it work. Make it right. Make it fast.",
"Complexity is easy. Simplicity is hard.",
"Design for change, not perfection.",
"The goal of architecture is optionality."

];

/* ==================================
   CLOCK
================================== */

function updateClock(){

document.getElementById("clock").innerHTML =
new Date().toLocaleString();

}

/* ==================================
   GREETING
================================== */

function loadGreeting(){

const hour =
new Date().getHours();

let greeting = "";

if(hour < 12){

greeting = "☀ Good Morning Nigel";

}
else if(hour < 18){

greeting = "🌤 Good Afternoon Nigel";

}
else{

greeting = "🌙 Good Evening Nigel";

}

document.getElementById("greeting").innerHTML =
greeting;

}

/* ==================================
   HERO THEMES
================================== */

function setHeroTheme(theme){

const hero =
document.getElementById("hero");

switch(theme){

case "morning":

hero.style.backgroundImage =
"url('assets/hero-morning.jpg')";
break;

case "afternoon":

hero.style.backgroundImage =
"url('assets/hero-afternoon.jpg')";
break;

default:

hero.style.backgroundImage =
"url('assets/hero-evening.jpg')";

}

}

function autoHeroTheme(){

const hour =
new Date().getHours();

if(hour < 12){

setHeroTheme("morning");

}
else if(hour < 18){

setHeroTheme("afternoon");

}
else{

setHeroTheme("evening");

}

}

/* ==================================
   QUOTES
================================== */

function loadQuote(){

const randomQuote =
quotes[Math.floor(
Math.random() * quotes.length
)];

document.getElementById("quote").innerHTML =
randomQuote;

}

/* ==================================
   WEATHER ICONS
================================== */

function weatherIcon(condition){

condition =
condition.toLowerCase();

if(condition.includes("rain"))
return "🌧";

if(condition.includes("thunder"))
return "⛈";

if(condition.includes("cloud"))
return "☁";

if(condition.includes("clear"))
return "☀";

if(condition.includes("mist"))
return "🌫";

return "🌤";

}

/* ==================================
   COMMUTE SCORE
================================== */

function commuteScore(rainRisk){

if(rainRisk <= 20)
return "🟢 9/10 Excellent";

if(rainRisk <= 40)
return "🟡 7/10 Good";

if(rainRisk <= 70)
return "🟠 5/10 Fair";

return "🔴 2/10 Poor";

}

/* ==================================
   WEATHER
================================== */

async function loadForecast(){

let highestRain = 0;
let highestTemp = 0;
let lowestTemp = 999;
let overallSummary = "";

for(const location of locations){

try{

const response =
await fetch(
`https://api.openweathermap.org/data/2.5/forecast?q=${location.name},MY&units=metric&appid=${apiKey}`
);

const data =
await response.json();

const morning =
data.list.find(
x => x.dt_txt.includes("06:00:00")
);

const noon =
data.list.find(
x => x.dt_txt.includes("12:00:00")
);

const evening =
data.list.find(
x => x.dt_txt.includes("18:00:00")
);

if(!morning || !noon || !evening){
continue;
}

const rainRisk =
Math.round(
(evening.pop || 0) * 100
);

highestRain =
Math.max(highestRain,rainRisk);

highestTemp =
Math.max(
highestTemp,
morning.main.temp,
noon.main.temp,
evening.main.temp
);

lowestTemp =
Math.min(
lowestTemp,
morning.main.temp,
noon.main.temp,
evening.main.temp
);

overallSummary =
evening.weather[0].description;

let badgeClass = "badge-green";
let badgeText = "LOW RISK";

if(rainRisk >= 70){

badgeClass = "badge-red";
badgeText = "STORM ALERT";

}
else if(rainRisk >= 40){

badgeClass = "badge-yellow";
badgeText = "SHOWERS";

}

document.getElementById(location.id).innerHTML = `

<div class="weather-header">

<div class="location-name">
${location.name}
</div>

<div class="weather-badge ${badgeClass}">
${badgeText}
</div>

</div>

<div class="time-row">

<div>
<div class="time-icon">${weatherIcon(morning.weather[0].main)}</div>
🌅 MORNING<br>
${morning.weather[0].main}
</div>

<div class="time-temp">
${Math.round(morning.main.temp)}°C
</div>

</div>

<div class="time-row">

<div>
<div class="time-icon">${weatherIcon(noon.weather[0].main)}</div>
🌞 LUNCH<br>
${noon.weather[0].main}
</div>

<div class="time-temp">
${Math.round(noon.main.temp)}°C
</div>

</div>

<div class="time-row">

<div>
<div class="time-icon">${weatherIcon(evening.weather[0].main)}</div>
🌆 EVENING<br>
${evening.weather[0].main}
</div>

<div class="time-temp">
${Math.round(evening.main.temp)}°C
</div>

</div>

<div class="rain-risk">
☂ Rain Risk: ${rainRisk}%
</div>

<div class="commute-score">
🏍 Commute Score: ${commuteScore(rainRisk)}
</div>

`;

}
catch(error){

document.getElementById(location.id)
.innerHTML =
"Unable to load weather.";

}

}

document.getElementById("todayConditions").innerHTML = `

Highest Temperature:
<b>${Math.round(highestTemp)}°C</b>

<br><br>

Lowest Temperature:
<b>${Math.round(lowestTemp)}°C</b>

<br><br>

Sunrise:
<b>7:00 AM</b>

<br><br>

Sunset:
<b>7:25 PM</b>

<br><br>

Overall:
<b>${overallSummary}</b>

`;

updateRecommendations(highestRain);

}

/* ==================================
   RECOMMENDATIONS
================================== */

function updateRecommendations(highestRain){

let recommendation = "";
let commuteMessage = "";

if(highestRain >= 70){

recommendation = `
<h3>⛈ Storm Alert</h3>
<br>
Morning: Dry riding conditions expected.
<br><br>
Lunch: Warm weather expected.
<br><br>
Evening: Thunderstorms likely after 4PM.
<br><br>
<b>Recommendation:</b>
🧥 Bring rain gear and expect wet roads.
`;

commuteMessage = `
🚨 Evening commute likely affected.
<br><br>
Consider leaving before 4PM.
`;

}
else if(highestRain >= 40){

recommendation = `
<h3>🌦 Showers Possible</h3>
<br>
Morning: Generally clear.
<br><br>
Lunch: Warm weather expected.
<br><br>
Evening: Possible showers.
<br><br>
<b>Recommendation:</b>
Carry rain gear just in case.
`;

commuteMessage = `
🌦 Possible delays due to showers.
<br><br>
Keep rain gear accessible.
`;

}
else{

recommendation = `
<h3>🏍 Excellent Riding Conditions</h3>
<br>
Morning: Dry conditions.
<br><br>
Lunch: Sunny weather.
<br><br>
Evening: Low rain probability.
<br><br>
<b>Recommendation:</b>
Enjoy the ride.
`;

commuteMessage = `
🏍 Excellent commuting conditions.
<br><br>
No major weather concerns.
`;

}

document.getElementById("recommendation").innerHTML =
recommendation;

document.getElementById("commuteRecommendation").innerHTML =
commuteMessage;

}

/* ==================================
   NEWS FEEDS
================================== */

async function loadNews(){

loadBankingNews();
loadTechNews();
loadAiNews();

}

async function loadBankingNews(){

try{

document.getElementById("bankingNews").innerHTML =
"Loading...";

const feed =
encodeURIComponent(
"https://www.finextra.com/rss/headlines.aspx"
);

const response =
await fetch(
`https://api.rss2json.com/v1/api.json?rss_url=${feed}`
);

const data =
await response.json();

renderNews(
"bankingNews",
data.items.slice(0,3)
);

}
catch(error){

document.getElementById("bankingNews").innerHTML =
"Unable to load banking news.";

}

}

async function loadTechNews(){

try{

document.getElementById("techNews").innerHTML =
"Loading...";

const feed =
encodeURIComponent(
"https://azure.microsoft.com/en-us/blog/feed/"
);

const response =
await fetch(
`https://api.rss2json.com/v1/api.json?rss_url=${feed}`
);

const data =
await response.json();

renderNews(
"techNews",
data.items.slice(0,3)
);

}
catch(error){

document.getElementById("techNews").innerHTML =
"Unable to load technology news.";

}

}

async function loadAiNews(){

try{

document.getElementById("aiNews").innerHTML =
"Loading...";

const feed =
encodeURIComponent(
"https://openai.com/news/rss.xml"
);

const response =
await fetch(
`https://api.rss2json.com/v1/api.json?rss_url=${feed}`
);

const data =
await response.json();

renderNews(
"aiNews",
data.items.slice(0,3)
);

}
catch(error){

document.getElementById("aiNews").innerHTML =
"Unable to load AI news.";

}

}

function renderNews(elementId, articles){

const html =
articles.map(article => `

<div class="news-item">

<a href="${article.link}" target="_blank">

${article.title}

</a>

</div>

`).join("");

document.getElementById(elementId).innerHTML =
`<div class="news-list">${html}</div>`;

}

/* ==================================
   INIT
================================== */

updateClock();
loadGreeting();
loadQuote();
autoHeroTheme();
loadForecast();
loadNews();

setInterval(updateClock,1000);
setInterval(loadGreeting,60000);
setInterval(loadForecast,900000);
setInterval(autoHeroTheme,300000);
setInterval(loadNews,1800000);
