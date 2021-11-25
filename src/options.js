function load() {
    const config = window.localStorage
    const enable = JSON.parse(config.enableQuickstart)
    if (enable) {
        document.getElementById("enableQuickstart").setAttribute("checked", '')
    } else return;
    quickstartList()
}

function newQuickstart() {
    saveQuickstart()
    const nou = {
        "title": "New Title",
        "url": "https://example.com"
    }
    const json = JSON.parse(window.localStorage.quickstart)
    json.push(nou)
    window.localStorage.setItem("quickstart", JSON.stringify(json))
    quickstartList()
}

function loadFromBookmarks() {
    chrome.bookmarks.getTree().then(r => {
        if (r.length < 1 || r[0].children.length < 1 ||
            r[0].children[0].children.length < 1) {
            return alert("Looks like you have empty bookmarks.")
        }
        const holup = confirm("Do you want to load from bookmarks? Your current quick shortcut will be overwritten.")
        if (!holup) return;
        const element = r[0].children[0].children.filter(m => !m.children)
        let result = []
        for (const obj of element) {
            result.push({
                "title": obj.title,
                "url": obj.url
            })
            window.localStorage.setItem("quickstart", JSON.stringify(result))
        }
        quickstartList()
        document.getElementById("saveConfig").setAttribute("value", "Saved!")
        setTimeout(() => document.getElementById("saveConfig").setAttribute("value", "Save"), 2000)
    })
}

function removeQuickstart(e) {
    saveQuickstart()
    const ID = e.target.id.slice(16)
    const json = JSON.parse(window.localStorage.quickstart)
    json.splice(ID, 1)
    window.localStorage.setItem("quickstart", JSON.stringify(json))
    quickstartList()
}

function quickstartList() {
    document.getElementById("quickstart-list").innerHTML = ''
    let general = `<button id="newquick">New</button>
    <button id="loadbookmarks">Load from Bookmarks</button>
    <ul style="display: flex; justify-content: center; flex-direction: column; list-style-type: none;">`
    const quickstart = JSON.parse(window.localStorage.quickstart)
    if (quickstart.length < 1) general += "<p>Empty quickstart</p>"
    else {
        let count = 0
        for (const obj of quickstart) {
            general += `
                <li style="margin: 10px;">
                <label for="quickstartTitle${count}">Title</form>
                <input type="text" id="quickstartTitle${count}" value="${obj.title}">
                <label for="quickstartUrl${count}">URL</form>
                <input type="text" id="quickstartUrl${count}" value="${obj.url}">
                <input type="button" id="quickstartRemove${count}" value="Remove">
                </li>
            `
            count++
        }
        general += "</ul>"
        setTimeout(() => {
            // I added 1s delay due to not loading stuff before this.
            const removeButtons = !document.querySelectorAll("[id^='quickstartRemove']") ? [] : Array.from(document.querySelectorAll('[id^="quickstartRemove"]'))
            for (const button of removeButtons) {
                button.addEventListener("click", removeQuickstart)
            }
        }, 1000)
    }
    document.getElementById("quickstart-list").innerHTML = general
    document.getElementById("newquick").addEventListener("click", newQuickstart)
    document.getElementById("loadbookmarks").addEventListener("click", loadFromBookmarks)
}

document.getElementById("enableQuickstart").addEventListener("change", () => {
    const enable = JSON.parse(window.localStorage.enableQuickstart)
    if (!enable) {
        window.localStorage.setItem("enableQuickstart", "true")
        quickstartList()
    } else {
        window.localStorage.setItem("enableQuickstart", "false")
        document.getElementById("quickstart-list").innerHTML = ''
    }
})
function saveQuickstart() {
    let count = 0;
    let result = []
    const stop = setInterval(() => {
        const title = document.getElementById("quickstartTitle" + count)
        const url = document.getElementById("quickstartUrl" + count)
        if (!title && !url) clearInterval(stop);
        else {
            result.push({
                "title": title.value,
                "url": url.value
            })
            window.localStorage.setItem("quickstart", JSON.stringify(result))
        }
        count++
    }, 20)
}

document.getElementById("saveConfig").addEventListener("click", () => {
    saveQuickstart()
    document.getElementById("saveConfig").setAttribute("value", "Saved!")
    setTimeout(() => document.getElementById("saveConfig").setAttribute("value", "Save"), 2000)
})

load()