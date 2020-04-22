var ext_api = chrome || browser;

var manifestData = ext_api.runtime.getManifest();
var versionString = 'v' + manifestData.version;
document.getElementById('version').innerText = versionString;

const manifest_new = 'https://raw.githubusercontent.com/magnolia1234-new/bypass-paywalls-chrome-clean/master/manifest.json';
fetch(manifest_new)
.then(response => {
    if (response.ok) {
        response.json().then(json => {
            var version_new = json['version'];
            if (version_new > manifestData.version) {
                var versionString_new = document.getElementById('version_new');
                versionString_new.appendChild(document.createTextNode(' | '));
                var anchorEl = document.createElement('a');
                anchorEl.text = 'New release v' + version_new;
                anchorEl.href = 'https://github.com/magnolia1234-new/bypass-paywalls-chrome-clean/releases';
                anchorEl.target = '_blank';
                versionString_new.appendChild(anchorEl);
            }
        })
    }
});