// defaultSites are loaded from sites.js at installation extension (and are saved to local storage)
// var defaultSites = {};

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

  ext_api.storage.sync.set({
    sites: sites
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
      window.close();
    }, 800);
  });

  // Refresh the current tab
  ext_api.tabs.query({
      active: true,
      currentWindow: true
  }, function (tabs) {
      if (tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
      ext_api.tabs.update(tabs[0].id, {
          url: tabs[0].url
      });
      }
  });
}

// Restores checkbox input states using the preferences stored in ext_api.storage.
function renderOptions() {
  ext_api.storage.sync.get({
    sites: {}, sites_custom: {}
  }, function(items) {
    var sites = items.sites;
    var sitesEl = document.getElementById('bypass_sites');
    for (var key in defaultSites) {
      if (!defaultSites.hasOwnProperty(key)) {
        continue;
      }

      var value = defaultSites[key];
      var labelEl = document.createElement('label');
      var inputEl = document.createElement('input');
      inputEl.type = 'checkbox';
      inputEl.dataset.key = key;
      inputEl.dataset.value = value;
      inputEl.checked = (key in sites) || (key.replace(/\s\(.*\)/, '') in sites);
      if (value !== '###') {
        labelEl.appendChild(inputEl);
      }
      labelEl.appendChild(document.createTextNode(' '+key));
      sitesEl.appendChild(labelEl);
    }
	// custom
    var labelEl = document.createElement('label');	
    labelEl.appendChild(document.createTextNode(' ——— Custom Sites ———'));
    sitesEl.appendChild(labelEl);
    var sites_custom = items.sites_custom;
	for (var key in sites_custom) {
      if (defaultSites.hasOwnProperty(key)) {
        continue;
      }

      var value = sites_custom[key]['domain'];
      var labelEl = document.createElement('label');
      var inputEl = document.createElement('input');
      inputEl.type = 'checkbox';
      inputEl.dataset.key = key;
      inputEl.dataset.value = value;
      inputEl.checked = (key in sites) || (key.replace(/\s\(.*\)/, '') in sites);
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

document.addEventListener('DOMContentLoaded', renderOptions);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('select-all').addEventListener('click', selectAll);
document.getElementById('select-none').addEventListener('click', selectNone);
