var manifestData = chrome.runtime.getManifest();
var versionString = 'v' + manifestData.version;
document.getElementById('version').innerText = versionString;

const manifest_new = 'https://raw.githubusercontent.com/magnolia1234/bypass-paywalls-chrome-clean/master/manifest.json';
fetch(manifest_new)
	.then(response => { 
		if (response.ok) {
			response.json().then(json => {
				var version_new = json['version'];
				if (version_new > manifestData.version) {
					versionString_new = ' | New release v' + version_new.link("https://github.com/magnolia1234/bypass-paywalls-chrome-clean/releases").replace('a href=', 'a target="_blank" href=');
				} else {
					versionString_new  = ''; //'Latest release';
				}
				document.getElementById('version_new').innerHTML = versionString_new;
			})
		}
	});
