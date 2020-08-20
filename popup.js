var ext_api = chrome || browser;
document.getElementById("site_switch").addEventListener('click', function() {
    ext_api.extension.getBackgroundPage().site_switch();
});
