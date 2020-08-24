let searchHistory = localStorage.getItem('searchHistory')
  ? JSON.parse(localStorage.getItem('searchHistory'))
  : []

function buildCurrent(data) {
  let currentCity = document.getElementById('city')
  let temp = document.getElementById('temp')
  let wind = document.getElementById('wind')
  let humidity = document.getElementById('humidity')
  // let uv = document.getElementById('uv')
  let icon = `<img class="imgLarge" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"> `
  currentCity.innerHTML = `${data.name} ${moment().format(
    '(M/DD/YYYY)'
  )} ${icon}`
  temp.innerHTML = `Temperature: ${data.main.temp}° F`
  wind.innerHTML = `Wind Speed: ${data.wind.speed} MPH`
  humidity.innerHTML = `Humidity: ${data.main.humidity}%`
  // TODO: UV
}

function buildList(data) {
  let children = []
  for (i = 1; i < data.list.length; i++) {
    let { dt, temp, humidity, weather } = data.list[i]
    let date = moment.unix(dt).format('M/DD/YYYY')
    children.push(`
        <div class="col">
            <div class="card forecast">
                <div class="card-body">
                    <h6 class="card-title">${date}</h6>
                    <img class="imgLarge" src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png">
                    <p class="card-text"><small>Temp:</small> ${temp.day} °F</p>
                    <p class="card-text"><small>Humidity:</small> ${humidity}%</p>
                </div>
            </div>
        </div>
   `)
  }
  document.getElementById('forecastList').innerHTML = children.join('')
}

function getWeather(city) {
  let key = '8543cf22791cbfe54eaa20de24e2e20b'
  let queryURL = `https://api.openweathermap.org/data/2.5/forecast/daily/?q=${city}&cnt=6&appid=${key}&units=imperial`
  let otherURL = `https://api.openweathermap.org/data/2.5/weather/?q=${city}&appid=${key}&units=imperial`

  fetch(otherURL)
    .then((response) => response.json())
    .then((data) => buildCurrent(data))

  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => buildList(data))
}

function buildSearchHistory() {
  let list = document.getElementById('list')
  list.innerHTML = ''
  searchHistory.forEach((search) => {
    let listItem = document.createElement('li')
    listItem.className = 'list-group-item'
    listItem.innerHTML = search
    listItem.addEventListener('click', () => {
      getWeather(search)
    })
    list.appendChild(listItem)
  })
}

let search = document.getElementById('searchBtn')
let input = document.getElementById('searchInput')
let city = ''

input.addEventListener('change', (e) => {
  city = e.target.value
})

search.addEventListener('click', () => {
  getWeather(city)
  searchHistory.push(city)
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  buildSearchHistory()
})

buildSearchHistory()
