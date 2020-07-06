/* Please respect alphabetical order when adding a site in any list */

'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;

// Cookies from this list are blocked by default (obsolete)
// defaultSites are loaded from sites.js at installation extension
// var defaultSites = {};

const restrictions = {
  'barrons.com': /.+barrons\.com\/(amp\/)?article(s)?\/.+/,
  'economist.com': /.+economist\.com\/.+\/\d{1,4}\/\d{1,2}\/\d{2}\/.+/,
  'elcomercio.pe': /.+\/elcomercio.pe\/.+((\w)+(\-)+){3,}.+/,
  'gestion.pe': /.+\/gestion.pe\/.+((\w)+(\-)+){3,}.+/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'seekingalpha.com': /.+seekingalpha\.com\/article\/.+/
}

// Don't remove cookies before page load
// allow_cookies are completed with domains in sites.js (default allow/remove_cookies)
var allow_cookies = [
'abc.es',
'aftonbladet.se',
'belfasttelegraph.co.uk',
'bostonglobe.com',
'business-standard.com',
'clarin.com',
'demorgen.be',
'dn.se',
'dvhn.nl',
'elmercurio.com',
'eurekareport.com.au',
'faz.net',
'folha.uol.com.br',
'ftm.nl',
'gestion.pe',
'haaretz.co.il',
'haaretz.com',
'handelsblatt.com',
'humo.be',
'ilfattoquotidiano.it',
'independent.ie',
'inkl.com',
'intelligentinvestor.com.au',
'knack.be',
'lc.nl',
'lrb.co.uk',
'mexiconewsdaily.com',
'modernhealthcare.com',
'nationalgeographic.com',
'nationalreview.com',
'newrepublic.com',
'nytimes.com',
'parool.nl',
'quora.com',
'scribd.com',
'seekingalpha.com',
'slader.com',
'switzersuperreport.com.au',
'techinasia.com',
'the-american-interest.com',
'theathletic.co.uk',
'theathletic.com',
'theaustralian.com.au',
'themarker.com',
'themercury.com.au',
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

// list of regional ad.nl sites
const ad_region_domains = ['bd.nl', 'ed.nl', 'tubantia.nl', 'bndestem.nl', 'pzc.nl', 'destentor.nl', 'gelderlander.nl'];

// select only specific cookie(s) to drop from remove_cookies domains
var remove_cookies_select_drop = {
	'ad.nl': ['temptationTrackingId'],
	'caixinglobal.com': ['CAIXINGLB_LOGIN_UUID'],
	'dn.se': ['randomSplusId'],
	'fd.nl': ['socialread'],
	'nrc.nl': ['counter'],
	'theatlantic.com': ['articleViews']
}
for (var domainIndex in ad_region_domains) {
	let domain = ad_region_domains[domainIndex];
	remove_cookies_select_drop[domain] = ['temptationTrackingId'];
}

// Override User-Agent with Googlebot
var use_google_bot_default = [
'abc.es',
'aftonbladet.se',
'barrons.com',
'dn.se',
'eurekareport.com.au',
'ft.com',
'haaretz.co.il',
'haaretz.com',
'handelsblatt.com',
'intelligentinvestor.com.au',
'mexiconewsdaily.com',
'miamiherald.com',
'quora.com',
'republic.ru',
'seekingalpha.com',
'switzersuperreport.com.au',
'theathletic.co.uk',
'theathletic.com',
'theaustralian.com.au',
'themarker.com',
'themercury.com.au',
'thetimes.co.uk',
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
'barrons.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
'belfasttelegraph.co.uk': /cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js/,
'bloomberg.com': /.+\.tinypass\.com\/.+/,
'bostonglobe.com': /meter\.bostonglobe\.com\/js\/.+/,
'businessinsider.com': /(.+\.tinypass\.com\/.+|cdn\.onesignal\.com\/sdks\/.+\.js)/,
'challenges.fr': /.+\.poool\.fr\/.+/,
'chicagobusiness.com': /.+\.tinypass\.com\/.+/,
'chicagotribune.com': /.+:\/\/.+\.tribdss\.com\//,
'corriere.it': /(\.rcsobjects\.it\/rcs_cpmt\/|\.rcsobjects\.it\/rcs_tracking-service\/|\.corriereobjects\.it\/.+\/js\/_paywall\.sjs|\.corriereobjects\.it\/.*\/js\/tracking\/|\.userzoom\.com\/files\/js\/|\.lp4\.io\/app\/)/,
'digiday.com': /.+\.tinypass\.com\/.+/,
'economist.com': /(.+\.tinypass\.com\/.+|economist\.com\/engassets\/_next\/static\/chunks\/framework.+\.js)/,
'estadao.com.br': /acesso\.estadao\.com\.br\/paywall\/.+\/pw\.js/,
'dvhn.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
'elcomercio.pe': /elcomercio\.pe\/pf\/dist\/template\/elcomercio-noticia.+\.js/,
'elmercurio.com': /merreader\.emol\.cl\/assets\/js\/vendor\/modal\.js/,
'elmundo.es': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
'elpais.com': /.+\.epimg\.net\/js\/.+\/noticia\.min\.js/,
'exame.abril.com.br': /.+\.tinypass\.com\/.+/,
'folha.uol.com.br': /.+\.folha\.uol\.com\.br\/paywall\/js\/.+\/publicidade\.ads\.js/,
'globo.com': /.+\.tinypass\.com\/.+/,
'foreignpolicy.com': /.+\.tinypass\.com\/.+/,
'fortune.com':  /.+\.tinypass\.com\/.+/,
'ftm.nl': /.+\.ftm\.nl\/js\/routing\?/,
'gestion.pe': /gestion\.pe\/pf\/dist\/template\/gestion-noticia.+\.js/,
'globes.co.il': /.+\.tinypass\.com\/.+/,
'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js.+/,
'historyextra.com': /.+\.evolok\.net\/.+\/authorize\/.+/,
'ilmessaggero.it': /(utils\.cedsdigital\.it\/js\/PaywallMeter\.js|static\.viralize\.tv\/viralize_player)/,
'independent.ie': /cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js/,
'inquirer.com': /.+\.tinypass\.com\/.+/,
'knack.be': /.+\.knack\.be\/js\/responsive\/rmgModal\.js/,
'ladepeche.fr': /.+\.poool\.fr\/.+/,
'lastampa.it': /.+\.repstatic\.it\/minify\/sites\/lastampa\/.+\/config\.cache\.php\?name=social_js/,
'lc.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
'lejdd.fr': /.+\.poool\.fr\/.+/,
'leparisien.fr': /.+\.tinypass\.com\/.+/,
'lesechos.fr': /.+\.tinypass\.com\/.+/,
'livemint.com': /(.+\.livemint\.com\/js\/localWorker\.js|analytics\.htmedia\.in\/analytics-js\/.+\.js)/,
'lopinion.fr': /.+\.poool\.fr\/.+/,
'lrb.co.uk': /.+\.tinypass\.com\/.+/,
'modernhealthcare.com': /.+\.tinypass\.com\/.+/,
'nationalgeographic.com': /.+\.blueconic\.net\/.+/,
'nationalreview.com': /.+\.blueconic\.net\/.+/,
'newrepublic.com': /.+\.onecount\.net\/js\/.+/,
'newsweek.com': /.+\.googletagmanager\.com\/gtm\.js/,
'nytimes.com': /(.+meter-svc\.nytimes\.com\/meter\.js.+|.+mwcm\.nyt\.com\/.+\.js)/,
'nzherald.co.nz': /nzherald\.co\.nz\/.+\/headjs\/.+\.js/,
'repubblica.it': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
'science-et-vie.com': /.+\.qiota\.com\/.+/,
'sciencesetavenir.fr': /.+\.poool\.fr\/.+/,
'sloanreview.mit.edu': /.+\.tinypass\.com\/.+/,
'spectator.co.uk': /.+\.tinypass\.com\/.+/,
'spectator.com.au': /.+\.tinypass\.com\/.+/,
'telegraph.co.uk': /.+\.tinypass\.com\/.+/,
'thedailybeast.com': /.+\.tinypass\.com\/.+/,
'thenation.com': /.+\.tinypass\.com\/.+/,
'valeursactuelles.com': /.+\.poool\.fr\/.+/,
'wsj.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/
};

const au_comm_media_domains = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
const au_news_corps_domains = ['adelaidenow.com.au', 'cairnspost.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'townsvillebulletin.com.au'];

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

    for (let key in sites_custom) {
        var domainVar = sites_custom[key]['domain'].toLowerCase();
        if (sites_custom[key]['googlebot'] > 0 && !use_google_bot.includes(domainVar)) {
            use_google_bot.push(domainVar);
        }
        if (sites_custom[key]['block_javascript'] > 0) {
            block_js_custom.push(domainVar);
        }
        if (sites_custom[key]['block_javascript_ext'] > 0) {
            block_js_custom_ext.push(domainVar);
        }
    }

    enabledSites = Object.keys(sites).filter(function (key) {
            return (sites[key] !== '' && sites[key] !== '###');
        }).map(function (key) {
            return sites[key].toLowerCase();
        });
    if (enabledSites.includes('ad.nl'))
        enabledSites = enabledSites.concat(ad_region_domains);
    if (enabledSites.includes('###_au_comm_media')) {
        enabledSites = enabledSites.concat(au_comm_media_domains);
        for (let domain of au_comm_media_domains) {
            blockedRegexes[domain] = /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/;
        }
    }
    if (enabledSites.includes('###_au_news_corps')) {
        enabledSites = enabledSites.concat(au_news_corps_domains);
        for (let domain of au_news_corps_domains) {
            allow_cookies.push(domain);
            use_google_bot_default.push(domain);
        }
		use_google_bot = use_google_bot_default.slice();
    }

    for (let domainVar of enabledSites) {
        if (!allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar)) {
            allow_cookies.push(domainVar);
            remove_cookies.push(domainVar);
        }
    }
    disableJavascriptOnListedSites();     
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
            if (enabledSites.includes('ad.nl'))
                enabledSites = enabledSites.concat(ad_region_domains);
            if (enabledSites.includes('###_au_comm_media'))
                enabledSites = enabledSites.concat(au_comm_media_domains);
            if (enabledSites.includes('###_au_news_corps'))
                enabledSites = enabledSites.concat(au_news_corps_domains);
            // reset disableJavascriptOnListedSites eventListener
            ext_api.webRequest.onBeforeRequest.removeListener(disableJavascriptOnListedSites);
            ext_api.webRequest.handlerBehaviorChanged();
        }
        if (key === 'sites_custom') {
            var sites_custom = storageChange.newValue;
            use_google_bot = use_google_bot_default.slice();
            block_js_custom = [];
            block_js_custom_ext = [];
            for (let key in sites_custom) {
                var domainVar = sites_custom[key]['domain'].toLowerCase();
                if (sites_custom[key]['googlebot'] > 0 && !use_google_bot.includes(domainVar)) {
                    use_google_bot.push(domainVar);
                }
                if (sites_custom[key]['block_javascript'] > 0) {
                    block_js_custom.push(domainVar);
                }
                if (sites_custom[key]['block_javascript_ext'] > 0) {
                    block_js_custom_ext.push(domainVar);
                }
            }

            // reset disableJavascriptOnListedSites eventListener
            ext_api.webRequest.onBeforeRequest.removeListener(disableJavascriptOnListedSites);
            ext_api.webRequest.handlerBehaviorChanged();
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

const faz_uaMobile = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Mobile Safari/537.36";
ext_api.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
    let headers = details.requestHeaders;
    headers.forEach(function (header, i) {
        if (header.name.toLowerCase() == 'user-agent')
            header.value = faz_uaMobile;
    });
    if (!details.originUrl && details.type == "xmlhttprequest" ||
        details.initiator == "https://www.faz.net" && details.type == "xmlhttprequest")
        return { requestHeaders: headers };
}, {
    urls: ["*://m.faz.net/*"]
},
    ["blocking", "requestHeaders"]);

var block_js_default = ["*://cdn.tinypass.com/*", "*://*.piano.io/*", "*://*.poool.fr/*",  "*://*.blueconic.net/*", "*://js.matheranalytics.com/*", "*://*.onecount.net/*", "*://*.qiota.com/*", "*://*.tribdss.com/*"];
var block_js_custom = [];
var block_js_custom_ext = [];
var block_js = block_js_default.concat(block_js_custom);

// Disable javascript for these sites/general paywall-scripts
function disableJavascriptOnListedSites() {
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
}

var extraInfoSpec = ['blocking', 'requestHeaders'];
if (ext_api.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS'))
  extraInfoSpec.push('extraHeaders');

ext_api.webRequest.onBeforeSendHeaders.addListener(function(details) {
  var requestHeaders = details.requestHeaders;

  var header_referer = '';
  for (var n in requestHeaders) {
	  if (requestHeaders[n].name.toLowerCase() == 'referer') {
		  header_referer = requestHeaders[n].value;
		  continue;
	  }
  }
  // fix brave browser
  if (!details.originUrl && !header_referer.includes(details.initiator))
      header_referer = details.initiator;

  // remove cookies for sites medium platform (custom domains)
  var medium_custom_domain = (matchUrlDomain('cdn-client.medium.com', details.url) && !matchUrlDomain('medium.com', header_referer) && isSiteEnabled({url: 'https://medium.com'}));
  if (medium_custom_domain) {
    ext_api.cookies.getAll({domain: urlHost(header_referer)}, function(cookies) {
      for (let cookie of cookies) {
        ext_api.cookies.remove({url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path, name: cookie.name});
      }
    });
  }
  
  // remove cookies Discover Magazine
  if (matchUrlDomain('ctfassets.net', details.url) && matchUrlDomain('discovermagazine.com', header_referer) && isSiteEnabled({url: 'https://www.discovermagazine.com'})) {
    ext_api.cookies.getAll({domain: 'discovermagazine.com'}, function(cookies) {
      for (let cookie of cookies) {
        ext_api.cookies.remove({url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path, name: cookie.name});
      }
    });
  }  
  
  // block external javascript for custom sites (optional)
  var domain_blockjs_ext = matchUrlDomain([block_js_custom_ext], header_referer);
  if (domain_blockjs_ext && !matchUrlDomain(domain_blockjs_ext, details.url) && details.url.match(/(\.js$|\.js\?)/) && isSiteEnabled({url: header_referer})) {
    return { cancel: true };
  }

  // check for blocked regular expression: domain enabled, match regex, block on an internal or external regex
  var blockedDomains = Object.keys(blockedRegexes);
  var domain = matchUrlDomain(blockedDomains, header_referer);
  if (domain && details.url.match(blockedRegexes[domain]) && isSiteEnabled({url: header_referer})) {
    return { cancel: true };
  }

  let inkl_site = (matchUrlDomain('cdn.jsdelivr.net', details.url) && matchUrlDomain('inkl.com', header_referer) && isSiteEnabled({url: header_referer}));
  if (!isSiteEnabled(details) && !(inkl_site)) {
    return;
  }

  // block javascript of (sub)domain for custom sites (optional)
  var domain_blockjs = matchUrlDomain([block_js_custom], details.url);
  if (domain_blockjs && matchUrlDomain(domain_blockjs, details.url) && details.url.match(/(\.js$|\.js\?)/)) {
    return { cancel: true };
  }

  var tabId = details.tabId;

  var useUserAgentMobile = false;
  var setReferer = false;

  // if referer exists, set it to google
  requestHeaders = requestHeaders.map(function (requestHeader) {
    if (requestHeader.name === 'Referer') {
      if (details.url.includes("cooking.nytimes.com/api/v1/users/bootstrap")) {
        // this fixes images not being loaded on cooking.nytimes.com main page
        // referrer has to be *nytimes.com otherwise returns 403
        requestHeader.value = 'https://cooking.nytimes.com';
      } else if (matchUrlDomain(['clarin.com', 'fd.nl'], details.url)) {
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
      if (matchUrlDomain(['clarin.com', 'fd.nl'], details.url)) {
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
  if (matchUrlDomain(use_google_bot, details.url)) {
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
  if (!matchUrlDomain(allow_cookies, details.url)) {
    requestHeaders = requestHeaders.map(function(requestHeader) {
      if (requestHeader.name === 'Cookie') {
        requestHeader.value = '';
      }
      return requestHeader;
    });
  }

  if (tabId !== -1) {
    ext_api.tabs.get(tabId, function (currentTab) {
      if (isSiteEnabled(currentTab) || medium_custom_domain) {
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
    });
  }

  return { requestHeaders: requestHeaders };
}, {
  urls: ['<all_urls>']
}, extraInfoSpec);
// extraInfoSpec is ['blocking', 'requestHeaders'] + possible 'extraHeaders'

ext_api.tabs.onUpdated.addListener(function (tabId, info, tab) { updateBadge(tab); });
ext_api.tabs.onActivated.addListener(function (activeInfo) { ext_api.tabs.get(activeInfo.tabId, updateBadge); });

function updateBadge (activeTab) {
  if (!activeTab) { return; }
  const badgeText = getTextB(activeTab.url);
  ext_api.browserAction.setBadgeBackgroundColor({color: 'red'});
  ext_api.browserAction.setBadgeText({text: badgeText});
}

function getTextB(currentUrl) {
    return currentUrl && isSiteEnabled({url: currentUrl}) ? 'ON' : '';
}

// remove cookies after page load
ext_api.webRequest.onCompleted.addListener(function (details) {
    var domainVar = matchUrlDomain(remove_cookies, details.url);
    if (!domainVar || !enabledSites.includes(domainVar))
        return;
    ext_api.cookies.getAll({
        domain: domainVar
    }, function (cookies) {
        for (let cookie of cookies) {
            var cookie_domain = cookie.domain;
            var rc_domain = cookie_domain.replace(/^(\.?www\.|\.)/, '');
            // hold specific cookie(s) from remove_cookies domains
            if ((rc_domain in remove_cookies_select_hold) && remove_cookies_select_hold[rc_domain].includes(cookie.name)) {
                continue; // don't remove specific cookie
            }
            // drop only specific cookie(s) from remove_cookies domains
            if ((rc_domain in remove_cookies_select_drop) && !(remove_cookies_select_drop[rc_domain].includes(cookie.name))) {
                continue; // only remove specific cookie
            }
            ext_api.cookies.remove({
                url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path,
                name: cookie.name
            });
        }
    });
}, {
    urls: ["<all_urls>"]
});

function isSiteEnabled(details) {
    var enabledSite = matchUrlDomain(enabledSites, details.url);
    if (enabledSite in restrictions) {
        return restrictions[enabledSite].test(details.url);
    }
    return !!enabledSite;
}

function matchDomain(domains, hostname) {
    var matched_domain = false;
    if (!hostname)
        hostname = window.location.hostname;
    if (typeof domains === 'string')
        domains = [domains];
    domains.some(domain => (hostname === domain || hostname.endsWith('.' + domain)) && (matched_domain = domain));
    return matched_domain;
}

function urlHost(url) {
    if (url && url.startsWith('http')) {
        try {
            return new URL(url).hostname;
        } catch (e) {
            console.log(`url not valid: ${url} error: ${e}`);
        }
    }
    return url;
}

function matchUrlDomain(domains, url) {
    return matchDomain(domains, urlHost(url));
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
