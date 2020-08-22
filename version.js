var ext_api = chrome || browser;

var manifestData = ext_api.runtime.getManifest();
var versionString = 'v' + manifestData.version;
document.getElementById('version').innerText = versionString;

const manifest_new = 'https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/raw/master/manifest.json';
fetch(manifest_new)
.then(response => {
    if (response.ok) {
        response.json().then(json => {
            ext_api.management.getSelf(function (result) {
                var installType = result.installType;
                var version_len = (installType === 'development') ? 7 : 5;
                var version_new = json['version'];
                if (version_new.substring(0, version_len) > manifestData.version.substring(0, version_len)) {
                    var versionString_new = document.getElementById('version_new');
                    versionString_new.appendChild(document.createTextNode(' * '));
                    var anchorEl = document.createElement('a');
                    anchorEl.text = 'New release v' + version_new;
                    anchorEl.href = 'https://bitbucket.org/magnolia1234/bypass-paywalls-firefox-clean/downloads';
                    anchorEl.target = '_blank';
                    versionString_new.appendChild(anchorEl);
                }
            });
        })
    }
});