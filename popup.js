var ext_api = chrome || browser;

function popup_show_toggle(domain) {
    if (domain) {
        var site_switch_span = document.getElementById('site_switch_span');
        let labelEl = document.createElement('label');
        labelEl.setAttribute('class', 'switch');
        let inputEl = document.createElement('input');
        inputEl.setAttribute('id', 'site_switch');
        inputEl.setAttribute('type', 'checkbox');
        if (ext_api.extension.getBackgroundPage().enabledSites.includes(domain))
            inputEl.setAttribute('checked', true);
        labelEl.appendChild(inputEl);
        let spanEl = document.createElement('span');
        spanEl.setAttribute('class', 'slider round');
        spanEl.setAttribute('title', 'en/disable current site in BPC');
        labelEl.appendChild(spanEl);
        site_switch_span.appendChild(labelEl);
        document.getElementById("site_switch").addEventListener('click', function () {
            ext_api.extension.getBackgroundPage().site_switch();
            close();
        });
    }
};
ext_api.extension.getBackgroundPage().popup_show_toggle_tab(popup_show_toggle);

document.getElementById("clear_cookies").addEventListener('click', function () {
    ext_api.extension.getBackgroundPage().clear_cookies();
    close();
});
