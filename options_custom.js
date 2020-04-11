var ext_api = chrome || browser;

function capitalize(str) {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sortJson(json) {
    return Object.keys(json)
        .sort().reduce(function (Obj, key) {
            Obj[key] = json[key];
            return Obj;
        }, {});
}

// Saves options to ext_api.storage
function save_options() {
    var textareaEl = document.querySelector('#bypass_sites textarea');
    var sites_custom = {};
    if (textareaEl.value !== '')
        var sites_custom = JSON.parse(textareaEl.value);
    ext_api.storage.sync.set({
        sites_custom: sites_custom
    }, function () {
        // Update status to let user know custom sites were saved.
        var status = document.getElementById('status');
        status.textContent = 'Custom sites saved.';
        setTimeout(function () {
            status.textContent = '';
            location.href = 'options.html';
            //window.close();
        }, 800);
    });
}

// Sort json by key in textarea
function sort_options() {
    var textareaEl = document.querySelector('#bypass_sites textarea');
    var sites_custom = {};
    if (textareaEl.value !== '') {
        var sites_custom = JSON.parse(textareaEl.value);
		var sites_custom_sorted = sortJson(sites_custom);
		textareaEl.value = JSON.stringify(sites_custom_sorted);
	}

}

// Export custom sites to file
function export_options() {
    ext_api.storage.sync.get({
        sites_custom: {}
    }, function (items) {
        var result = JSON.stringify(items.sites_custom);
        var a = document.createElement("a");
        var file = new Blob([result], {type: "text/plain"});
        a.href = window.URL.createObjectURL(file);
        let date = new Date();
        let dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        a.download = 'bypass_paywalls_clean_custom_' + dateStr + '.txt';
        a.click();
    });
}

// Import custom sites from file
function import_options(e) {
  var files = e.target.files;
  var reader = new FileReader();
  reader.onload = _imp;
  reader.readAsText(files[0]);
}

function _imp() {
    let sites_custom = JSON.parse(this.result);
    ext_api.storage.sync.set({
        sites_custom: sites_custom
    }, function () {
        // Update status to let user know custom sites were imported.
        var status = document.getElementById('status');
        status.textContent = 'Custom sites imported.';
        setTimeout(function () {
            //status.textContent = '';
            importInput.value = '';
            renderOptions();
        }, 800);
    });
}

// Add custom site to ext_api.storage
function add_options() {
    var inputEls = document.querySelectorAll('#add_site input');
    var sites_custom = {};

    for (let i = 0; i < inputEls.length; i++) {
        if (inputEls[i].dataset.key === 'title') {
            var title = capitalize(inputEls[i].value);
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
        sites_custom[title]['domain'] = sites_custom[title]['domain'].replace('www.', '').toLowerCase();

    // add new site to local storage
    ext_api.storage.sync.get({
        sites_custom: {}
    }, function (items) {
        var sites_custom_old = items.sites_custom;

        for (var key in sites_custom) {
            sites_custom_old[key] = sites_custom[key];
        }

        ext_api.storage.sync.set({
            sites_custom: sites_custom_old
        }, function () {
            // Update status to let user know new custom site was added.
            var status_add = document.getElementById('status_add');
            status_add.textContent = 'Site added. Also enable site in options (save).';
            setTimeout(function () {
                //status.textContent = '';
                renderOptions();
            }, 800);
        });
    });
}

// Delete custom site from ext_api.storage
function delete_options() {
    var selectEl = document.querySelector('#custom_sites select');
    var sites_custom = {};
    var remove_key = selectEl.value;

    // delete site from local storage
    ext_api.storage.sync.get({
        sites_custom: {}
    }, function (items) {
        var sites_custom_old = items.sites_custom;
        delete sites_custom_old[remove_key];

        ext_api.storage.sync.set({
            sites_custom: sites_custom_old
        }, function () {
            // Update status to let user know custom site was deleted.
            var status_delete = document.getElementById('status_delete');
            status_delete.textContent = 'Site deleted. Also disable site in options (save).';
            setTimeout(function () {
                //status.textContent = '';
                renderOptions();
            }, 800);
        });
    });
}

// Restores checkbox input states using the preferences stored in ext_api.storage.
function renderOptions() {
    ext_api.storage.sync.get({
        sites_custom: {}
    }, function (items) {
        var sites_custom = items.sites_custom;
        var sitesEl = document.getElementById('bypass_sites');
        sitesEl.innerHTML = '';
        var labelEl = document.createElement('label');
        var textareaEl = document.createElement('textarea');
        textareaEl.value = JSON.stringify(sites_custom);
        textareaEl.rows = 12;
        textareaEl.cols = 40;
        labelEl.appendChild(textareaEl);
        sitesEl.appendChild(labelEl);

        // add site
        var add_sitesEl = document.getElementById('add_site');
        add_sitesEl.innerHTML = '';
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
            } else if (key === 'title') {
                inputEl.placeholder = 'Example';
            } else if (key === 'domain')
                inputEl.placeholder = 'example.com';
            labelEl.appendChild(document.createTextNode(' ' + key));
            add_sitesEl.appendChild(labelEl);
        }

        // list of custom sites
        var custom_sitesEl = document.getElementById('custom_sites');
        custom_sitesEl.innerHTML = '';
        labelEl = document.createElement('label');
        var selectEl = document.createElement('select');
        selectEl.id = 'sites';
        selectEl.size = 6;
        var optionEl;
        for (var key in sites_custom) {
            optionEl = document.createElement('option');
            optionEl.text = key + ': ' + sites_custom[key]['domain'] +
                (sites_custom[key]['googlebot'] ? ' | googlebot' : '') + (sites_custom[key]['block_javascript'] ? ' | block javascript' : '');
            optionEl.value = key;
            selectEl.add(optionEl);
        }
        labelEl.appendChild(selectEl);
        //labelEl.appendChild(document.createTextNode(''));
        custom_sitesEl.appendChild(labelEl);

    });
}

document.addEventListener('DOMContentLoaded', renderOptions);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('sort').addEventListener('click', sort_options);
document.getElementById('export').addEventListener('click', export_options);
document.getElementById('import').onclick = function () {importInput.click()}
document.getElementById('importInput').addEventListener("change", import_options, false);
document.getElementById('add').addEventListener('click', add_options);
document.getElementById('delete').addEventListener('click', delete_options);