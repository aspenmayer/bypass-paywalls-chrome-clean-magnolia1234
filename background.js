/* Please respect alphabetical order when adding a site in any list */

'use strict';
var ext_api = chrome || browser;

// Cookies from this list are blocked by default (obsolete)
// defaultSites are loaded from sites.js at installation extension
// var defaultSites = {};

const restrictions = {
  'barrons.com': /.+barrons\.com\/articles\/.+/,
  'wsj.com': /(.+wsj\.com\/articles\/.+|.+blogs\.wsj\.com\/.+)/
}

// Don't remove cookies before page load
// allow_cookies are completed with domains in sites.js (default allow/remove_cookies)
var allow_cookies = [
'adelaidenow.com.au',
'aftonbladet.se',
'bostonglobe.com',
'cairnspost.com.au',
'clarin.com',
'couriermail.com.au',
'dailytelegraph.com.au',
'demorgen.be',
'dn.se',
'dvhn.nl',
'elmercurio.com',
'fd.nl',
'folha.uol.com.br',
'goldcoastbulletin.com.au',
'haaretz.co.il',
'haaretz.com',
'handelsblatt.com',
'heraldsun.com.au',
'humo.be',
'kleinezeitung.at',
'lemonde.fr',
'lc.nl',
'lrb.co.uk',
'mexiconewsdaily.com',
'modernhealthcare.com',
'nationalreview.com',
'newrepublic.com',
'ntnews.com.au',
'nytimes.com',
'parool.nl',
'quora.com',
'scribd.com',
'seekingalpha.com',
'techinasia.com',
'telegraph.co.uk',
'the-american-interest.com',
'theathletic.co.uk',
'theathletic.com',
'theaustralian.com.au',
'themarker.com',
'themercury.com.au',
'thetimes.co.uk',
'townsvillebulletin.com.au',
'trouw.nl',
'volkskrant.nl',
'weeklytimesnow.com.au',
'worldpoliticsreview.com',
]

// Removes cookies after page load
// remove_cookies are completed with domains of sites.js (default allow/remove_cookies)
var remove_cookies = [
]

// select specific cookie(s) to hold from remove_cookies domains
const remove_cookies_select_hold = {
	'barrons.com': ['wsjregion'],
	'newstatesman.com': ['STYXKEY_nsversion'],
	'qz.com': ['gdpr'],
	'washingtonpost.com': ['wp_gdpr'],
	'wsj.com': ['wsjregion']
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
const use_google_bot_default = [
'adelaidenow.com.au',
'aftonbladet.se',
'barrons.com',
'cairnspost.com.au',
'couriermail.com.au',
'dailytelegraph.com.au',
'dn.se',
'fd.nl',
'ft.com',
'goldcoastbulletin.com.au',
'haaretz.co.il',
'haaretz.com',
'handelsblatt.com',
'heraldsun.com.au',
'lemonde.fr',
'mexiconewsdaily.com',
'ntnews.com.au',
'quora.com',
'seekingalpha.com',
'telegraph.co.uk',
'theathletic.co.uk',
'theathletic.com',
'theaustralian.com.au',
'themarker.com',
'themercury.com.au',
'thetimes.co.uk',
'townsvillebulletin.com.au',
'weeklytimesnow.com.au',
'worldpoliticsreview.com',
'wsj.com',
];
var use_google_bot_custom = [];
var use_google_bot = use_google_bot_default.concat(use_google_bot_custom);

// block paywall-scripts individually
var blockedRegexes = {
'adweek.com': /.+\.lightboxcdn\.com\/.+/,
'afr.com': /afr\.com\/assets\/vendorsReactRedux_client.+\.js/,
'americanbanker.com': /.+\.tinypass\.com\/.+/,
'bloomberg.com': /.+\.tinypass\.com\/.+/,
'bostonglobe.com': /meter\.bostonglobe\.com\/js\/.+/,
'businessinsider.com': /(.+\.tinypass\.com\/.+|cdn\.onesignal\.com\/sdks\/.+\.js)/,
'challenges.fr': /.+\.poool\.fr\/.+/,
'chicagobusiness.com': /.+\.tinypass\.com\/.+/,
'chicagotribune.com': /.+:\/\/.+\.tribdss\.com\//,
'corriere.it': /(\.rcsobjects\.it\/rcs_cpmt\/|\.rcsobjects\.it\/rcs_tracking-service\/|\.corriereobjects\.it\/.+\/js\/_paywall\.sjs|\.corriereobjects\.it\/.*\/js\/tracking\/|\.userzoom\.com\/files\/js\/|\.lp4\.io\/app\/)/,
'digiday.com': /.+\.tinypass\.com\/.+/,
'economist.com': /(.+\.tinypass\.com\/.+|economist\.com\/_next\/static\/runtime\/main.+\.js)/,
'elmercurio.com': /merreader\.emol\.cl\/assets\/js\/vendor\/modal\.js/,
'elpais.com': /.+\.epimg\.net\/js\/.+\/noticia\.min\.js/,
'exame.abril.com.br': /.+\.tinypass\.com\/.+/,
'folha.uol.com.br': /.+\.folha\.uol\.com\.br\/paywall\/js\/.+\/publicidade\.ads\.js/,
'globo.com': /.+\.tinypass\.com\/.+/,
'foreignpolicy.com': /.+\.tinypass\.com\/.+/,
'fortune.com':  /.+\.tinypass\.com\/.+/,
'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js.+/,
'inquirer.com': /.+\.tinypass\.com\/.+/,
'ladepeche.fr': /.+\.poool\.fr\/.+/,
'lastampa.it': /.+\.repstatic\.it\/minify\/sites\/lastampa\/.+\/config\.cache\.php\?name=social_js/,
'lejdd.fr': /.+\.swisspay\.ch\/.+/,
'leparisien.fr': /.+\.tinypass\.com\/.+/,
'lesechos.fr': /.+\.tinypass\.com\/.+/,
'lopinion.fr': /.+\.poool\.fr\/.+/,
'lrb.co.uk': /.+\.tinypass\.com\/.+/,
'modernhealthcare.com': /.+\.tinypass\.com\/.+/,
'nationalreview.com': /.+\.blueconic\.net\/.+/,
'newcastleherald.com.au': /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/,
'newrepublic.com': /.+\.onecount\.net\/js\/.+/,
'nytimes.com': /(.+meter-svc\.nytimes\.com\/meter\.js.+|.+mwcm\.nyt\.com\/.+\.js)/,
'nzherald.co.nz': /nzherald\.co\.nz\/.+\/headjs\/.+\.js/,
'portnews.com.au': /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/,
'repubblica.it': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
'sloanreview.mit.edu': /.+\.tinypass\.com\/.+/,
'spectator.co.uk': /.+\.tinypass\.com\/.+/,
'spectator.com.au': /.+\.tinypass\.com\/.+/,
'telegraph.co.uk': /.+\.tinypass\.com\/.+/,
'theadvocate.com.au': /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/,
'thecourier.com.au': /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/,
'thedailybeast.com': /.+\.tinypass\.com\/.+/,
'theglobeandmail.com': /theglobeandmail\.com\/pb\/resources\/scripts\/build\/chunk-bootstraps\/.+\.js/,
'thenation.com': /.+\.tinypass\.com\/.+/,
'valeursactuelles.com': /.+\.poool\.fr\/.+/
};

const userAgentDesktop = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobile = "Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

var enabledSites = [];

function setDefaultOptions() {
  ext_api.storage.sync.set({
    sites: defaultSites
  }, function() {
    ext_api.runtime.openOptionsPage();
  });
}

// Get the enabled sites (from local storage) & add to allow/remove_cookies (if not already in one of these arrays)
// Add googlebot- and block_javascript-settings for custom sites
ext_api.storage.sync.get({
    sites: {},
    sites_custom: {}
}, function (items) {
    var sites = items.sites;
    var sites_custom = items.sites_custom;

    // custom googlebot
    use_google_bot_custom = Object.keys(sites_custom).filter(function (key) {
            return sites_custom[key]['googlebot'] > 0;
        }).map(function (key) {
            return sites_custom[key]['domain'].toLowerCase();
        });
    use_google_bot = use_google_bot_default.slice();

    // custom block javascript (only (sub)domain)
    block_js_custom = Object.keys(sites_custom).filter(function (key) {
            return sites_custom[key]['block_javascript'] > 0;
        }).map(function (key) {
            return sites_custom[key]['domain'].toLowerCase();
        });
    block_js = block_js_default.slice();

    enabledSites = Object.keys(sites).filter(function (key) {
            return (sites[key] !== '' && sites[key] !== '###');
        }).map(function (key) {
            return sites[key].toLowerCase();
        });

    for (var domainIndex in enabledSites) {
        var domainVar = enabledSites[domainIndex];
        if (!allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar)) {
            allow_cookies.push(domainVar);
            remove_cookies.push(domainVar);
        }
        if (use_google_bot_custom.includes(domainVar)) {
            use_google_bot.push(domainVar);
        }
        if (block_js_custom.includes(domainVar)) {
            block_js.push("*://*." + domainVar + "/*"); // subdomains of site
            block_js.push("*://" + domainVar + "/*"); // site without www.-prefix
        }
    }
});

// Listen for changes to options
ext_api.storage.onChanged.addListener(function (changes, namespace) {
    for (var key in changes) {
        var storageChange = changes[key];
        if (key === 'sites') {
            var sites = storageChange.newValue;
            enabledSites = Object.keys(sites).filter(function (key) {
                    return (sites[key] !== '' && sites[key] !== '###');
                }).map(function (key) {
                    return sites[key];
                });
        }
        if (key === 'sites_custom') {
            var sites_custom = storageChange.newValue;

            use_google_bot_custom = Object.keys(sites_custom).filter(function (key) {
                    return sites_custom[key]['googlebot'] > 0;
                }).map(function (key) {
                    return sites_custom[key]['domain'].toLowerCase();
                });
            use_google_bot = use_google_bot_default.slice();
            for (var domainIndex in use_google_bot_custom) {
                var domainVar = use_google_bot_custom[domainIndex];
                if (domainVar && !use_google_bot.includes(domainVar)) {
                    use_google_bot.push(domainVar);
                }
            }

            block_js_custom = Object.keys(sites_custom).filter(function (key) {
                    return sites_custom[key]['block_javascript'] > 0;
                }).map(function (key) {
                    return sites_custom[key]['domain'].toLowerCase();
                });
            block_js = block_js_default.slice();
            for (var domainIndex in block_js_custom) {
                var domainVar = block_js_custom[domainIndex];
                if (domainVar && !block_js.includes(domainVar)) {
                    block_js.push("*://*." + domainVar + "/*"); // subdomains of site
                    block_js.push("*://" + domainVar + "/*"); // site without www.-prefix
                }
            }
        }
    }
});

// Set and show default options on install
ext_api.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    setDefaultOptions();
  } else if (details.reason == "update") {
    // User updated extension
  }
});

// repubblica.it bypass
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace('/pwa/', '/ws/detail/');
  return { redirectUrl: updatedUrl };
},
{urls:["*://*.repubblica.it/pwa/*"], types:["main_frame"]},
["blocking"]
);

var block_js_default = ["*://*.tinypass.com/*", "*://*.poool.fr/*", "*://*.piano.io/*", "*://*.outbrain.com/*"];
var block_js_custom = [];
var block_js = block_js_default.concat(block_js_custom);
// Disable javascript for these sites/general paywall-scripts
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
    if (!isSiteEnabled(details)) {
        return;
    }
    return {
        cancel: true
    };
}, {
    urls: block_js,
    types: ["script"]
},
    ["blocking"]);

var extraInfoSpec = ['blocking', 'requestHeaders'];
if (ext_api.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS'))
  extraInfoSpec.push('extraHeaders');

// list of regional ad.nl sites
const ad_region_domains = ['bd.nl', 'ed.nl', 'tubantia.nl', 'bndestem.nl', 'pzc.nl', 'destentor.nl', 'gelderlander.nl'];
ext_api.webRequest.onBeforeSendHeaders.addListener(function(details) {
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
		ext_api.cookies.getAll({domain: domainVar}, function(cookies) {
			for (var i=0; i<cookies.length; i++) {
				ext_api.cookies.remove({url: (cookies[i].secure ? "https://" : "http://") + cookies[i].domain + cookies[i].path, name: cookies[i].name});
			}
	    });
  }

  // remove cookies for regional ADR sites of ad.nl (mainfest.json needs in permissions: <all_urls>)
  if (isSiteEnabled({url: '.ad.nl'})) {
	var domainVar = new URL(details.url).hostname.replace('www.', '');
	if (ad_region_domains.includes(domainVar)) {
		ext_api.cookies.getAll({domain: domainVar}, function(cookies) {
			for (var i=0; i<cookies.length; i++) {
				if (remove_cookies_select_drop['ad.nl'].includes(cookies[i].name)){
					ext_api.cookies.remove({url: (cookies[i].secure ? "https://" : "http://") + cookies[i].domain + cookies[i].path, name: cookies[i].name});
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
					ext_api.webRequest.handlerBehaviorChanged(function () {});
					break;
				} else if (header_referer.indexOf('theglobeandmail.com') !== -1 && !(header_referer.indexOf('/article-') !== -1)) {
					ext_api.webRequest.handlerBehaviorChanged(function () {});
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
      } else if (details.url.indexOf("clarin.com") !== -1 || details.url.indexOf("kleinezeitung.at") !== -1) {
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
      if (details.url.indexOf("clarin.com") !== -1 || details.url.indexOf("kleinezeitung.at") !== -1) {
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
    ext_api.tabs.executeScript(tabId, {
      file: 'contentScript.js',
      runAt: 'document_start'
    }, function(res) {
      if (ext_api.runtime.lastError || res[0]) {
        return;
      }
    });
  }

  return { requestHeaders: requestHeaders };
}, {
  urls: ['<all_urls>']
}, extraInfoSpec);
// extraInfoSpec is ['blocking', 'requestHeaders'] + possible 'extraHeaders'

ext_api.tabs.onUpdated.addListener(updateBadge);
ext_api.tabs.onActivated.addListener(updateBadge);

function updateBadge() {
    ext_api.tabs.query({
        active: true,
        currentWindow: true
    }, function (arrayOfTabs) {
        var activeTab = arrayOfTabs[0];
        if (!activeTab)
            return;
        var textB = getTextB(activeTab.url);
        ext_api.browserAction.setBadgeBackgroundColor({color: "red"});
        ext_api.browserAction.setBadgeText({text: textB});
    });
}

function getTextB(currentUrl) {
    // check regional ad.nl site
    let is_adr_site = false;
    if (currentUrl && isSiteEnabled({url: '.ad.nl'})) {
        let domainVar = new URL(currentUrl).hostname.replace('www.', '');
        is_adr_site = ad_region_domains.includes(domainVar);
    }
    return currentUrl && (isSiteEnabled({url: currentUrl}) || is_adr_site) ? 'ON' : '';
}

// remove cookies after page load
ext_api.webRequest.onCompleted.addListener(function (details) {
    for (var domainIndex in remove_cookies) {
        var domainVar = remove_cookies[domainIndex];
        if (!enabledSites.includes(domainVar) || details.url.indexOf(domainVar) === -1) {
            continue; // don't remove cookies
        }
        ext_api.cookies.getAll({
            domain: domainVar
        }, function (cookies) {
            for (var i = 0; i < cookies.length; i++) {
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
                ext_api.cookies.remove({
                    url: (cookies[i].secure ? "https://" : "http://") + cookies[i].domain + cookies[i].path,
                    name: cookies[i].name
                });
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
