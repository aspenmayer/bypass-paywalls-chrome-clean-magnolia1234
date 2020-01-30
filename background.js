/* Please respect alphabetical order when adding a site in any list */

'use strict';

// Cookies from this list are blocked by default (obsolete)
// defaultSites are loaded from sites(_custom).json at installation extension
var defaultSites = {};

const restrictions = {
  'barrons.com': /.+barrons\.com\/articles\/.+/,
  'prime.economictimes.indiatimes.com': /.+prime\.economictimes\.indiatimes\.com\/news\/[0-9]{8}\/.+/,
  'wsj.com': /(.+wsj\.com\/articles\/.+|.+blogs\.wsj\.com\/.+)/
}

// Don't remove cookies before page load
// allow_cookies are completed with domains in sites(_custom).json (default allow/remove_cookies)
var allow_cookies = [
'adelaidenow.com.au',
'barrons.com',
'bostonglobe.com',
'cairnspost.com.au',
'couriermail.com.au',
'dailytelegraph.com.au',
'dn.se',
'folha.uol.com.br',
'goldcoastbulletin.com.au',
'haaretz.co.il',
'haaretz.com',
'handelsblatt.com',
'heraldsun.com.au',
'kleinezeitung.at',
'lemonde.fr',
'lrb.co.uk',
'mexiconewsdaily.com',
'nknews.org',
'ntnews.com.au',
'nytimes.com',
'parool.nl',
'prime.economictimes.indiatimes.com',
'quora.com',
'scribd.com',
'techinasia.com',
'telegraph.co.uk',
'the-american-interest.com',
'theathletic.com',
'theaustralian.com.au',
'themarker.com',
'themercury.com.au',
'thetimes.co.uk',
'townsvillebulletin.com.au',
'trouw.nl',
'volkskrant.nl',
'weeklytimesnow.com.au',
'wsj.com',
]

// Removes cookies after page load
// remove_cookies are completed with domains of sites(_custom).json (default allow/remove_cookies)
var remove_cookies = [
]

// select specific cookie(s) to hold from remove_cookies domains
const remove_cookies_select_hold = {
	'newstatesman.com': ['STYXKEY_nsversion'],
	'qz.com': ['gdpr'],
	'washingtonpost.com': ['wp_gdpr']
}

// select only specific cookie(s) to drop from remove_cookies domains
const remove_cookies_select_drop = {
	'ad.nl': ['temptationTrackingId'],
	'caixinglobal.com': ['CAIXINGLB_LOGIN_UUID'],
	'demorgen.be': ['TID_ID'],
	'dn.se': ['randomSplusId'],
	'ed.nl': ['temptationTrackingId'],
	'nrc.nl': ['counter'],
	'theatlantic.com': ['articleViews']
}

// Override User-Agent with Googlebot
const use_google_bot = [
'adelaidenow.com.au',
'barrons.com',
'cairnspost.com.au',
'couriermail.com.au',
'dailytelegraph.com.au',
'dn.se',
'goldcoastbulletin.com.au',
'haaretz.co.il',
'haaretz.com',
'handelsblatt.com',
'heraldsun.com.au',
'lemonde.fr',
'mexiconewsdaily.com',
'nknews.org',
'ntnews.com.au',
'nytimes.com',
'prime.economictimes.indiatimes.com',
'quora.com',
'telegraph.co.uk',
'theathletic.com',
'theaustralian.com.au',
'themarker.com',
'themercury.com.au',
'thetimes.co.uk',
'townsvillebulletin.com.au',
'weeklytimesnow.com.au',
'wsj.com',
]

// block paywall-scripts individually
var blockedRegexes = {
'adweek.com': /.+\.lightboxcdn\.com\/.+/,
'afr.com': /afr\.com\/assets\/vendorsReactRedux_client.+\.js/,
'bostonglobe.com': /meter\.bostonglobe\.com\/js\/.+/,
'businessinsider.com': /(.+\.tinypass\.com\/.+|cdn\.onesignal\.com\/sdks\/.+\.js)/,
'challenges.fr': /.+\.poool\.fr\/.+/,
'chicagobusiness.com': /.+\.tinypass\.com\/.+/,
'chicagotribune.com': /.+:\/\/.+\.tribdss\.com\//,
'digiday.com': /.+\.tinypass\.com\/.+/,
'economist.com': /(.+\.tinypass\.com\/.+|economist\.com\/_next\/static\/runtime\/main.+\.js)/,
'elpais.com': /.+\.epimg\.net\/js\/.+\/noticia\.min\.js/,
'exame.abril.com.br': /.+\.tinypass\.com\/.+/,
'folha.uol.com.br': /.+\.folha\.uol\.com\.br\/paywall\/js\/.+\/publicidade\.ads\.js/,
'globo.com': /.+\.tinypass\.com\/.+/,
'foreignpolicy.com': /.+\.tinypass\.com\/.+/,
'fortune.com':  /.+\.tinypass\.com\/.+/,
'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js.+/,
'inquirer.com': /.+\.tinypass\.com\/.+/,
'lastampa.it': /.+\.repstatic\.it\/minify\/sites\/lastampa\/.+\/config\.cache\.php\?name=social_js/,
'lejdd.fr': /.+\.swisspay\.ch\/.+/,
'leparisien.fr': /.+\.tinypass\.com\/.+/,
'lesechos.fr': /.+\.tinypass\.com\/.+/,
'lrb.co.uk': /.+\.tinypass\.com\/.+/,
'newcastleherald.com.au': /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/,
'nzherald.co.nz': /nzherald\.co\.nz\/.+\/headjs\/.+\.js/,
'sloanreview.mit.edu': /.+\.tinypass\.com\/.+/,
'spectator.co.uk': /.+\.tinypass\.com\/.+/,
'thedailybeast.com': /.+\.tinypass\.com\/.+/,
'theglobeandmail.com': /theglobeandmail\.com\/pb\/resources\/scripts\/build\/chunk-bootstraps\/.+\.js/,
'thenation.com': /thenation\.com\/.+\/paywall-script\.php/,
'valeursactuelles.com': /.+\.poool\.fr\/.+/
};

const userAgentDesktop = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobile = "Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

var enabledSites = [];

function setDefaultOptions() {
  chrome.storage.sync.set({
    sites: defaultSites
  }, function() {
    chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
  });
}

// Get the enabled sites (from local storage) & add to allow/remove_cookies (if not already in one of these arrays)
chrome.storage.sync.get({
  sites: {}
}, function(items) {
  var sites = items.sites;
  enabledSites = Object.keys(items.sites).map(function(key) {
    return items.sites[key];
  });
  enabledSites = enabledSites.filter(function(el) { return (el !== '###'); });
  for (var domainIndex in enabledSites) {
    var domainVar = enabledSites[domainIndex];
    if (!allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar)) {
      allow_cookies.push(domainVar);
	  remove_cookies.push(domainVar);
	}
  }
});

// Listen for changes to options
chrome.storage.onChanged.addListener(function(changes, namespace) {
  var key;
  for (key in changes) {
    var storageChange = changes[key];
    if (key === 'sites') {
      var sites = storageChange.newValue;
      enabledSites = Object.keys(sites).map(function(key) {
        return sites[key];
      });
    }
  }
});

// Set and show default options on install
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
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
									setDefaultOptions();
								})
							} else { setDefaultOptions(); }
						} );
				})
			} else { setDefaultOptions(); }
		} );
  } else if (details.reason == "update") {
    // User updated extension
  }
});

// Disable javascript for these sites/general paywall-scripts
chrome.webRequest.onBeforeRequest.addListener(function(details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  return {cancel: true};
  },
  {
    urls: ["*://*.tinypass.com/*", "*://*.poool.fr/*", "*://*.piano.io/*", "*://*.outbrain.com/*"],
    types: ["script"]
  },
  ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
  var requestHeaders = details.requestHeaders;

  var header_referer = '';
  for (var n in requestHeaders) {
	  if (requestHeaders[n].name.toLowerCase() == 'referer') {
		  header_referer = requestHeaders[n].value;
		  continue;
	  }
  }

  // remove cookies for sites medium platform (mainfest.json needs in permissions: <all_urls>)
  if (isSiteEnabled({url: '.medium.com'}) && details.url.indexOf('cdn-client.medium.com') !== -1 && header_referer.indexOf('.medium.com') === -1) {
		var domainVar = new URL(header_referer).hostname;
		chrome.cookies.getAll({domain: domainVar}, function(cookies) {
			for (var i=0; i<cookies.length; i++) {
				chrome.cookies.remove({url: (cookies[i].secure ? "https://" : "http://") + cookies[i].domain + cookies[i].path, name: cookies[i].name});
			}
	    });
  }

  // remove cookies for regional ADR sites of ad.nl (mainfest.json needs in permissions: <all_urls>)
  if (isSiteEnabled({url: '.ad.nl'})) {
	const ad_region_domains = ['bd.nl', 'ed.nl', 'tubantia.nl', 'bndestem.nl', 'pzc.nl', 'destentor.nl', 'gelderlander.nl'];
	var domainVar = new URL(details.url).hostname.replace('www.', '');
	if (ad_region_domains.includes(domainVar)) {
		chrome.cookies.getAll({domain: domainVar}, function(cookies) {
			for (var i=0; i<cookies.length; i++) {
				if (remove_cookies_select_drop['ad.nl'].includes(cookies[i].name)){
					chrome.cookies.remove({url: (cookies[i].secure ? "https://" : "http://") + cookies[i].domain + cookies[i].path, name: cookies[i].name});
				}
			}
		});
	}
  }

  // check for blocked regular expression: domain enabled, match regex, block on an internal or external regex
  for (var domain in blockedRegexes) {
	  if ((isSiteEnabled({url: '.'+ domain}) || isSiteEnabled({url: header_referer})) && details.url.match(blockedRegexes[domain])) {
			if (details.url.indexOf(domain) !== -1 || header_referer.indexOf(domain) !== -1) {
				// allow BG paywall-script to set cookies in homepage/sections (else no article-text)
				if (details.url.indexOf('meter.bostonglobe.com/js/') !== -1 && (header_referer === 'https://www.bostonglobe.com/'
						|| header_referer.indexOf('/?p1=BGHeader_') !== -1  || header_referer.indexOf('/?p1=BGMenu_') !== -1)) {
					chrome.webRequest.handlerBehaviorChanged(function () {});
					break;			
				} else if (header_referer.indexOf('theglobeandmail.com') !== -1 && !(header_referer.indexOf('/article-') !== -1)) {
					chrome.webRequest.handlerBehaviorChanged(function () {});
					break;
				}
				return { cancel: true };
			}
	  }
  }

  if (!isSiteEnabled(details)) {
    return;
  }

  var tabId = details.tabId;

  var useUserAgentMobile = false;
  var setReferer = false;

  // if referer exists, set it to google
  requestHeaders = requestHeaders.map(function (requestHeader) {
    if (requestHeader.name === 'Referer') {
      if (details.url.indexOf("cooking.nytimes.com/api/v1/users/bootstrap") !== -1) {
        // this fixes images not being loaded on cooking.nytimes.com main page
        // referrer has to be *nytimes.com otherwise returns 403
        requestHeader.value = 'https://cooking.nytimes.com';
      } else if (details.url.indexOf("ft.com") !== -1 || details.url.indexOf("kleinezeitung.at") !== -1) {
        requestHeader.value = 'https://www.facebook.com/';
      } else {
        requestHeader.value = 'https://www.google.com/';
      }
      setReferer = true;
    }
    if (requestHeader.name === 'User-Agent') {
      useUserAgentMobile = requestHeader.value.toLowerCase().includes("mobile");
    }

    return requestHeader;
  });

  // otherwise add it
  if (!setReferer) {
      if (details.url.indexOf("ft.com") !== -1 || details.url.indexOf("kleinezeitung.at") !== -1) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.facebook.com/'
      });
    } else {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.google.com/'
      });
    }
  }

  // override User-Agent to use Googlebot
  var useGoogleBot = use_google_bot.filter(function(item) {
    return typeof item == 'string' && details.url.indexOf(item) > -1;
  }).length > 0;

  if (useGoogleBot) {
    requestHeaders.push({
      "name": "User-Agent",
      "value": useUserAgentMobile ? userAgentMobile : userAgentDesktop
    })
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": "66.249.66.1"
    })
  }

  // remove cookies before page load
  requestHeaders = requestHeaders.map(function(requestHeader) {
    for (var siteIndex in allow_cookies) {
      if (details.url.indexOf(allow_cookies[siteIndex]) !== -1) {
        return requestHeader;
      }
    }
    if (requestHeader.name === 'Cookie') {
      requestHeader.value = '';
    }
    return requestHeader;
  });

  if (tabId !== -1) {
    // run contentScript inside tab
    chrome.tabs.executeScript(tabId, {
      file: 'contentScript.js',
      runAt: 'document_start'
    }, function(res) {
      if (chrome.runtime.lastError || res[0]) {
        return;
      }
    });
  }

  return { requestHeaders: requestHeaders };
}, {
  urls: ['<all_urls>']
}, ['blocking', 'requestHeaders', 'extraHeaders']);

// remove cookies after page load
chrome.webRequest.onCompleted.addListener(function(details) {
  for (var domainIndex in remove_cookies) {
    var domainVar = remove_cookies[domainIndex];
    if (!enabledSites.includes(domainVar) || details.url.indexOf(domainVar) === -1) {
      continue; // don't remove cookies
    }
    chrome.cookies.getAll({domain: domainVar}, function(cookies) {
		for (var i=0; i<cookies.length; i++) {
			var cookie_domain = cookies[i].domain;
			var rc_domain = cookie_domain.replace(/^(\.?www\.|\.)/, '');
			// hold specific cookie(s) from remove_cookies domains
			if ((rc_domain in remove_cookies_select_hold) && remove_cookies_select_hold[rc_domain].includes(cookies[i].name)) {
				continue; // don't remove specific cookie
			}
			// drop only specific cookie(s) from remove_cookies domains
			if ((rc_domain in remove_cookies_select_drop) && !(remove_cookies_select_drop[rc_domain].includes(cookies[i].name))) {
				continue; // only remove specific cookie
			}
			chrome.cookies.remove({url: (cookies[i].secure ? "https://" : "http://") + cookies[i].domain + cookies[i].path, name: cookies[i].name});
		}
    });
  }
}, {
  urls: ["<all_urls>"]
});

function isSiteEnabled(details) {
  var isEnabled = enabledSites.some(function(enabledSite) {
    var useSite = (details.url.indexOf("." + enabledSite) !== -1 || details.url.indexOf("/" + enabledSite) !== -1);
    if (enabledSite in restrictions) {
      return useSite && details.url.match(restrictions[enabledSite]);
    }
    return useSite;
  });
  return isEnabled;
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
  results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function stripQueryStringAndHashFromPath(url) {
  return url.split("?")[0].split("#")[0];
}
