"use strict";
var ext_api = chrome || browser;

window.addEventListener("load", function () {
    var opt_in_enabled = document.getElementById('opt-in-enabled');
    ext_api.storage.sync.get("optIn", function (result) {
        opt_in_enabled.innerText = result.optIn ? 'YES' : 'NO';
    });

    document.getElementById("button-enable").addEventListener(
        "click",
        function () {
        ext_api.storage.sync.set({
            "optIn": true,
            "optInShown": true
        });
        opt_in_enabled.innerText = 'YES';
        setTimeout(function () {
            window.close();
        }, 800);
    });

    document.getElementById("button-cancel").addEventListener(
        "click",
        function () {
        ext_api.storage.sync.set({
            "optIn": false,
            "optInShown": true
        });
        opt_in_enabled.innerText = 'NO';
        setTimeout(function () {
            window.close();
        }, 800);
    });
});