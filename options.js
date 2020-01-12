// defaultSites are loaded from sites(_custom).json at installation extension (and are saved to local storage)
var defaultSites = {};

// Saves options to chrome.storage
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

  chrome.storage.sync.set({
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
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    });
}

//Fetch sites.json & sites_custom.json
function renderOptions() {
	const url_sites = chrome.runtime.getURL('sites.json');
	fetch(url_sites)
		.then(response => { 
			if (response.ok) { 
				response.json().then(json => {
					var defaultSites_merge = {...defaultSites, ...json}; 
					defaultSites = defaultSites_merge;
					// add custom sites
					const url_sites_custom = 'https://raw.githubusercontent.com/magnolia1234/bypass-paywalls-chrome-clean/master/sites_custom.json';
					fetch(url_sites_custom)
						.then(response => {
							if (response.ok) {
								response.json().then(json => {
									var defaultSites_merge = {...defaultSites, ...json}; 
									defaultSites = defaultSites_merge;
									renderOptions_default();
								})
							} else { renderOptions_default(); }
						} );
				})
			} else { renderOptions_default(); }
		} );
}

// Restores checkbox input states using the preferences
// stored in chrome.storage.
function renderOptions_default() {
  chrome.storage.sync.get({
    sites: {}
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
      if (value !=='') {
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
