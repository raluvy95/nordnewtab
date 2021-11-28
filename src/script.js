function C(str) {
    return str.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
}

function HTTPWeather() {
    if (checkEnable("weather", "weather")) {
        navigator.geolocation.getCurrentPosition(s => {
            const getLatLon = { lat: s.coords.latitude.toFixed(2), lon: s.coords.longitude.toFixed(2), at: s.coords.altitude || 90 };
            fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${getLatLon.lat}&lon=${getLatLon.lon}&altitude=${getLatLon.at}`)
                .then(r => r.json())
                .then(res => {
                    function icon(weather, time) {
                        let result = "wi wi-"
                        const splied = weather.split("_")
                        let whatitis = splied[1]
                        if (!whatitis) {
                            const time1 = new Date(time)
                            const hour = time1.getHours()
                            if (hour >= 8 && hour < 18) {
                                whatitis = "day"
                            } else whatitis = "night-alt"
                        }
                        const otherIcons = {
                            // convert from API to weather icon compartible.
                            "lightsleet": "snow",
                            "lightrain": "rain",
                            "fair": "cloudy",
                            "heavyrain": "rain",
                            "heavyrainandthunder": "thunderstorm",
                            "heavyrainshowers": "rain",
                            "heavysleet": "sleet",
                            "heavysleetandthunder": "sleet-storm",
                            "heavysleetshowersandthunder": "sleet-storm",
                            "heavysnow": "snow",
                            "heavysnowandthunder": "snow-thunderstorm",
                            "heavysnowshowers": "snow",
                            "heavysnowshowersandthunder": "snow-thunderstorm",
                            "lightrain": "rain",
                            "lightrainandthunder": "thunderstorm",
                            "lightrainshowers": "rain",
                            "lightrainshowersandthunder": "thunderstorm",
                            "lightsleet": "sleet",
                            "lightsleetandthunder": "sleet-storm",
                            "lightsleetshowers": "sleet",
                            "lightsnow": "snow",
                            "lightsnowandthunder": "snow-thunderstorm",
                            "lightssleetshowersandthunder": "sleet-thunderstorm",
                            "lightssnowshowersandthunder": "snow-thunderstorm",
                            "partlycloudy": "cloudy",
                            "rainandthunder": "thunderstorm",
                            "rainshowers": "rain",
                            "rainshowersandthunder": "thunderstorm",
                            "sleetandthunder": "sleet-storm",
                            "sleetshowers": "sleet",
                            "snowandthunder": "snow-thunderstorm",
                            "snowshowers": "snow",
                            "snowshowersandthunder": "snow-thunderstorm",
                            "clearsky": whatitis == "day" ? "sunny" : "clear"
                        }
                        result += whatitis + "-"
                        if (!otherIcons[splied[0]]) {
                            result += splied[0]
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
                    icon(wicon, time)
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
    } else {
        document.getElementById("weather")?.remove()
        document.getElementById("weather-icon")?.remove()
        document.getElementById("dots")?.remove()
    }
}

function randomQuote() {
    if (checkEnable("random", "quote")) {
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
}

function checkEnable(element, value) {
    return (document.getElementById(element) && (window.localStorage.shows ? JSON.parse(window.localStorage.shows)[value] : true))
}

function time() {
    if (checkEnable("clock", "clock")) {
        function zero(num) {
            if (num.toString().length == 1) {
                return "0" + num
            } else return num
        }
        const date = new Date()
        const clock = document.getElementById("clock")
        clock.innerHTML = `${zero(date.getHours())}:${zero(date.getMinutes())}:${zero(date.getSeconds())}`
        clock.setAttribute("title", date.toDateString())
    } else {
        document.getElementById("clock")?.remove()
        document.getElementById("dots")?.remove()
    }
}

function loadLayout() {
    const localStorage = window.localStorage

    let layout = localStorage.layout ? localStorage.layout : null
    if (!layout) {
        layout = "withSearch"
        localStorage.setItem("layout", "withSearch")
    } else {
        layout = layout
    }
    fetch(chrome.runtime.getURL(`src/layouts/${layout}.html`)).then(r => r.text()).then(r => {
        document.getElementById("layout").innerHTML = r
    })
}

function load() {
    const localStorage = window.localStorage
    if (document.getElementById("search")) {
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
    }

    let enableQuickstart = localStorage.enableQuickstart
    if (!enableQuickstart) {
        enableQuickstart = "true"
        localStorage.setItem("enableQuickstart", "true")
    } else if (!JSON.parse(enableQuickstart)) return;
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
    if (document.getElementById("quickstart")) {
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

    document.getElementById("customTitle").innerHTML = localStorage.title || "New Tab"

    document.getElementById("search")?.focus()
    if (checkEnable("settings", "option")) {
        document.getElementById("settings").addEventListener("click", () => {
            window.open(chrome.runtime.getURL('src/options.html'));
        })
    } else {
        const element = document.getElementById("settings")
        if (element) {
            element.remove()
        }
    }

    time()
    HTTPWeather()
    randomQuote()

    setInterval(time, 1000)
    setInterval(randomQuote, 30000)
    setInterval(HTTPWeather, 30 * 60 * 1000) // refreshes 30 minutes
}

loadLayout()
setTimeout(load, 100)