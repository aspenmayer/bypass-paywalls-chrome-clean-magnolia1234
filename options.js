// defaultSites are loaded from sites.js at installation extension (and are saved to local storage)
// var defaultSites = {};
var ext_api = chrome || browser;

// Saves options to ext_api.storage
function save_options() {
  var gh_url = document.getElementById('bypass_sites').value;
  var inputEls = document.querySelectorAll('#bypass_sites input');
  var sites = {};

  var sites = Array.from(inputEls).reduce(function(memo, inputEl) {
    if (inputEl.checked) {
      memo[inputEl.dataset.key] = inputEl.dataset.value;
    }
    return memo;
  }, {});

  ext_api.storage.local.set({
    sites: sites
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
  });
}

// Restores checkbox input states using the preferences stored in ext_api.storage.
function renderOptions() {
  var labelEl;
  ext_api.storage.local.get({
    sites: {}, sites_custom: {}
  }, function(items) {
    var sites = items.sites;
    var sitesEl = document.getElementById('bypass_sites');
    var clean_key;
    for (var key in defaultSites) {
      if (!defaultSites.hasOwnProperty(key)) {
        continue;
      }

      var value = defaultSites[key];
      labelEl = document.createElement('label');
      var inputEl = document.createElement('input');
      inputEl.type = 'checkbox';
      inputEl.dataset.key = key;
      inputEl.dataset.value = value;
      clean_key = key.replace(/\s\(.*\)/, '');
      inputEl.checked = Object.keys(sites).some(title => (title.replace(/\s\(.*\)/, '') === clean_key));
      if (value !== '###') {
          labelEl.appendChild(inputEl);
      } else {
          labelEl.appendChild(document.createElement('hr'));
          labelEl.setAttribute('style', ' font-weight: bold;');
      }
      labelEl.appendChild(document.createTextNode(' ' + key));
      sitesEl.appendChild(labelEl);
    }
    // custom
    labelEl.appendChild(document.createElement('hr'));
    labelEl = document.createElement('label');
    labelEl.setAttribute('style', ' font-weight: bold;');
    labelEl.appendChild(document.createTextNode('* Custom Sites'));
    sitesEl.appendChild(labelEl);
    var sites_custom = items.sites_custom;
    var defaultSites_domains = ext_api.extension.getBackgroundPage().defaultSites_domains;
    for (var key in sites_custom) {
      var domain = sites_custom[key]['domain'];
      if (defaultSites.hasOwnProperty(key) || defaultSites_domains.includes(domain)) {
        continue;
      }

      labelEl = document.createElement('label');
      var inputEl = document.createElement('input');
      inputEl.type = 'checkbox';
      inputEl.dataset.key = key;
      inputEl.dataset.value = domain;
      clean_key = key.replace(/\s\(.*\)/, '');
      inputEl.checked = Object.keys(sites).some(title => (title.replace(/\s\(.*\)/, '') === clean_key));
      if (value !== '' && value !== '###') {
        labelEl.appendChild(inputEl);
      }
      labelEl.appendChild(document.createTextNode(' '+key));
      sitesEl.appendChild(labelEl);
    }
  });
}

function selectAll() {
  var inputEls = Array.from(document.querySelectorAll('input'));
  inputEls.forEach(function(inputEl) {
    inputEl.checked = true;
  });
}

function selectNone() {
  var inputEls = Array.from(document.querySelectorAll('input'));
  inputEls.forEach(function(inputEl) {
    inputEl.checked = false;
  });
}

function closeButton() {
  window.close();
}

document.addEventListener('DOMContentLoaded', renderOptions);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('select-all').addEventListener('click', selectAll);
document.getElementById('select-none').addEventListener('click', selectNone);
document.getElementById("button-close").addEventListener('click', closeButton);
