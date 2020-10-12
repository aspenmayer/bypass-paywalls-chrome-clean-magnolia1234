var ext_api = chrome || browser;
document.getElementById("site_switch").addEventListener('click', function() {
    ext_api.extension.getBackgroundPage().site_switch();
    window.close();
});
document.getElementById("clear_cookies").addEventListener('click', function() {
    ext_api.extension.getBackgroundPage().clear_cookies();
    window.close();
});
