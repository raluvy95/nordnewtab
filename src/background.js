chrome.runtime.onMessage.addListener(req => {
    if(req == "NordNewTabOption") {
        window.open(chrome.runtime.getURL('options.html'));
    }
})