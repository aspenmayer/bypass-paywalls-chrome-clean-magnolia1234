"use strict";
var ext_api = chrome || browser;

window.addEventListener("load", function () {
    var opt_in_enabled = document.getElementById('opt-in-enabled');
    ext_api.storage.local.get("optIn", function (result) {
        opt_in_enabled.innerText = result.optIn ? 'YES' : 'NO';
    });

    document.getElementById("optin-enable").addEventListener(
        "click",
        function () {
        ext_api.storage.local.set({
            "optIn": true,
            "optInShown": true
        });
        opt_in_enabled.innerText = 'YES';
        setTimeout(function () {
            //window.close();
        }, 800);
    });

    document.getElementById("optin-disable").addEventListener(
        "click",
        function () {
        ext_api.storage.local.set({
            "optIn": false,
            "optInShown": true
        });
        opt_in_enabled.innerText = 'NO';
        setTimeout(function () {
            //window.close();
        }, 800);
    });

    document.getElementById("button-close").addEventListener(
        "click",
        function () {
        ext_api.storage.local.set({
            "optInShown": true,
            "customShown": true
        });
        open(location).close();
    });

    var custom_enabled = document.getElementById('custom-enabled');
    ext_api.permissions.contains({
        origins: ["<all_urls>"]
    }, function (result) {
        if (result) {
            custom_enabled.innerText = 'YES';
        } else {
            custom_enabled.innerText = 'NO';
        }
    });

    document.querySelector('#custom-enable').addEventListener('click', function (event) {
        ext_api.permissions.request({
            origins: ["<all_urls>"]
        }, function (granted) {
            if (granted) {
                custom_enabled.innerText = 'YES';
            } else {
                custom_enabled.innerText = 'NO';
            }
            ext_api.storage.local.set({
                "customShown": true
            });
        });
    });

    document.querySelector('#custom-disable').addEventListener('click', function (event) {
        ext_api.permissions.remove({
            origins: ["<all_urls>"]
        }, function (removed) {
            if (removed) {
                custom_enabled.innerText = 'NO';
            } else {}
            ext_api.storage.local.set({
                "customShown": true
            });
        });
    });
});