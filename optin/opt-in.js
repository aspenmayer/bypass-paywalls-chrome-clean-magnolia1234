"use strict";
var ext_api = chrome || browser;

window.addEventListener("load", function () {
    ext_api.storage.sync.get("optIn", function (result) {
        var opt_in_enabled = document.getElementById('opt-in-enabled');
        opt_in_enabled.appendChild(document.createTextNode('SetCookie opt-in enabled: ' + (result.optIn ? 'YES' : 'NO')));
        //console.log("Setting up UI. result.optIn:" + result.optIn);
    });

    document.getElementById("button-enable").addEventListener(
        "click",
        function () {
        ext_api.storage.sync.set({
            "optIn": true,
            "optInShown": true
        });
        window.close();
    });

    document.getElementById("button-cancel").addEventListener(
        "click",
        function () {
        ext_api.storage.sync.set({
            "optIn": false,
            "optInShown": true
        });
        window.close();
    });
/**
    // set up the appearance of the popup depending on the outcome of the opt-in
    ext_api.storage.sync.get("optInShown", function (result) {
        console.log("Setting up UI. result.optInShown:" + result.optInShown);
        document.getElementById("opt-in-prompt").hidden = result.optInShown;
        document.getElementById("after-opt-in").hidden = !result.optInShown;
    });
**/
});