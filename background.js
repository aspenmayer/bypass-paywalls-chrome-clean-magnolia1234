/* Please respect alphabetical order when adding a site in any list */

'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;

// Cookies from this list are blocked by default (obsolete)
// defaultSites are loaded from sites.js at installation extension
// var defaultSites = {};

const restrictions = {
  'barrons.com': /.+barrons\.com\/(amp\/)?article(s)?\/.+/,
  'bloombergquint.com': /^((?!\.bloombergquint\.com\/bq-blue-exclusive\/).)*$/,
  'elcomercio.pe': /.+\/elcomercio.pe\/.+((\w)+(\-)+){3,}.+/,
  'gestion.pe': /.+\/gestion.pe\/.+((\w)+(\-)+){3,}.+/,
  'nknews.org': /^((?!\.nknews\.org\/pro\/).)*$/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'seekingalpha.com': /.+seekingalpha\.com\/article\/.+/,
  'wsj.com': /^((?!\/cn\.wsj\.com\/).)*$/
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
'chronicle.com',
'demorgen.be',
'df.cl',
'dn.se',
'dvhn.nl',
'editorialedomani.it',
'elmercurio.com',
'mercuriovalpo.cl',
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
'intelligentinvestor.com.au',
'knack.be',
'lc.nl',
'lesechos.fr',
'lesoir.be',
'limesonline.com',
'lrb.co.uk',
'mexiconewsdaily.com',
'modernhealthcare.com',
'nationalgeographic.com',
'nationalreview.com',
'newrepublic.com',
'nknews.org',
'noordhollandsdagblad.nl',
'nytimes.com',
'nzz.ch',
'parool.nl',
'quora.com',
'rollingstone.com',
'scribd.com',
'seekingalpha.com',
'slader.com',
'startribune.com',
'stocknews.com',
'techinasia.com',
'the-american-interest.com',
'thehindu.com',
'themarker.com',
'timeshighereducation.com',
'trouw.nl',
'variety.com',
'volkskrant.nl',
'washingtonpost.com',
'waz.de',
'worldpoliticsreview.com',
'zeit.de',
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
'df.cl',
'dn.se',
'editorialedomani.it',
'eurekareport.com.au',
'ft.com',
'haaretz.co.il',
'haaretz.com',
'handelsblatt.com',
'intelligentinvestor.com.au',
'lesoir.be',
'mexiconewsdaily.com',
'miamiherald.com',
'nzz.ch',
'quora.com',
'republic.ru',
'seekingalpha.com',
'themarker.com',
'thetimes.co.uk',
'washingtonpost.com',
'worldpoliticsreview.com',
'wsj.com',
'zeit.de',
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
'bizjournals.com': /(assets\.bizjournals\.com\/static\/js\/app\/cxense\.js|cdn\.cxense\.com)/,
'bloomberg.com': /.+\.tinypass\.com\/.+/,
'bostonglobe.com': /meter\.bostonglobe\.com\/js\/.+/,
'brisbanetimes.com.au': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
'businessinsider.com': /.+\.tinypass\.com\/.+/,
'challenges.fr': /.+\.poool\.fr\/.+/,
'charliehebdo.fr': /.+\.poool\.fr\/.+/,
'chicagobusiness.com': /.+\.tinypass\.com\/.+/,
'chicagotribune.com': /.+:\/\/.+\.tribdss\.com\/.+/,
'chronicle.com': /(.+\.blueconic\.net\/.+|assets\.login\.chronicle\.com\/common\/che-auth0-user\.js)/,
'clarin.com': /js\.matheranalytics\.com\/.+/,
'corriere.it': /(\.rcsobjects\.it\/(rcs_cpmt|rcs_tracking-service)\/|\.corriereobjects\.it\/.+\/js\/(_paywall\.sjs|tracking\/)|\.userzoom\.com\/files\/js\/|\.lp4\.io\/app\/)/,
'digiday.com': /.+\.tinypass\.com\/.+/,
'economist.com': /.+\.tinypass\.com\/.+/,
'editorialedomani.it': /editorialedomani\.it\/pelcro\.js/,
'estadao.com.br': /acesso\.estadao\.com\.br\/paywall\/.+\/pw\.js/,
'dvhn.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
'elcomercio.pe': /elcomercio\.pe\/pf\/dist\/template\/elcomercio-noticia.+\.js/,
'elmercurio.com': /(elmercurio\.com\/.+\/js\/modal\.js|merreader\.emol\.cl\/assets\/js\/(vendor\/modal|merPramV\d)\.js|staticmer(\d)?\.emol\.cl\/js\/.+\/(modal|PramModal\.min)\.js)/,
'elmundo.es': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
'elpais.com': /.+\.epimg\.net\/js\/.+\/noticia\.min\.js/,
'exame.abril.com.br': /.+\.tinypass\.com\/.+/,
'folha.uol.com.br': /.+\.folha\.uol\.com\.br\/paywall\/js\/.+\/publicidade\.ads\.js/,
'globo.com': /.+\.tinypass\.com\/.+/,
'foreignpolicy.com': /.+\.tinypass\.com\/.+/,
'fortune.com':  /.+\.tinypass\.com\/.+/,
'ftm.nl': /.+\.ftm\.nl\/js\/routing\?/,
'fresnobee.com': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
'gestion.pe': /gestion\.pe\/pf\/dist\/template\/gestion-noticia.+\.js/,
'globes.co.il': /.+\.tinypass\.com\/.+/,
'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js.+/,
'historyextra.com': /.+\.evolok\.net\/.+\/authorize\/.+/,
'ilmessaggero.it': /(utils\.cedsdigital\.it\/js\/PaywallMeter\.js|static\.viralize\.tv\/viralize_player)/,
'independent.ie': /cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js/,
'inquirer.com': /.+\.tinypass\.com\/.+/,
'irishtimes.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
'knack.be': /.+\.knack\.be\/js\/responsive\/rmgModal\.js/,
'ladepeche.fr': /.+\.poool\.fr\/.+/,
'lasegunda.com': /segreader\.emol\.cl\/assets\/js\/(vendor\/modal\.js|merPramV\d\.js)/,
'lastampa.it': /.+\.repstatic\.it\/minify\/sites\/lastampa\/.+\/config\.cache\.php\?name=social_js/,
'lc.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
'lejdd.fr': /.+\.poool\.fr\/.+/,
'leparisien.fr': /.+\.tinypass\.com\/.+/,
'lesechos.fr': /.+\.tinypass\.com\/.+/,
'limesonline.com': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
'livemint.com': /(.+\.livemint\.com\/js\/localWorker\.js|analytics\.htmedia\.in\/analytics-js\/.+\.js)/,
'lopinion.fr': /.+\.poool\.fr\/.+/,
'lrb.co.uk': /.+\.tinypass\.com\/.+/,
'mercuriovalpo.cl': /(.+\.mercuriovalpo\.cl\/impresa\/wp-content\/themes\/papel-digital-2019-desktop\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
'modernhealthcare.com': /.+\.tinypass\.com\/.+/,
'nationalgeographic.com': /.+\.blueconic\.net\/.+/,
'nationalreview.com': /(.+\.blueconic\.net\/.+|cdn\.ampproject\.org\/v\d\/amp-access-.+\.js)/,
'newrepublic.com': /.+\.onecount\.net\/js\/.+/,
'newsweek.com': /.+\.googletagmanager\.com\/gtm\.js/,
'newyorker.com': /.+\.newyorker\.com\/verso\/static\/presenter-articles.+\.js/,
'nknews.org': /.+\.nknews\.org\/wp-content\/plugins\/leaky-paywall-ajax\/js\/leaky-paywall-ajax\.js/,
'nytimes.com': /(.+meter-svc\.nytimes\.com\/meter\.js.+|.+mwcm\.nyt\.com\/.+\.js)/,
'nzherald.co.nz': /nzherald\.co\.nz\/.+\/headjs\/.+\.js/,
'repubblica.it': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
'rollingstone.com': /cdn\.cxense\.com/,
'sacbee.com': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
'science-et-vie.com': /.+\.qiota\.com\/.+/,
'sciencesetavenir.fr': /.+\.poool\.fr\/.+/,
'scmp.com': /.+\.tinypass\.com\/.+/,
'sfchronicle.com': /.+\.blueconic\.net\/.+/,
'sloanreview.mit.edu': /(.+\.tinypass\.com\/.+|.+\.netdna-ssl\.com\/wp-content\/themes\/smr\/assets\/js\/libs\/welcome-ad\.js)/,
'smh.com.au': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
'spectator.co.uk': /.+\.tinypass\.com\/.+/,
'spectator.com.au': /.+\.tinypass\.com\/.+/,
'technologyreview.com': /.+\.blueconic\.net\/.+/,
'telegraph.co.uk': /.+\.tinypass\.com\/.+/,
'theage.com.au': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
'thedailybeast.com': /.+\.tinypass\.com\/.+/,
'thehindu.com': /ajax\.cloudflare\.com\/cdn-cgi\/scripts\/.+\/cloudflare-static\/rocket-loader\.min\.js/,
'thenation.com': /.+\.tinypass\.com\/.+/,
'valeursactuelles.com': /.+\.qiota\.com\/.+/,
'variety.com': /cdn\.cxense\.com/,
'washingtonpost.com': /.+\.washingtonpost\.com\/dr\/resources\/dist\/washpost\/pwapi-proxy\.min\.js/,
'watoday.com.au': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
'waz.de': /(.+\.tinypass\.com\/.+|cdn\.cxense\.com)/,
'wsj.com': /(cdn\.ampproject\.org\/v\d\/amp-access-.+\.js|cdn\.cxense\.com)/
};

const au_comm_media_domains = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
const au_news_corp_domains = ['adelaidenow.com.au', 'cairnspost.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'theaustralian.com.au', 'themercury.com.au', 'townsvillebulletin.com.au', 'weeklytimesnow.com.au'];
const au_prov_news_domains = ['news-mail.com.au', 'frasercoastchronicle.com.au', 'gladstoneobserver.com.au', 'dailyexaminer.com.au', 'dailymercury.com.au', 'themorningbulletin.com.au', 'sunshinecoastdaily.com.au', 'gympietimes.com.au', 'northernstar.com.au', 'qt.com.au', 'thechronicle.com.au', 'warwickdailynews.com.au'];

const userAgentDesktop = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobile = "Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

var enabledSites = [];
var disabledSites = [];
var defaultSites_domains = Object.values(defaultSites);
var customSites = {};
var customSites_domains = [];

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
    customSites = sites_custom;
    customSites_domains = Object.values(sites_custom).map(x => x.domain);
    disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
    if (enabledSites.includes('ad.nl'))
        enabledSites = enabledSites.concat(ad_region_domains);
    if (enabledSites.includes('###_au_comm_media')) {
        enabledSites = enabledSites.concat(au_comm_media_domains);
        for (let domain of au_comm_media_domains) {
            allow_cookies.push(domain);
            blockedRegexes[domain] = /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/;
        }
    } else
        disabledSites = disabledSites.concat(au_comm_media_domains);
    if (enabledSites.includes('###_au_news_corp')) {
        enabledSites = enabledSites.concat(au_news_corp_domains);
        for (let domain of au_news_corp_domains) {
            allow_cookies.push(domain);
            use_google_bot_default.push(domain);
        }
        use_google_bot = use_google_bot_default.slice();
    } else
        disabledSites = disabledSites.concat(au_news_corp_domains);
    if (enabledSites.includes('###_au_prov_news')) {
        enabledSites = enabledSites.concat(au_prov_news_domains);
        for (let domain of au_prov_news_domains) {
            allow_cookies.push(domain);
        }
    } else
        disabledSites = disabledSites.concat(au_prov_news_domains);

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
            disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
            if (enabledSites.includes('ad.nl'))
                enabledSites = enabledSites.concat(ad_region_domains);
            if (enabledSites.includes('###_au_comm_media'))
                enabledSites = enabledSites.concat(au_comm_media_domains);
            else
                disabledSites = disabledSites.concat(au_comm_media_domains);
            if (enabledSites.includes('###_au_news_corp'))
                enabledSites = enabledSites.concat(au_news_corp_domains);
            else
                disabledSites = disabledSites.concat(au_news_corp_domains);
            if (enabledSites.includes('###_au_prov_news'))
                enabledSites = enabledSites.concat(au_prov_news_domains);
            else
                disabledSites = disabledSites.concat(au_prov_news_domains);
            // reset disableJavascriptOnListedSites eventListener
            ext_api.webRequest.onBeforeRequest.removeListener(disableJavascriptOnListedSites);
            ext_api.webRequest.handlerBehaviorChanged();
        }
        if (key === 'sites_custom') {
            var sites_custom = storageChange.newValue;
            var sites_custom_old = storageChange.oldValue;
            customSites = sites_custom;
            customSites_domains = Object.values(sites_custom).map(x => x.domain);

            // add/remove custom sites in options
            var sites_custom_added = Object.keys(sites_custom).filter(x => !Object.keys(sites_custom_old).includes(x) && !defaultSites.hasOwnProperty(x));
            var sites_custom_removed = Object.keys(sites_custom_old).filter(x => !Object.keys(sites_custom).includes(x) && !defaultSites.hasOwnProperty(x));

            chrome.storage.sync.get({
                sites: {}
            }, function (items) {
                var sites = items.sites;
                for (var key of sites_custom_added)
                    sites[key] = sites_custom[key].domain;
                for (var key of sites_custom_removed)
                    delete sites[key];

                chrome.storage.sync.set({
                    sites: sites
                }, function () {
                    true;
                });
            });

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
        // Refresh the current tab
        ext_api.tabs.query({
            active: true,
            currentWindow: true
        }, function (tabs) {
            if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
                ext_api.tabs.update(tabs[0].id, {
                    url: tabs[0].url
                });
            }
        });
    }
});

// Set and show default options on install
ext_api.runtime.onInstalled.addListener(function (details) {
  if (details.reason == "install") {
    setDefaultOptions();
  } else if (details.reason == "update") {
    ext_api.management.getSelf(function (result) {
      if (enabledSites.includes('#options_on_update') && result.installType !== 'development')
        ext_api.runtime.openOptionsPage(); // User updated extension (non-developer mode)
    });
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

var block_js_default = ["*://cdn.tinypass.com/*", "*://*.piano.io/*", "*://*.poool.fr/*",  "*://*.blueconic.net/*", "*://*.cxense.com/*", "*://*.evolok.net/*", "*://js.matheranalytics.com/*", "*://*.onecount.net/*", "*://*.qiota.com/*", "*://*.tribdss.com/*"];
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
        types: ["script", "xmlhttprequest"]
    },
        ["blocking"]);
}

var extraInfoSpec = ['blocking', 'requestHeaders'];
if (ext_api.webRequest.OnBeforeSendHeadersOptions.hasOwnProperty('EXTRA_HEADERS'))
  extraInfoSpec.push('extraHeaders');

ext_api.webRequest.onBeforeSendHeaders.addListener(function(details) {
  if (details.type === 'main_frame') {
    let current_date_str = currentDateStr();
    if (last_date_str < current_date_str) {
      bpc_count_daily_users(current_date_str);
      last_date_str = current_date_str;
    }
  }

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
  var domain_blockjs_ext = matchUrlDomain(block_js_custom_ext, header_referer);
  if (domain_blockjs_ext && !matchUrlDomain(domain_blockjs_ext, details.url) && details.url.match(/(\.js$|\.js\?|\/json\?)/) && isSiteEnabled({url: header_referer})) {
    return { cancel: true };
  }

  // check for blocked regular expression: domain enabled, match regex, block on an internal or external regex
  var blockedDomains = Object.keys(blockedRegexes);
  var domain = matchUrlDomain(blockedDomains, header_referer);
  var block_regex = true;
  if (domain && details.url.match(blockedRegexes[domain]) && isSiteEnabled({url: header_referer})) {
    if (block_regex)
      return { cancel: true };
  }

  let inkl_site = (matchUrlDomain('cdn.jsdelivr.net', details.url) && matchUrlDomain('inkl.com', header_referer) && isSiteEnabled({url: header_referer}));
  let bloomberg_site = (matchUrlDomain('assets.bwbx.io', details.url) && matchUrlDomain('bloomberg.com', header_referer) && isSiteEnabled({url: header_referer}));
  if (!isSiteEnabled(details) && !(inkl_site) && !(bloomberg_site)) {
    return;
  }

  // block javascript of (sub)domain for custom sites (optional)
  var domain_blockjs = matchUrlDomain(block_js_custom, details.url);
  if (domain_blockjs && matchUrlDomain(domain_blockjs, details.url) && details.url.match(/(\.js$|\.js\?|\/json\?)/)) {
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

  if (!['image', 'font', 'stylesheet'].includes(details.type)) {
  if (tabId !== -1) {
    ext_api.tabs.get(tabId, function (currentTab) {
      if (isSiteEnabled(currentTab) || medium_custom_domain) {
        ext_api.tabs.executeScript(tabId, {
           file: 'contentScript.js',
           runAt: 'document_start'
        }, function (res) {
           if (ext_api.runtime.lastError || res[0]) {
             return;
           }
         });
       }
    });
  } else {//mercuriovalpo.cl
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
        if (isSiteEnabled({url: tabs[0].url}) || medium_custom_domain) {
          ext_api.tabs.executeScript({
            file: 'contentScript.js',
            runAt: 'document_start'
          }, function (res) {
            if (ext_api.runtime.lastError || res[0]) {
              return;
            }
          });
        }
      }
    });
  }
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
  let badgeText = '';
  let color = 'red';
  let currentUrl = activeTab.url;
  if (currentUrl) {
    let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
    if (isSiteEnabled({url: currentUrl})) {
      badgeText = 'ON';
      color = 'red';
    } else if (matchUrlDomain(enabledSites, currentUrl)) {
      badgeText = 'ON-';
      color = 'orange';  
    } else if (matchUrlDomain(disabledSites, currentUrl)) {
      badgeText = 'OFF';
      color = 'blue';  
    }
  }
  ext_api.browserAction.setBadgeBackgroundColor({color: color});
  ext_api.browserAction.setBadgeText({text: badgeText});
}

function site_switch() {
    ext_api.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
            let currentUrl = tabs[0].url;
            let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
            let defaultSite_title = isDefaultSite ? Object.keys(defaultSites).find(key => defaultSites[key] === isDefaultSite) : '';
            let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
            let customSite_title = isCustomSite ? Object.keys(customSites).find(key => customSites[key].domain === isCustomSite) : '';
            let site_title = defaultSite_title || customSite_title;
            let domain = isDefaultSite || isCustomSite;
            if (domain) {
                let added_site = [];
                let removed_site = [];
                if (enabledSites.includes(domain))
                    removed_site.push(site_title);
                else
                    added_site.push(site_title);
                chrome.storage.sync.get({
                    sites: {}
                }, function (items) {
                    var sites = items.sites;
                    for (var key of added_site)
                        sites[key] = domain;
                    for (var key of removed_site)
                        delete sites[key];

                    chrome.storage.sync.set({
                        sites: sites
                    }, function () {
                        true;
                    });
                });
            }
        }
    });
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

ext_api.runtime.onMessage.addListener(function (message, sender) {
    // check storage for opt in
    ext_api.storage.sync.get("optIn", function (result) {
        // send message back to content script with value of opt in
        ext_api.tabs.sendMessage(
            sender.tab.id, {
            "optIn": (true == result.optIn)
        });
    });
});

// show the tab if we haven't registered the user reacting to the prompt.
ext_api.storage.sync.get("optInShown", function (result) {
    if (!result.optInShown) {
        ext_api.tabs.create({
            url: "optin/opt-in.html"
        });
    }
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

