/* Please respect alphabetical order when adding a site in any list */

'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;
var manifestData = ext_api.runtime.getManifest();
var ext_name = manifestData.name;
var ext_version = manifestData.version;

const cs_limit_except = ['elespanol.com', 'faz.net', 'inkl.com', 'nation.africa', 'nationalgeographic.com'];
var currentTabUrl = '';
var csDone = false;
var optin_setcookie = false;

// defaultSites are loaded from sites.js at installation extension

const restrictions = {
  'adweek.com': /^((?!\.adweek\.com\/(.+\/)?(amp|agencyspy|tvnewser|tvspy)\/).)*$/,
  'barrons.com': /.+\.barrons\.com\/(amp\/)?article(s)?\/.+/,
  'bloomberg.com': /^((?!\.bloomberg\.com\/news\/terminal\/).)*$/,
  'bloombergquint.com': /^((?!\.bloombergquint\.com\/bq-blue-exclusive\/).)*$/,
  'economictimes.com': /.+\.economictimes\.com\/($|(__assets|prime)(\/.+)?|.+\.cms)/,
  'elespanol.com': /^((?!\/cronicaglobal\.elespanol\.com\/).)*$/,
  'elpais.com': /(\/elpais\.com\/$|(static|imagenes(\.\w+)?)\.elpais\.com|\/(.+\.)?elpais\.com\/.+\.html)/,
  'faz.net': /^((?!\/.+\.faz\.net\/aktuell\/(\?switchfaznet)?$).)*$/,
  'foreignaffairs.com': /.+\.foreignaffairs\.com\/(articles|fa-caching|interviews|reviews|sites)\/.+/,
  'ft.com': /.+\.ft\.com\/content\//,
  'medianama.com': /\.medianama\.com\/((\d){4}\/(\d){2}|wp-content)\//,
  'timesofindia.com': /.+\.timesofindia\.com\/($|toi-plus(\/.+)?|.+\.cms)/,
  'nknews.org': /^((?!nknews\.org\/pro\/).)*$/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'seekingalpha.com': /.+\/seekingalpha\.com\/($|(amp\/)?(article|news)\/|samw\/)/,
  'statista.com': /^((?!\.statista\.com\/(outlook|study)\/).)*$/,
  'techinasia.com': /\.techinasia\.com\/.+/,
  'theglobeandmail.com': /\.theglobeandmail\.com\/.+\//,
  'timeshighereducation.com':  /.+\.timeshighereducation\.com\/(sites\/default\/files\/|.+((\w)+(\-)+){3,}.+)/
}

// Don't remove cookies before/after page load
var allow_cookies = [];
var remove_cookies = [];
// select specific cookie(s) to hold/drop from remove_cookies domains
var remove_cookies_select_hold, remove_cookies_select_drop;

// Set User-Agent
var use_google_bot, use_bing_bot;
// Set Referer
var use_facebook_referer, use_google_referer, use_twitter_referer;
// Set random IP-address
var use_random_ip = ['esprit.presse.fr'];
// concat all sites with change of headers (useragent, referer or random ip)
var change_headers;

// block paywall-scripts individually
var blockedRegexes = {};

// unhide text on amp-page
var amp_unhide;

// custom: block javascript
var block_js_custom = [];
var block_js_custom_ext = [];

function initSetRules() {
  allow_cookies = [];
  remove_cookies = [];
  remove_cookies_select_drop = {};
  remove_cookies_select_hold = {};
  use_google_bot = [];
  use_bing_bot = [];
  use_facebook_referer = [];
  use_google_referer = [];
  use_twitter_referer = [];
  change_headers = [];
  amp_unhide = [];
  block_js_custom = [];
  block_js_custom_ext = [];
  blockedRegexes = {};
}

const userAgentDesktopG = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobileG = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

const userAgentDesktopB = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
const userAgentMobileB = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"

var enabledSites = [];
var disabledSites = [];
var optionSites = {};
var customSites = {};
var customSites_domains = [];
var excludedSites = [];

function setDefaultOptions() {
  ext_api.storage.local.set({
    sites: filterObject(defaultSites, function (val, key) {
      return !val.domain.match(/^(###$|#options_disable_)/)
    },
      function (val, key) {
      return [key, val.domain]
    })
  }, function () {
    ext_api.runtime.openOptionsPage();
  });
}

function set_rules(sites, sites_custom) {
  initSetRules();
  for (let site in sites) {
    let site_domain = sites[site].toLowerCase();
    let custom = false;
    if (!site_domain.match(/^(###$|#options_)/)) {
      let rule = {};
      if (defaultSites.hasOwnProperty(site)) {
        rule = defaultSites[site];
       } else { // custom sites
        rule = sites_custom[site];
        custom = true;
      }
      let domains = [site_domain];
      let group = false;
      if (rule.hasOwnProperty('group')) {
        domains = rule.group;
        group = true;
      }
      let rule_default = {};
      if (rule.hasOwnProperty('exception')) {
        for (let key in rule)
          rule_default[key] = rule[key];
      }
      for (let domain of domains) {
        let custom_in_group = false;
        if (rule_default.hasOwnProperty('exception')) {
          let exception_rule = rule_default.exception.filter(x => domain === x.domain);
          if (exception_rule.length > 0)
            rule = exception_rule[0];
          else
            rule = rule_default;
        }
        // custom domain for default site(group)
        if (!custom) {
          let isCustomSite = matchDomain(customSites_domains, domain);
          let customSite_title = isCustomSite ? Object.keys(customSites).find(key => customSites[key].domain === isCustomSite) : '';
          if (customSite_title) {
            // add default block_regex
            let block_regex_default = '';
            if (rule.hasOwnProperty('block_regex'))
              block_regex_default = rule.block_regex;
            
            rule = sites_custom[customSite_title];
            if (block_regex_default) {
              if (rule.hasOwnProperty('block_regex')) {
                if (block_regex_default instanceof RegExp)
                  block_regex_default = block_regex_default.source;
                rule.block_regex = '(' + block_regex_default + '|' + rule.block_regex.replace(/(^\/|\/$)/g, '') + ')';
              } else
                rule.block_regex = block_regex_default;
            }
            if (group)
              custom_in_group = true;
            else
              custom = true;
          }
        }
        addCookieRules(rule, custom || custom_in_group);
        
        if (rule.allow_cookies > 0 && !allow_cookies.includes(domain))
          allow_cookies.push(domain);
        if (rule.remove_cookies > 0 && !remove_cookies.includes(domain))
          remove_cookies.push(domain);
        if (rule.hasOwnProperty('remove_cookies_select_drop'))
          remove_cookies_select_drop[domain] = rule.remove_cookies_select_drop;
        if (rule.hasOwnProperty('remove_cookies_select_hold'))
          remove_cookies_select_hold[domain] = rule.remove_cookies_select_hold;
        if (rule.hasOwnProperty('block_regex')) {
          if (rule.block_regex instanceof RegExp)
            blockedRegexes[domain] = rule.block_regex;
          else
            blockedRegexes[domain] = new RegExp(rule.block_regex.replace('{domain}', domain.replace('.', '\\.').replace(/(^\/|\/$)/g, '')));
        }
        if (rule.useragent) {
          switch (rule.useragent) {
          case 'googlebot':
            if (!use_google_bot.includes(domain))
              use_google_bot.push(domain);
            break;
          case 'bingbot':
            if (!use_bing_bot.includes(domain))
              use_bing_bot.push(domain);
            break;
          }
        }
        if (rule.referer) {
          switch (rule.referer) {
          case 'facebook':
            if (!use_facebook_referer.includes(domain))
              use_facebook_referer.push(domain);
            break;
          case 'google':
            if (!use_google_referer.includes(domain))
              use_google_referer.push(domain);
            break;
          case 'twitter':
            if (!use_twitter_referer.includes(domain))
              use_twitter_referer.push(domain);
            break;
          }
        }
        // custom
        if (rule.googlebot > 0)
          use_google_bot.push(domain);
        if (rule.block_javascript > 0)
          block_js_custom.push(domain);
        if (rule.block_javascript_ext > 0)
          block_js_custom_ext.push(domain);
        if (rule.amp_unhide > 0)
          amp_unhide.push(domain);
      }
    }
  }
  change_headers = use_google_bot.concat(use_bing_bot, use_facebook_referer, use_google_referer, use_twitter_referer, use_random_ip);
  disableJavascriptOnListedSites();
}

function add_grouped_enabled_domains(groups) {
  for (let key in groups) {
    if (enabledSites.includes(key))
      enabledSites = enabledSites.concat(groups[key]);
    else
      disabledSites = disabledSites.concat(groups[key]);
    for (let site of excludedSites) {
      if (enabledSites.includes(site)) {
        enabledSites.splice(enabledSites.indexOf(site), 1);
        disabledSites.push(site);
      }
    }
  }
}

// add grouped sites to en/disabledSites (and exclude sites)
function add_grouped_sites(grouped_sites, sites, sites_custom) {
  add_grouped_enabled_domains(grouped_sites);
  set_rules(sites, sites_custom);
}

// Get the enabled sites (from local storage) & set_rules for sites
ext_api.storage.local.get({
  sites: {},
  sites_default: Object.keys(defaultSites).filter(x => !defaultSites[x].domain.match(/^(#options_|###$)/)),
  sites_custom: {},
  sites_excluded: [],
  ext_version_old: '2.3.9.0',
  optIn: false
}, function (items) {
  var sites = items.sites;
  var sites_default = items.sites_default;
  var sites_custom = items.sites_custom;
  var ext_version_old = items.ext_version_old;
  optin_setcookie = items.optIn;
  excludedSites = items.sites_excluded;

  enabledSites = Object.keys(sites).filter(function (key) {
      return (sites[key] !== '' && sites[key] !== '###');
    }).map(function (key) {
      return sites[key].toLowerCase();
    });

  // Enable new sites by default (opt-in)
  if (ext_version > ext_version_old) {
    if (enabledSites.includes('#options_enable_new_sites')) {
      var sites_new = Object.keys(defaultSites).filter(x => !defaultSites[x].domain.match(/^(#options_|###$)/) && !sites_default.includes(x));
      for (let site_new of sites_new) {
        sites[site_new] = defaultSites[site_new];
      }
      ext_api.storage.local.set({
        sites: sites
      });
    }
    sites_default = Object.keys(defaultSites).filter(x => !defaultSites[x].domain.match(/^(#options_|###$)/));
    ext_api.storage.local.set({
      sites_default: sites_default,
      ext_version_old: ext_version
    });
  }

  customSites = sites_custom;
  customSites_domains = Object.values(sites_custom).map(x => x.domain);
  disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
  add_grouped_enabled_domains(grouped_sites);
  set_rules(sites, customSites);
});

// Listen for changes to options
ext_api.storage.onChanged.addListener(function (changes, namespace) {
  if (namespace === 'sync')
    return;
  for (let key in changes) {
    var storageChange = changes[key];
    if (key === 'sites') {
      var sites = storageChange.newValue;
      optionSites = sites;
      enabledSites = Object.keys(sites).filter(function (key) {
          return (sites[key] !== '' && sites[key] !== '###');
        }).map(function (key) {
          return sites[key];
        });
      disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
      add_grouped_enabled_domains(grouped_sites);
      set_rules(sites, customSites);
    }
    if (key === 'sites_custom') {
      var sites_custom = storageChange.newValue ? storageChange.newValue : {};
      var sites_custom_old = storageChange.oldValue ? storageChange.oldValue : {};
      customSites = sites_custom;
      customSites_domains = Object.values(sites_custom).map(x => x.domain);
      
      // add/remove custom sites in options (not for default site(group))
      var sites_custom_added = Object.keys(sites_custom).filter(x => !Object.keys(sites_custom_old).includes(x) && !defaultSites.hasOwnProperty(x) && !defaultSites_domains.includes(sites_custom[x].domain));
      var sites_custom_removed = Object.keys(sites_custom_old).filter(x => !Object.keys(sites_custom).includes(x) && !defaultSites.hasOwnProperty(x) && !defaultSites_domains.includes(sites_custom_old[x].domain));
      
      ext_api.storage.local.get({
        sites: {}
      }, function (items) {
        var sites = items.sites;
        if (sites_custom_added.concat(sites_custom_removed).length > 0) {
          for (let key of sites_custom_added)
            sites[key] = sites_custom[key].domain;
          for (let key of sites_custom_removed)
            delete sites[key];
          
          ext_api.storage.local.set({
            sites: sites
          }, function () {
            true;
          });
        } else
          set_rules(sites, customSites);
      });
      
    }
    if (key === 'sites_excluded') {
      var sites_excluded = storageChange.newValue ? storageChange.newValue : [];
      var sites_excluded_old = storageChange.oldValue ? storageChange.oldValue : [];
      excludedSites = sites_excluded;

      // add/remove excluded sites in en/disabledSites
      var sites_excluded_added = sites_excluded.filter(x => !sites_excluded_old.includes(x));
      var sites_excluded_removed = sites_excluded_old.filter(x => !sites_excluded.includes(x));

      for (let site of sites_excluded_added) {
        if (enabledSites.includes(site)) {
          enabledSites.splice(enabledSites.indexOf(site), 1);
          disabledSites.push(site);
        }
      }
      for (let site of sites_excluded_removed) {
        if (disabledSites.includes(site)) {
          disabledSites.splice(disabledSites.indexOf(site), 1);
          enabledSites.push(site);
        }
      }
    }
    if (key === 'ext_version_new') {
      ext_version_new = storageChange.newValue;
    }
    if (key === 'optIn') {
      optin_setcookie = storageChange.newValue;
    }
    // reset disableJavascriptOnListedSites eventListener
    ext_api.webRequest.onBeforeRequest.removeListener(disableJavascriptOnListedSites);
    ext_api.webRequest.handlerBehaviorChanged();

    // Refresh the current tab
    refreshCurrentTab();
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

// inkl disable newsletter login
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace(/etok=[\w]*&/, '');
  return { redirectUrl: updatedUrl };
},
{urls:["*://*.inkl.com/*"], types:["main_frame"]},
["blocking"]
);

// m.faz.net set user-agent to mobile
const faz_uaMobile = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Mobile Safari/537.36";
ext_api.webRequest.onBeforeSendHeaders.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  let headers = details.requestHeaders;
  headers = headers.map(function (header) {
      if (header.name.toLowerCase() === 'user-agent')
        header.value = faz_uaMobile;
      return header;
    });
  return {
    requestHeaders: headers
  };
}, {
  urls: ["*://m.faz.net/*"],
  types: ["xmlhttprequest"]
},
  ["blocking", "requestHeaders"]);

// wap.business-standard.com (mobile) redirect to www (desktop)
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace('/wap.', '/www.');
  return { redirectUrl: updatedUrl };
},
{urls:["*://wap.business-standard.com/*"], types:["main_frame"]},
["blocking"]
);

// www.business-standard.com set user-agent to desktop
const business_standard_uaDesktop = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.122 Safari/537.36";
ext_api.webRequest.onBeforeSendHeaders.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  let headers = details.requestHeaders;
  headers = headers.map(function (header) {
      if (header.name.toLowerCase() === 'user-agent')
        header.value = business_standard_uaDesktop;
      return header;
    });
  return {
    requestHeaders: headers
  };
}, {
  urls: ["*://www.business-standard.com/*"],
  types: ["main_frame"]
},
  ["blocking", "requestHeaders"]);

// economictimes redirect
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.split('?')[0].replace('economictimes.indiatimes.com', 'm.economictimes.com');
  return { redirectUrl: updatedUrl };
},
{urls:["*://economictimes.indiatimes.com/*?from=mdr"], types:["main_frame"]},
["blocking"]
);

// saechsische.de amp-redirect
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace('-plus-amp.html', '-plus.html');
  return { redirectUrl: updatedUrl };
},
{urls:["*://*.saechsische.de/*-plus-amp.html*"], types:["main_frame"]},
["blocking"]
);

// infzm.com redirect to wap (mobile)
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = details.url.replace('.com/contents/', '.com/wap/#/content/');
  return { redirectUrl: updatedUrl };
},
{urls:["*://www.infzm.com/contents/*"], types:["main_frame"]},
["blocking"]
);

// theaustralian.com redirect subscribe to amp
ext_api.webRequest.onBeforeRequest.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var updatedUrl = decodeURIComponent(details.url.split('dest=')[1].split('&')[0]).replace('www.', 'amp.');
  return { redirectUrl: updatedUrl };
},
{urls:["*://www.theaustralian.com.au/subscribe/*"], types:["main_frame"]},
["blocking"]
);

// fix nytimes x-frame-options (hidden iframe content)
ext_api.webRequest.onHeadersReceived.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var headers = details.responseHeaders;
  headers = headers.map(function (header) {
      if (header.name === 'x-frame-options')
        header.value = 'SAMEORIGIN';
      return header;
    });
  return {
    responseHeaders: headers
  };
}, {
  urls: ["*://*.nytimes.com/*"]
},
  ['blocking', 'responseHeaders']);

// block inline script
var block_js_inline = ["*://elviajero.elpais.com/*", "*://retina.elpais.com/*", "*://verne.elpais.com/*", "*://*.medianama.com/*"];
ext_api.webRequest.onHeadersReceived.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var headers = details.responseHeaders;
  headers.push({
    'name': 'Content-Security-Policy',
    'value': "script-src *;"
  });
  return {
    responseHeaders: headers
  };
}, {
  'types': ['main_frame', 'sub_frame'],
  'urls': block_js_inline
},
  ['blocking', 'responseHeaders']);

var block_js = ["*://cdn.tinypass.com/*", "*://*.piano.io/*", "*://*.poool.fr/*",  "*://cdn.ampproject.org/v*/amp-access-*.js", "*://cdn.ampproject.org/v*/amp-subscriptions-*.js", "*://loader-cdn.azureedge.net/prod/*/loader.min.js*", "*://*.blueconic.net/*", "*://*.cxense.com/*", "*://*.evolok.net/*", "*://js.matheranalytics.com/*", "*://*.newsmemory.com/*", "*://*.onecount.net/*", "*://js.pelcro.com/*", "*://*.qiota.com/*", "*://*.tribdss.com/*"];

// Disable javascript for these sites/general paywall-scripts
function disableJavascriptOnListedSites() {
  ext_api.webRequest.onBeforeRequest.addListener(function (details) {
    let header_referer = details.originUrl ? details.originUrl : details.initiator;
    if (!isSiteEnabled(details) || matchUrlDomain(excludedSites, header_referer)) {
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

if (typeof browser !== 'object') {
var focus_changed = false;
ext_api.windows.onFocusChanged.addListener((windowId) => {
  if (windowId > 0)
    focus_changed = true;
});
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
  for (let n in requestHeaders) {
    if (requestHeaders[n].name.toLowerCase() == 'referer') {
      header_referer = requestHeaders[n].value;
      continue;
    }
  }

  // fix blocked referer
  if (!header_referer) {
    if (typeof browser !== 'object')
      header_referer = details.initiator ? details.initiator : '';
    else
      header_referer = details.originUrl ? details.originUrl : '';
  }

  // remove cookies for sites medium platform (custom domains)
  var medium_custom_domains = [];
  var medium_custom_domain = (matchUrlDomain('cdn-client.medium.com', details.url) && ['script'].includes(details.type) && !matchUrlDomain(medium_custom_domains.concat(['medium.com', 'towardsdatascience.com']), header_referer) && enabledSites.includes('###_medium_custom'));
  if (medium_custom_domain) {
    let mc_domain = urlHost(header_referer).replace(/^(www|m)\./, '');;
    if (!use_twitter_referer.includes(mc_domain)) {
      use_twitter_referer.push(mc_domain);
      change_headers.push(mc_domain);
    }
    medium_custom_domains.push(mc_domain);
    if (!enabledSites.includes(mc_domain))
      enabledSites.push(mc_domain);
  }

  // set googlebot-useragent for Gannett sites
  var usa_gannett_domains = [];
  var usa_gannett_domain = (matchUrlDomain('gannett-cdn.com', details.url) && ['xmlhttprequest'].includes(details.type) && !matchUrlDomain(usa_gannett_domains.concat(['usatoday.com']), header_referer) && enabledSites.includes('###_usa_gannett'));
  if (usa_gannett_domain) {
    let gn_domain = urlHost(header_referer).replace(/^(www|eu)\./, '');;
    if (!use_google_bot.includes(gn_domain)) {
      use_google_bot.push(gn_domain);
      change_headers.push(gn_domain);
    }
    usa_gannett_domains.push(gn_domain);
    if (!enabledSites.includes(gn_domain))
      enabledSites.push(gn_domain);
  }

  // block script for additional Lee Enterprises sites (opt-in to custom sites)
  var usa_lee_ent_domains = grouped_sites['###_usa_lee_ent'];
  var usa_lee_ent_domain = (details.url.match(/\.com\/shared-content\/art\/tncms\/.+\.js/) && ['script'].includes(details.type) &&
  !matchUrlDomain(usa_lee_ent_domains, header_referer) && enabledSites.includes('###_usa_lee_ent'));
  if (usa_lee_ent_domain) {
    let lee_ent_domain = urlHost(header_referer).replace(/^(www|m)\./, '');
    blockedRegexes[lee_ent_domain] = blockedRegexes['buffalonews.com'];
    usa_lee_ent_domains.push(lee_ent_domain);
    if (!enabledSites.includes(lee_ent_domain))
      enabledSites.push(lee_ent_domain);
  }

  // block script for additional McClatchy sites (opt-in to custom sites)
  var usa_mcc_domains = grouped_sites['###_usa_mcc'];
  var usa_mcc_domain = ((matchUrlDomain('mcclatchyinteractive.com', details.url) && ['script'].includes(details.type)) ||
  (matchUrlDomain('mcclatchy-wires.com', details.url) && ['image'].includes(details.type)) &&
  !matchUrlDomain(usa_mcc_domains, header_referer) && enabledSites.includes('###_usa_mcc'));
  if (usa_mcc_domain) {
    let mcc_domain = urlHost(header_referer).replace(/^(account|amp)\./, '');
    blockedRegexes[mcc_domain] = blockedRegexes['bnd.com'];
    usa_mcc_domains.push(mcc_domain);
    if (!enabledSites.includes(mcc_domain))
      enabledSites.push(mcc_domain);
  }

  // block script for additional MediaNews Group sites (opt-in to custom sites)
  var usa_mng_domains = grouped_sites['###_usa_mng'];
  var usa_mng_domain = (details.url.match(/\.com\/wp-content\/plugins\/dfm(-pushly|_zeus)\/.+\.js/) && ['script'].includes(details.type) &&
  !matchUrlDomain(usa_mng_domains, header_referer) && enabledSites.includes('###_usa_mng'));
  if (usa_mng_domain) {
    let mng_domain = urlHost(header_referer).replace(/^www\./, '');
    blockedRegexes[mng_domain] = blockedRegexes['denverpost.com'];
    usa_mng_domains.push(mng_domain);
    if (!enabledSites.includes(mng_domain))
      enabledSites.push(mng_domain);
  }

  // block script for additional Madsack/RND sites (opt-in to custom sites)
  var de_madsack_domains = grouped_sites['###_de_madsack'];
  var de_rnd_domain = (matchUrlDomain('rndtech.de', details.url) && ['script'].includes(details.type) && !matchUrlDomain(de_madsack_domains.concat(['madsack.de', 'madsack-medien-campus.de', 'rnd.de']), header_referer) && enabledSites.includes('###_de_madsack'));
  if (de_rnd_domain) {
    let rnd_domain = urlHost(header_referer).replace(/^(www|m)\./, '');
    if (!de_madsack_domains.includes(rnd_domain)) {
      allow_cookies.push(rnd_domain);
      blockedRegexes[rnd_domain] = blockedRegexes['haz.de'];
      de_madsack_domains.push(rnd_domain);
      if (!enabledSites.includes(rnd_domain))
        enabledSites.push(rnd_domain);
    }
  }

  // set user-agent to GoogleBot for additional Snamoma Media Finland (opt-in to custom sites)
  var fi_sanoma_domains = grouped_sites['###_fi_sanoma'];
  var fi_sanoma_sndp_domain = (matchUrlDomain('sanoma-sndp.fi', details.url) && ['xmlhttprequest'].includes(details.type) && !matchUrlDomain(fi_sanoma_domains, header_referer) && enabledSites.includes('###_fi_sanoma'));
  if (fi_sanoma_sndp_domain) {
    let sanoma_domain = urlHost(header_referer).replace(/^www\./, '');
    if (!fi_sanoma_domains.includes(sanoma_domain)) {
      allow_cookies.push(sanoma_domain);
      if (!use_google_bot.includes(sanoma_domain)) {
        use_google_bot.push(sanoma_domain);
        change_headers.push(sanoma_domain);
      }
      fi_sanoma_domains.push(sanoma_domain);
      if (!enabledSites.includes(sanoma_domain))
        enabledSites.push(sanoma_domain);
    }
  }

  // block external javascript for custom sites (optional)
  var domain_blockjs_ext = matchUrlDomain(block_js_custom_ext, header_referer);
  if (domain_blockjs_ext && !matchUrlDomain(domain_blockjs_ext, details.url) && details.type === 'script' && isSiteEnabled({url: header_referer})) {
    return { cancel: true };
  }

  // check for blocked regular expression: domain enabled, match regex, block on an internal or external regex
  var blockedDomains = Object.keys(blockedRegexes);
  var domain = matchUrlDomain(blockedDomains, header_referer);
  if (domain && details.url.match(blockedRegexes[domain]) && isSiteEnabled({url: header_referer}))
    return { cancel: true };

  // load toggleIcon.js (icon for dark or incognito mode in Chrome))
  if (typeof browser !== 'object' && ['main_frame', 'xmlhttprequest'].includes(details.type)) {
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url.startsWith('http')) {
        ext_api.tabs.executeScript({
          file: 'options/toggleIcon.js',
          runAt: 'document_start'
        }, function (res) {
          if (ext_api.runtime.lastError || res[0]) {
            return;
          }
        });
      }
    });
  }

  let allow_ext_source = medium_custom_domain;
  let bpc_amp_site = false;
  let au_swm_site = (header_referer && urlHost(header_referer).endsWith('com.au') && details.url.includes('https://s.thewest.com.au/'));

  if (isSiteEnabled({url: header_referer})) {
    let inkl_site = (matchUrlDomain('cdn.jsdelivr.net', details.url) && matchUrlDomain('inkl.com', header_referer));
    let cl_elmerc_site = (matchUrlDomain('emol.cl', details.url) && matchUrlDomain('elmercurio.com', header_referer));
    let es_elesp_site = (matchUrlDomain('eestatic.com', details.url) && matchUrlDomain('elespanol.com', header_referer));
    let it_repubblica_site = (matchUrlDomain(['repstatic.it'], details.url) && matchUrlDomain(it_repubblica_domains, header_referer));
    let usa_law360_site = (matchUrlDomain('law360news.com', details.url) && matchUrlDomain('law360.com', header_referer));
    let usa_mw_site = (matchUrlDomain('wsj.net', details.url) && matchUrlDomain('marketwatch.com', header_referer));
    let usa_natgeo_site = (matchUrlDomain('natgeofe.com', details.url) && matchUrlDomain('nationalgeographic.com', header_referer));
    let usa_today_site = (matchUrlDomain('gannett-cdn.com', details.url) && matchUrlDomain(['usatoday.com'], header_referer));
    allow_ext_source = allow_ext_source || inkl_site || cl_elmerc_site || es_elesp_site || it_repubblica_site || usa_law360_site || usa_mw_site || usa_natgeo_site || usa_today_site;

    bpc_amp_site = matchUrlDomain('cdn.ampproject.org', details.url) && (enabledSites.includes('cdn.ampproject.org') || matchUrlDomain(defaultSites_domains.concat(amp_unhide), header_referer));
  }

  if (!isSiteEnabled(details) && !allow_ext_source && !bpc_amp_site && !au_swm_site) {
    return;
  }

  // block javascript of (sub)domain for custom sites (optional)
  var domain_blockjs = matchUrlDomain(block_js_custom, details.url);
  if (domain_blockjs && matchUrlDomain(domain_blockjs, details.url) && details.type === 'script') {
    return { cancel: true };
  }

  var tabId = details.tabId;

  var useUserAgentMobile = false;
  var setReferer = false;
  var googlebotEnabled = matchUrlDomain(use_google_bot, details.url) && 
    !(matchUrlDomain('barrons.com', details.url) && enabledSites.includes('#options_disable_gb_barrons')) &&
    !(matchUrlDomain('theaustralian.com.au', details.url) && enabledSites.includes('#options_disable_gb_theaustralian')) &&
    !(matchUrlDomain('wsj.com', details.url) && enabledSites.includes('#options_disable_gb_wsj'));
  var bingbotEnabled = matchUrlDomain(use_bing_bot, details.url) && 
    !(matchUrlDomain('stratfor.com', details.url) && details.url.match(/(\/(\d){4}-([a-z]||-)+-forecast(-([a-z]|-)+)?|-forecast-(\d){4}-([a-z]|[0-9]||-)+)$/));

if (matchUrlDomain(change_headers, details.url) && (!['font', 'image', 'stylesheet'].includes(details.type) || matchUrlDomain(['thetimes.co.uk'], details.url))) {
  // if referer exists, set it
  requestHeaders = requestHeaders.map(function (requestHeader) {
    if (requestHeader.name === 'Referer') {
      if (googlebotEnabled || matchUrlDomain(use_google_referer, details.url)) {
        requestHeader.value = 'https://www.google.com/';
      } else if (matchUrlDomain(use_facebook_referer, details.url)) {
        requestHeader.value = 'https://www.facebook.com/';
      } else if (matchUrlDomain(use_twitter_referer, details.url)) {
        requestHeader.value = 'https://t.co/';
      }
      setReferer = true;
    }
    if (requestHeader.name === 'User-Agent') {
      useUserAgentMobile = requestHeader.value.toLowerCase().includes("mobile") && !matchUrlDomain(['telerama.fr'], details.url);
    }
    return requestHeader;
  });

  // otherwise add it
  if (!setReferer) {
    if (googlebotEnabled || matchUrlDomain(use_google_referer, details.url)) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.google.com/'
      });
    } else if (matchUrlDomain(use_facebook_referer, details.url)) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://www.facebook.com/'
      });
    } else if (matchUrlDomain(use_twitter_referer, details.url)) {
      requestHeaders.push({
        name: 'Referer',
        value: 'https://t.co/'
      });
    }
  }

  // override User-Agent to use Googlebot
  if (googlebotEnabled) {
    requestHeaders.push({
      "name": "User-Agent",
      "value": useUserAgentMobile ? userAgentMobileG : userAgentDesktopG
    })
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": "66.249.66.1"
    })
  }

  // override User-Agent to use Bingbot
  if (bingbotEnabled) {
    requestHeaders.push({
      "name": "User-Agent",
      "value": useUserAgentMobile ? userAgentMobileB : userAgentDesktopB
    })
  }

  // random IP for sites in use_random_ip
  if (matchUrlDomain(use_random_ip, details.url)) {
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": randomIP()
    })
  }
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
      if ((currentTab && isSiteEnabled(currentTab)) || medium_custom_domain || au_swm_site) {
        if (currentTab.url !== currentTabUrl) {
          csDone = false;
          currentTabUrl = currentTab.url;
        }
        if ((!['font', 'stylesheet'].includes(details.type) || matchUrlDomain(cs_limit_except, currentTabUrl)) && !csDone) {
          let lib_file = 'lib/empty.js';
          if (matchUrlDomain(['bloomberg.com', 'cicero.de', 'economictimes.com', 'lesechos.fr', 'marianne.net', 'newleftreview.org', 'newyorker.com', 'nzherald.co.nz', 'prospectmagazine.co.uk', 'stratfor.com', 'sudouest.fr', 'techinasia.com', 'valor.globo.com'].concat(nl_mediahuis_region_domains, no_nhst_media_domains, usa_theathletic_domains), currentTabUrl))
            lib_file = 'lib/purify.min.js';
          var bg2csData = {
            optin_setcookie: optin_setcookie,
            amp_unhide: matchUrlDomain(amp_unhide, currentTabUrl)
          };
          ext_api.tabs.executeScript(tabId, {
            code: 'var bg2csData = ' + JSON.stringify(bg2csData) + ';'
          }, function () {
            ext_api.tabs.executeScript(tabId, {
              file: lib_file,
              runAt: 'document_start'
            }, function () {
              ext_api.tabs.executeScript(tabId, {
                file: 'contentScript.js',
                runAt: 'document_start'
              }, function (res) {
                if (ext_api.runtime.lastError || res[0]) {
                  return;
                }
              })
            });
          });
        }
      }
    });
  } else {//mercuriovalpo.cl
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url.startsWith('http')) {
        if (isSiteEnabled({url: tabs[0].url})) {
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

  return { requestHeaders: requestHeaders };
}, {
  urls: ['<all_urls>']
}, extraInfoSpec);
// extraInfoSpec is ['blocking', 'requestHeaders'] + possible 'extraHeaders'

ext_api.tabs.onUpdated.addListener(function (tabId, info, tab) { updateBadge(tab); });
ext_api.tabs.onActivated.addListener(function (activeInfo) { ext_api.tabs.get(activeInfo.tabId, updateBadge); });

function updateBadge(activeTab) {
  if (ext_api.runtime.lastError || !activeTab)
    return;
  let badgeText = '';
  let color = 'red';
  let currentUrl = activeTab.url;
  if (currentUrl) {
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
    if (ext_version_new)
      badgeText = '^' + badgeText;
    let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
    let isCustomSite = matchUrlDomain(customSites_domains, currentUrl);
    if (!isDefaultSite && isCustomSite) {
      ext_api.permissions.contains({
        origins: ['*://*.' + isCustomSite + '/*']
      }, function (result) {
        if (!result)
          badgeText = enabledSites.includes(isCustomSite) ? 'C' : '';
        if (color && badgeText)
          ext_api.browserAction.setBadgeBackgroundColor({color: color});
        ext_api.browserAction.setBadgeText({text: badgeText});
      });
    } else {
      if (color && badgeText)
        ext_api.browserAction.setBadgeBackgroundColor({color: color});
      ext_api.browserAction.setBadgeText({text: badgeText});
    }
  }
}

var ext_version_new;
check_update();
function check_update() {
  var manifest_new = 'https://bitbucket.org/magnolia1234/bypass-paywalls-firefox-clean/raw/master/manifest.json';
  fetch(manifest_new)
  .then(response => {
    if (response.ok) {
      response.json().then(json => {
        ext_api.management.getSelf(function (result) {
          var installType = result.installType;
          var ext_version_len = (installType === 'development') ? 7 : 5;
          ext_version_new = json['version'];
          if (ext_version_new.substring(0, ext_version_len) <= ext_version.substring(0, ext_version_len))
            ext_version_new = '';
          ext_api.storage.local.set({
            ext_version_new: ext_version_new
          });
        });
      })
    }
  });
}

function site_switch() {
    ext_api.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        if (tabs && tabs[0] && tabs[0].url.startsWith('http')) {
            let currentUrl = tabs[0].url;
            let isDefaultSite = matchUrlDomain(defaultSites_grouped_domains, currentUrl);
            if (!isDefaultSite) {
                let isDefaultSiteGroup = matchUrlDomain(defaultSites_domains, currentUrl);
                if (isDefaultSiteGroup)
                    isDefaultSite = Object.keys(grouped_sites).find(key => grouped_sites[key].includes(isDefaultSiteGroup));
            }
            let defaultSite_title = isDefaultSite ? Object.keys(defaultSites).find(key => defaultSites[key].domain === isDefaultSite) : '';
            let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
            let customSite_title = isCustomSite ? Object.keys(customSites).find(key => customSites[key].domain === isCustomSite) : '';
            let site_title = defaultSite_title || customSite_title;
            let domain = isDefaultSite || isCustomSite;
            if (domain && site_title) {
                let added_site = [];
                let removed_site = [];
                if (enabledSites.includes(domain))
                    removed_site.push(site_title);
                else
                    added_site.push(site_title);
                ext_api.storage.local.get({
                    sites: {}
                }, function (items) {
                    var sites = items.sites;
                    for (let key of added_site)
                        sites[key] = domain;
                    for (let key of removed_site)
                        delete sites[key];

                    ext_api.storage.local.set({
                        sites: sites
                    }, function () {
                        true;
                    });
                });
            }
        }
    });
}

function remove_cookies_fn(domainVar, exclusions = false) {
  ext_api.cookies.getAllCookieStores(function (cookieStores) {
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url.startsWith('http')) {
        if (ext_api.runtime.lastError)
          return;
        let tabId = tabs[0].id;
        let storeId = '0';
        for (let store of cookieStores) {
          if (store.tabIds.includes(tabId))
            storeId = store.id;
        }
        storeId = storeId.toString();
        var cookie_get_options = {
          domain: domainVar
        };
        if (storeId !== 'null')
          cookie_get_options.storeId = storeId;
        var cookie_remove_options = {};
        ext_api.cookies.getAll(cookie_get_options, function (cookies) {
          for (let cookie of cookies) {
            if (exclusions) {
              var rc_domain = cookie.domain.replace(/^(\.?www\.|\.)/, '');
              // hold specific cookie(s) from remove_cookies domains
              if ((rc_domain in remove_cookies_select_hold) && remove_cookies_select_hold[rc_domain].includes(cookie.name)) {
                continue; // don't remove specific cookie
              }
              // drop only specific cookie(s) from remove_cookies domains
              if ((rc_domain in remove_cookies_select_drop) && !(remove_cookies_select_drop[rc_domain].includes(cookie.name))) {
                continue; // only remove specific cookie
              }
              // hold on to consent-cookie
              if (cookie.name.match(/(consent|^optanon)/i)) {
                continue;
              }
            }
            cookie.domain = cookie.domain.replace(/^\./, '');
            cookie_remove_options = {
              url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path,
              name: cookie.name
            };
            if (storeId !== 'null')
              cookie_remove_options.storeId = storeId;
            ext_api.cookies.remove(cookie_remove_options);
          }
        });
      }
    });
  })
}

// remove cookies after page load
ext_api.webRequest.onCompleted.addListener(function (details) {
  let domainVar = matchUrlDomain(remove_cookies, details.url);
  if (domainVar && ['main_frame', 'sub_frame', 'xmlhttprequest', 'other'].includes(details.type) && enabledSites.includes(domainVar)) {
    remove_cookies_fn(domainVar, true);
  }
}, {
  urls: ["<all_urls>"]
});

function clear_cookies() {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs && tabs[0] && tabs[0].url.startsWith('http')) {
      ext_api.tabs.executeScript({
        file: 'options/clearCookies.js',
        runAt: 'document_start'
      }, function (res) {
        if (ext_api.runtime.lastError || res[0]) {
          return;
        }
      });
      ext_api.tabs.update(tabs[0].id, {
        url: tabs[0].url
      });
    }
  });
}

var chrome_scheme = 'light';
ext_api.runtime.onMessage.addListener(function (message, sender) {
  if (message.request === 'clear_cookies') {
    clear_cookies();
  }
  // clear cookies for domain
  if (message.domain) {
    remove_cookies_fn(message.domain);
  }
  if (message.request === 'site_switch') {
    site_switch();
  }
  if (message.request === 'popup_show_toggle') {
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs && tabs[0] && tabs[0].url.startsWith('http')) {
        let currentUrl = tabs[0].url;
        let domain;
        let isExcludedSite = matchUrlDomain(excludedSites, currentUrl);
        if (!isExcludedSite) {
          let isDefaultSiteGrouped = matchUrlDomain(defaultSites_domains, currentUrl);
          let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
          let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
          domain = isDefaultSiteGrouped || (!isDefaultSite && isCustomSite);
        }
        ext_api.runtime.sendMessage({
          msg: "popup_show_toggle",
          data: {
            domain: domain,
            enabled: enabledSites.includes(domain)
          }
        });
      }
    });
  }
  if (message.request === 'refreshCurrentTab') {
    refreshCurrentTab();
  }
  if (message.scheme && (![chrome_scheme, 'undefined'].includes(message.scheme) || focus_changed)) {
      let icon_path = {path: {'128': 'bypass.png'}};
      if (message.scheme === 'dark')
          icon_path = {path: {'128': 'bypass-dark.png'}};
      ext_api.browserAction.setIcon(icon_path);
      chrome_scheme = message.scheme;
      focus_changed = false;
  }
  if (message.csDone) {
    csDone = true;
    //console.log('msg.csDone: ' + csDone);
  }
});

// show the opt-in tab on installation
ext_api.storage.local.get(["optInShown", "customShown"], function (result) {
  if (!result.optInShown || !result.customShown) {
    ext_api.tabs.create({
      url: "options/optin/opt-in.html"
    });
    ext_api.storage.local.set({
      "optInShown": true,
      "customShown": true
    });
  }
});

// restore custom sites opt-in on reload (chrome-only, load upacked)
if (typeof browser !== 'object') {
  ext_api.storage.local.get({
    sites: {},
    customOptIn: false
  }, function (result) {
    let options_restore_custom = Object.values(result.sites).includes('#options_restore_custom');
    if (result.customOptIn && options_restore_custom) {
      ext_api.permissions.contains({
        origins: ["<all_urls>"]
      }, function (result_perm) {
        if (!result_perm) {
          ext_api.tabs.create({
            url: "options/optin/opt-in.html"
          });
        }
      });
    }
  });
}

function filterObject(obj, filterFn, mapFn = function (val, key) {
  return [key, val];
}) {
  return Object.fromEntries(Object.entries(obj).
    filter(([key, val]) => filterFn(val, key)).map(([key, val]) => mapFn(val, key)));
}

function isSiteEnabled(details) {
  var enabledSite = matchUrlDomain(enabledSites, details.url);
  if (!ext_name.startsWith('Bypass Paywalls Clean'))
    enabledSite = '';
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

function randomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIP() {
  let rndmIP = [];
  for (let n = 0; n < 4; n++)
    rndmIP.push(randomInt(254) + 1);
  return rndmIP.join('.');
}

// Refresh the current tab
function refreshCurrentTab() {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs && tabs[0] && tabs[0].url.startsWith('http')) {
      if (ext_api.runtime.lastError)
        return;
      ext_api.tabs.update(tabs[0].id, {
        url: tabs[0].url
      });
    }
  });
}
