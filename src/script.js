function C(str) {
    return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

document.getElementById("press").addEventListener("click", () => {
    const query = document.getElementById("search").value
    if (!query) return;
    window.location.href = `https://duck.com/?q=${query}&iax=images&ia=images`
})

document.getElementById("press1").addEventListener("click", () => {
    const query = document.getElementById("search").value
    if (!query) return;
    window.location.href = `https://duck.com/?q=${'! ' + query}`
})


function HTTPWeather() {
    navigator.geolocation.getCurrentPosition(s => {
        const getLatLon = { lat: s.coords.latitude.toFixed(2), lon: s.coords.longitude.toFixed(2), at: s.coords.altitude || 90 };
        fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${getLatLon.lat}&lon=${getLatLon.lon}&altitude=${getLatLon.at}`)
            .then(r => r.json())
            .then(res => {
                function icon(weather) {
                    let result = "wi wi-"
                    const otherIcons = {
                        // unsupported icons
                        "lightsleet": "snow",
                        "lightrain": "rain",
                        "fair": "sunny"
                    }
                    const otherIconsNight = {
                        "fair": "clear"
                    }
                    const splied = weather.split("_")
                    result += splied[1] + "-"
                    if (!otherIcons[splied[0]] ||  !otherIconsNight[splied[0]]) {
                        result += splied[0]
                    } else if (splied[1] == "night") {
                        result += otherIconsNight[splied[0]]
                    } else {
                        result += otherIcons[splied[0]]
                    }
                    const wicon = document.getElementById("weather-icon")
                    wicon.setAttribute("class", result)
                    wicon.setAttribute("title", C(splied[0]))
                }
                const details = res.properties.timeseries[0].data.instant.details
                const time = res.properties.timeseries[0].time
                const wicon = res.properties.timeseries[0].data["next_1_hours"].summary['symbol_code']
                const celsus = details['air_temperature']
                icon(wicon)
                const w = document.getElementById("weather")
                w.innerHTML = `${Math.round(celsus).toString()}&deg;C`
            })
            .catch(err => {
                console.error(err)
                document.getElementById("weather").innerHTML = "Unknown"
            })
    }, err => {
        console.error(err)
        document.getElementById("weather").innerHTML = "Unknown"
    })
}

function randomQuote() {
    const storage = window.localStorage
    function changeQuote() {
        const json = storage.getItem("quotes")
        const j = JSON.parse(json)
        const pick = Math.floor(Math.random() * j.length)
        const picked = j[pick]
        document.getElementById("random").innerHTML = picked.h
    }
    if (!storage.getItem("quotes")) {
        fetch("https://zenquotes.io/api/quotes").then(r => r.json())
            .then(res => {
                storage.setItem("quotes", JSON.stringify(res))
                changeQuote()
            })
            .catch(console.error)
    } else changeQuote()
}

function time() {
    function zero(num) {
        if (num.toString().length == 1) {
            return "0" + num
        } else return num
    }
    const date = new Date()
    const clock = document.getElementById("clock")
    clock.innerHTML = `${zero(date.getHours())}:${zero(date.getMinutes())}:${zero(date.getSeconds())}`
    clock.setAttribute("title", date.toDateString())
}
function quickstartload() {
    const localStorage = window.localStorage
    if (!localStorage.quickstart) {
        const quickstartBasic = [
            {
                "title": "YouTube",
                "url": "https://youtube.com"
            },
            {
                "title": "Reddit",
                "url": "https://reddit.com"
            },
            {
                "title": "Facebook",
                "url": "https://facebook.com"
            },
            {
                "title": "Instagram",
                "url": "https://instagram.com"
            },
            {
                "title": "GitHub",
                "url": "https://github.com"
            }
        ]
        localStorage.setItem("quickstart", JSON.stringify(quickstartBasic))
    }
    const quickstart = JSON.parse(localStorage.quickstart)
    if (!quickstart) {
        console.error("there's something went wrong here")
    }
    for (const obj of quickstart) {
        document.getElementById("quickstart").innerHTML += `
            <li>
                <p><a href=${obj.url}>${obj.title}</a></p>
                <img src="https://s2.googleusercontent.com/s2/favicons?domain=${obj.url}></img>
            </li>
        `
    }
}

quickstartload()
time()
HTTPWeather()
randomQuote()
setInterval(time, 1000)
setInterval(randomQuote, 30000)
setInterval(HTTPWeather, 30 * 60 * 1000) // refreshes 30 minutes

document.getElementById("search").focus()
