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
    setTimeout(function () {
      status.textContent = '';
    }, 800);
  });
}

// Restores checkbox input states using the preferences stored in ext_api.storage.
function renderOptions() {
  var labelEl;
  ext_api.storage.local.get({
    sites: {},
    sites_updated: {},
    sites_custom: {},
    sites_excluded: []
  }, function (items) {
    var sites = items.sites;
    var sites_updated = items.sites_updated;
    var sites_updated_domains_new = Object.values(sites_updated).filter(x => x.domain && !defaultSites_domains.includes(x.domain)).map(x => x.domain);
    var sites_custom = items.sites_custom;
    var sites_custom_domains = Object.values(sites_custom).filter(x => x.domain).map(x => x.domain);

    var perm_origins = sites_custom_domains.concat(sites_updated_domains_new).map(x => '*://*.' + x + '/*');
    var perm_custom = document.getElementById('perm-custom');
    ext_api.permissions.contains({
      origins: perm_origins
    }, function (result) {
      if (result) {
        perm_custom.innerText = '';
      } else {
        perm_custom.textContent = ">> check permissions for custom/updated sites";
      }
    });

    var sites_excluded = items.sites_excluded;
    var sitesEl = document.getElementById('bypass_sites');
    var site_types = {
      "updated": {
        sites: sites_updated,
        title: '* Updated (new) Sites (opt-in to custom sites)',
        default_sites: false
      },
      "default": {
        sites: defaultSites,
        title: '* Default Sites',
        default_sites: true
      },
      "custom": {
        sites: sites_custom,
        title: '* Custom (new) Sites',
        default_sites: false
      }
    };
    var first = true;
    for (let site_type in site_types) {
      if (!first)
        labelEl.appendChild(document.createElement('hr'));
      else
        first = false;
      labelEl = document.createElement('label');
      labelEl.setAttribute('style', ' font-weight: bold;');
      labelEl.appendChild(document.createTextNode(site_types[site_type].title));
      sitesEl.appendChild(labelEl);
      let sites_arr = site_types[site_type].sites
        for (let key in sites_arr) {
          let domain = sites_arr[key]['domain'];
          if (!domain || (!site_types[site_type].default_sites && (defaultSites.hasOwnProperty(key) || defaultSites_domains.includes(domain))))
            continue;
          labelEl = document.createElement('label');
          let inputEl = document.createElement('input');
          inputEl.type = 'checkbox';
          inputEl.dataset.key = key;
          inputEl.dataset.value = domain;
          inputEl.checked = Object.keys(sites).some(title => compareKey(title, key)) && !sites_excluded.includes(domain);
          if (domain !== '###') {
            labelEl.appendChild(inputEl);
          } else {
            labelEl.appendChild(document.createElement('hr'));
            labelEl.setAttribute('style', ' font-weight: bold;');
          }
          labelEl.appendChild(document.createTextNode(' ' + key));
          sitesEl.appendChild(labelEl);
        }
    }
    // excluded
    labelEl.appendChild(document.createElement('hr'));
    labelEl = document.createElement('label');
    labelEl.setAttribute('style', ' font-weight: bold;');
    labelEl.appendChild(document.createTextNode('* Excluded Sites (ignored when checked in list)'));
    sitesEl.appendChild(labelEl);
    labelEl = document.createElement('label');
    labelEl.appendChild(document.createTextNode(sites_excluded.join()));
    sitesEl.appendChild(labelEl);
    save_options();
  });
}

function selectAll() {
  var inputEls = Array.from(document.querySelectorAll('input'));
  inputEls = inputEls.filter(function (input) {
      return (!input.dataset.value.match(/^#options_(disable|optin)_/));
    });
  inputEls.forEach(function (inputEl) {
    inputEl.checked = true;
  });
  // Update status to let user know all sites are selected.
  var status = document.getElementById('status');
  status.textContent = 'All sites selected.';
  setTimeout(function () {
    status.textContent = '';
  }, 800);
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

function check_sites_updated() {
  ext_api.runtime.sendMessage({request: 'check_sites_updated'});
  location.reload();
}

function compareKey(firstStr, secondStr) {
  return firstStr.toLowerCase().replace(/\s\(.*\)/, '') === secondStr.toLowerCase().replace(/\s\(.*\)/, '');
}

document.addEventListener('DOMContentLoaded', renderOptions);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('select-all').addEventListener('click', selectAll);
document.getElementById('select-none').addEventListener('click', selectNone);
document.getElementById("button-close").addEventListener('click', closeButton);
document.getElementById('sites_updated').addEventListener('click', check_sites_updated);
