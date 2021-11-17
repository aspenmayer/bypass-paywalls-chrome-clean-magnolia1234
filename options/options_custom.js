var ext_api = chrome || browser;

var useragent_options = ['', 'googlebot', 'bingbot'];
var referer_options = ['', 'facebook', 'google', 'twitter'];

function capitalize(str) {
  return (typeof str === 'string') ? str.charAt(0).toUpperCase() + str.slice(1) : '';
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
  ext_api.storage.local.set({
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
  ext_api.storage.local.get({
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
  var result = this.result;
  ext_api.storage.local.get({
    sites_custom: {}
  }, function (items) {
    var sites_custom = items.sites_custom;
    var sites_custom_new = JSON.parse(result);
    for (let site in sites_custom_new)
      sites_custom[site] = sites_custom_new[site];
    ext_api.storage.local.set({
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
  });
}

// Add custom site to ext_api.storage
function add_options() {
  var inputEls = document.querySelectorAll('#add_site input, #add_site select');
  var sites_custom = {};
  
  for (let elem of inputEls) {
    if (elem.dataset.key === 'title') {
      var title = capitalize(elem.value);
      if (title === '')
        break;
      sites_custom[title] = {};
    } else {
      if (elem.dataset.value) {
        if (elem.checked)
          sites_custom[title][elem.dataset.key] = parseInt(elem.dataset.value);
      } else if (elem.value)
        sites_custom[title][elem.dataset.key] = elem.value;
    }
  }
  
  if (title && sites_custom[title]['domain']) {
    sites_custom[title]['domain'] = sites_custom[title]['domain'].replace(/(http(s)?:\/\/(www\.)?|^www\.|\/$)/g, '').toLowerCase();
    
    // add new site to local storage
    ext_api.storage.local.get({
      sites_custom: {}
    }, function (items) {
      var sites_custom_old = items.sites_custom;
      
      for (var key in sites_custom) {
        sites_custom_old[key] = sites_custom[key];
      }
      
      ext_api.storage.local.set({
        sites_custom: sites_custom_old
      }, function () {
        // Update status to let user know new custom site was added.
        var status_add = document.getElementById('status_add');
        status_add.textContent = 'Site added.';
        setTimeout(function () {
          //status.textContent = '';
          renderOptions();
        }, 800);
      });
    });
  }
}

// Delete custom site from ext_api.storage
function delete_options() {
  var selectEl = document.querySelector('#custom_sites select');
  var sites_custom = {};
  var remove_key = selectEl.value;
  
  // delete site from local storage
  ext_api.storage.local.get({
    sites_custom: {}
  }, function (items) {
    var sites_custom_old = items.sites_custom;
    delete sites_custom_old[remove_key];
    
    ext_api.storage.local.set({
      sites_custom: sites_custom_old
    }, function () {
      // Update status to let user know custom site was deleted.
      var status_delete = document.getElementById('status_delete');
      status_delete.textContent = 'Site deleted.';
      setTimeout(function () {
        //status.textContent = '';
        renderOptions();
      }, 800);
    });
  });
}

// Edit custom site (copy to add)
function edit_options() {
  var selectEl = document.querySelector('#custom_sites select');
  var sites_custom = {};
  var title = selectEl.value;
  
  // copy site to add-fields
  ext_api.storage.local.get({
    sites_custom: {}
  }, function (items) {
    sites_custom = items.sites_custom;
    var edit_site = sites_custom[title];
    document.querySelector('input[data-key="title"]').value = title;
    document.querySelector('input[data-key="domain"]').value = edit_site.domain;
    document.querySelector('select[data-key="useragent"]').selectedIndex = (edit_site.googlebot > 0) ? 1 : useragent_options.indexOf(edit_site.useragent);
    document.querySelector('input[data-key="allow_cookies"]').checked = (edit_site.allow_cookies > 0);
    document.querySelector('input[data-key="block_javascript"]').checked = (edit_site.block_javascript > 0);
    document.querySelector('input[data-key="block_javascript_ext"]').checked = (edit_site.block_javascript_ext > 0);
    document.querySelector('input[data-key="block_regex"]').value = edit_site.block_regex ? edit_site.block_regex : '';
    document.querySelector('input[data-key="amp_unhide"]').checked = (edit_site.amp_unhide > 0);
    document.querySelector('select[data-key="referer"]').selectedIndex = referer_options.indexOf(edit_site.referer);
  });
}

// request permissions for custom sites (in list only)
function request_permissions() {
  var perm_custom = document.getElementById('perm-custom');
  ext_api.permissions.request({
    origins: perm_origins
  }, function (granted) {
    if (granted) {
      perm_custom.innerText = 'YES';
    } else {
      perm_custom.innerText = 'NO';
    }
  });
}

// remove permissions for custom sites
function remove_permissions() {
  var perm_custom = document.getElementById('perm-custom');
  ext_api.permissions.remove({
    origins: perm_origins
  }, function (removed) {
    if (removed) {
      perm_custom.innerText = 'NO';
    }
  });
}

var perm_origins;
// Restores checkbox input states using the preferences stored in ext_api.storage.
function renderOptions() {
  ext_api.storage.local.get({
    sites_custom: {},
    sites_updated: {}
  }, function (items) {
    var sites_custom = items.sites_custom;
    var sites_updated = items.sites_updated;
    var sites_updated_domains_new = Object.values(sites_updated).filter(x => (x.domain && !defaultSites_domains.includes(x.domain) || x.group)).map(x => x.group ? x.group.filter(y => !defaultSites_domains.includes(y)) : x.domain).flat();
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
      'allow_cookies': 1,
      'block_javascript': 1,
      'block_javascript_ext': 1,
      'block_regex': 0,
      'amp_unhide': 1
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
    
    var add_options = {
      useragent: useragent_options,
      referer: referer_options
    };
    for (let key in add_options) {
      labelEl = document.createElement('label');
      labelEl.appendChild(document.createTextNode(key + ' '));
      inputEl = document.createElement('select');
      inputEl.dataset.key = key;
      labelEl.appendChild(inputEl);
      
      for (let elem of add_options[key]) {
        let option = document.createElement("option");
        option.value = elem;
        option.text = elem;
        inputEl.appendChild(option);
      }
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
    perm_origins = [];
    for (let key in sites_custom) {
      optionEl = document.createElement('option');
      let domain = sites_custom[key]['domain'];
      perm_origins.push(domain);
      let isDefaultSite = defaultSites_domains.includes(domain);
      optionEl.text = isDefaultSite ? '*' : '';
      optionEl.text += key + ': ' + domain +
      (sites_custom[key]['googlebot'] > 0 ? ' | googlebot' : '') +
      (sites_custom[key]['allow_cookies'] > 0 ? ' | allow_cookies' : '') +
      (sites_custom[key]['block_javascript'] > 0 ? ' | block javascript' : '') +
      (sites_custom[key]['block_javascript_ext'] > 0 ? ' | block javascript ext' : '') +
      (sites_custom[key]['block_regex'] ? ' | block regex' : '') +
      (sites_custom[key]['useragent'] ? ' | useragent: ' + sites_custom[key]['useragent'] : '') +
      (sites_custom[key]['referer'] ? ' | referer: ' + sites_custom[key]['referer'] : '') +
      (sites_custom[key]['amp_unhide'] > 0 ? ' | amp_unhide' : '');
      optionEl.value = key;
      selectEl.add(optionEl);
    }
    labelEl.appendChild(selectEl);
    custom_sitesEl.appendChild(labelEl);
    
    if (sites_updated_domains_new.length > 0) {
      labelEl = document.createElement('p');
      labelEl.appendChild(document.createElement('label'));
      labelEl.appendChild(document.createTextNode('Updated sites: ' + sites_updated_domains_new.join()));
      custom_sitesEl.appendChild(labelEl);
    }
    
    perm_origins = perm_origins.concat(sites_updated_domains_new).map(x => '*://*.' + x + '/*');
    var perm_custom = document.getElementById('perm-custom');
    ext_api.permissions.contains({
      origins: perm_origins
    }, function (result) {
      if (result) {
        perm_custom.innerText = 'YES';
      } else {
        perm_custom.innerText = 'NO';
      }
    });
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
}

document.addEventListener('DOMContentLoaded', renderOptions);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('sort').addEventListener('click', sort_options);
document.getElementById('export').addEventListener('click', export_options);
document.getElementById('import').onclick = function () {importInput.click()}
document.getElementById('importInput').addEventListener("change", import_options, false);
document.getElementById('add').addEventListener('click', add_options);
document.getElementById('delete').addEventListener('click', delete_options);
document.getElementById('edit').addEventListener('click', edit_options);
document.getElementById('perm_request').addEventListener('click', request_permissions);
document.getElementById('perm_remove').addEventListener('click', remove_permissions);