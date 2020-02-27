
// Saves options to chrome.storage
function save_options() {
    var gh_url = document.getElementById('bypass_sites').value;
    var textareaEl = document.querySelector('#bypass_sites textarea');
    var sites_custom = {};
    if (textareaEl.value !== '')
        var sites_custom = JSON.parse(textareaEl.value);
    chrome.storage.sync.set({
        sites_custom: sites_custom
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
            location.href = 'options.html';
            //window.close();
        }, 800);
    });
}

// Add custom site to chrome.storage
function add_options() {
    var gh_url = document.getElementById('add_site').value;
    var inputEls = document.querySelectorAll('#add_site input');
    var sites_custom = {};

    for (let i = 0; i < inputEls.length; i++) {
        if (inputEls[i].dataset.key === 'title') {
            var title = inputEls[i].value;
            if (title === '')
                break;
            sites_custom[title] = {};
        } else {
            if (inputEls[i].dataset.value) {
                if (inputEls[i].checked)
                    sites_custom[title][inputEls[i].dataset.key] = inputEls[i].dataset.value;
            } else
                sites_custom[title][inputEls[i].dataset.key] = inputEls[i].value;
        }
    }
    if (sites_custom[title]['domain'] === '')
        sites_custom = {};
    else
        sites_custom[title]['domain'] = sites_custom[title]['domain'].replace('www.', '');

    // add new site to local storage
    chrome.storage.sync.get({
        sites_custom: {}
    }, function (items) {
        var sites_custom_old = items.sites_custom;

        for (var key in sites_custom) {
            sites_custom_old[key] = sites_custom[key];
        }

        chrome.storage.sync.set({
            sites_custom: sites_custom_old
        }, function () {
            // Update status to let user know options were saved.
            var status = document.getElementById('status');
            status.textContent = 'Site added.';
            setTimeout(function () {
                status.textContent = '';
                location.href = 'options.html';
                //window.close();
            }, 800);
        });
    });
}

// Restores checkbox input states using the preferences stored in chrome.storage.
function renderOptions() {
    chrome.storage.sync.get({
        sites_custom: {}
    }, function (items) {
        var sites_custom = items.sites_custom;
        var sitesEl = document.getElementById('bypass_sites');
        var labelEl = document.createElement('label');
        var textareaEl = document.createElement('textarea');
        textareaEl.value = JSON.stringify(sites_custom);
        textareaEl.rows = 12;
        textareaEl.cols = 45;
        labelEl.appendChild(textareaEl);
        sitesEl.appendChild(labelEl);

        // add site
        var add_sitesEl = document.getElementById('add_site');
        var inputEl;
        var add_checkboxes = {
            'title': 0,
            'domain': 0,
            'googlebot': 1,
            'block_javascript': 1
        };
        for (var key in add_checkboxes) {
            labelEl = document.createElement('label');
            inputEl = document.createElement('input');
            inputEl.dataset.key = key;
            labelEl.appendChild(inputEl);
            if (add_checkboxes[key]) {
                inputEl.type = 'checkbox';
                inputEl.dataset.value = 1;
            }
            labelEl.appendChild(document.createTextNode(' ' + key));
            add_sitesEl.appendChild(labelEl);
        }
    });
}

document.addEventListener('DOMContentLoaded', renderOptions);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('add').addEventListener('click', add_options);