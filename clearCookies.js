var ext_api = (typeof browser === 'object') ? browser : chrome;

window.localStorage.clear();
sessionStorage.clear();

// send domain to background.js (to clear cookies)
ext_api.runtime.sendMessage({
    domain: document.domain
});

let msg = "Cookies (and local storage) removed from " + document.domain;
showMessage(msg, 2000);

function showMessage(msg, duration) {
    var el = document.createElement("div");
    el.setAttribute("style", "position:fixed;top:40%;left:40%;z-index:99;padding:4px;font-family: Arial, sans-serif;font-size:18px;color:white;background-color:blue;");
    el.innerText = msg;
    setTimeout(function () {
        el.parentNode.removeChild(el);
    }, duration);
    document.body.appendChild(el);
}