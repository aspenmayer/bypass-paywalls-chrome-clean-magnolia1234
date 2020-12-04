/* Please respect alphabetical order when adding a site in any list */

'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;
var ext_name = ext_api.runtime.getManifest().name;

const cs_limit_except = ['harpers.org', 'la-croix.com', 'lescienze.it'];
var currentTabUrl = '';
var csDone = false;

// Cookies from this list are blocked by default (obsolete)
// defaultSites are loaded from sites.js at installation extension
// var defaultSites = {};

const restrictions = {
  'barrons.com': /.+barrons\.com\/(amp\/)?article(s)?\/.+/,
  'bloombergquint.com': /^((?!\.bloombergquint\.com\/bq-blue-exclusive\/).)*$/,
  'elcomercio.pe': /.+\/elcomercio\.pe\/.+((\w)+(\-)+){3,}.+/,
  'faz.net': /^((?!\/zeitung\.faz\.net\/).)*$/,
  'ft.com': /.+\.ft.com\/content\//,
  'gestion.pe': /.+\/gestion\.pe\/.+((\w)+(\-)+){3,}.+/,
  'hs.fi': /^((?!\/.+\.hs\.fi\/paivanlehti\/).)*$/,
  'nknews.org': /^((?!\.nknews\.org\/pro\/).)*$/,
  'globo.com': /^((?!\/valor\.globo\.com\/).)*$/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'seekingalpha.com': /.+seekingalpha\.com\/article\/.+/,
  'wsj.com': /^((?!\/cn\.wsj\.com\/).)*$/
}

// Don't remove cookies before page load
// allow_cookies are completed with domains in sites.js (default allow/remove_cookies)
var allow_cookies_default = [
  'abc.es',
  'belfasttelegraph.co.uk',
  'bostonglobe.com',
  'business-standard.com',
  'charliehebdo.fr',
  'clarin.com',
  'chronicle.com',
  'df.cl',
  'dn.se',
  'dvhn.nl',
  'editorialedomani.it',
  'elmercurio.com',
  'elmundo.es',
  'elpais.com',
  'elperiodico.com',
  'esprit.presse.fr',
  'eurekareport.com.au',
  'faz.net',
  'financialpost.com',
  'folha.uol.com.br',
  'ftm.nl',
  'fortune.com',
  'gelocal.it',
  'gestion.pe',
  'gva.be',
  'haaretz.co.il',
  'haaretz.com',
  'handelsblatt.com',
  'hs.fi',
  'ilfattoquotidiano.it',
  'ilrestodelcarlino.it',
  'independent.ie',
  'intelligentinvestor.com.au',
  'knack.be',
  'kurier.at',
  'la-croix.com',
  'lc.nl',
  'lejdd.fr',
  'lesechos.fr',
  'lesoir.be',
  'limesonline.com',
  'lrb.co.uk',
  'modernhealthcare.com',
  'nationalgeographic.com',
  'nationalpost.com',
  'nationalreview.com',
  'newrepublic.com',
  'nknews.org',
  'noordhollandsdagblad.nl',
  'nrz.de',
  'nybooks.com',
  'nytimes.com',
  'nzz.ch',
  'quotidiano.net',
  'quora.com',
  'repubblica.it',
  'rollingstone.com',
  'saechsische.de',
  'scribd.com',
  'seekingalpha.com',
  'slader.com',
  'startribune.com',
  'stocknews.com',
  'sueddeutsche.de',
  'techinasia.com',
  'the-american-interest.com',
  'thehindu.com',
  'thehindubusinessline.com',
  'themarker.com',
  'thewest.com.au',
  'timeshighereducation.com',
  'variety.com',
  'washingtonpost.com',
  'waz.de',
  'wiwo.de',
  'worldpoliticsreview.com',
  'wp.de',
  'wr.de',
  'zeit.de',
];
var allow_cookies = allow_cookies_default.slice();

// Removes cookies after page load
// remove_cookies are completed with domains of sites.js (default allow/remove_cookies)
var remove_cookies = [
]

// select specific cookie(s) to hold from remove_cookies domains
const remove_cookies_select_hold = {
  'barrons.com': ['wsjregion'],
  'groene.nl': ['accept-cookies', 'popunder-hidden'],
  'newstatesman.com': ['STYXKEY_nsversion'],
  'seattletimes.com': ['st_newsletter_splash_seen'],
  'telegraph.co.uk': ['consentUUID'],
  'qz.com': ['gdpr'],
  'wsj.com': ['wsjregion', 'ResponsiveConditional_initialBreakpoint']
}

// select only specific cookie(s) to drop from remove_cookies domains
var remove_cookies_select_drop = {
  'ad.nl': ['temptationTrackingId'],
  'caixinglobal.com': ['CAIXINGLB_LOGIN_UUID'],
  'dn.se': ['randomSplusId'],
  'fd.nl': ['socialread'],
  'nrc.nl': ['counter'],
  'theatlantic.com': ['articleViews']
}

// Override User-Agent with Googlebot
var use_google_bot_default = [
  'abc.es',
  'barrons.com',
  'deutsche-wirtschafts-nachrichten.de',
  'df.cl',
  'dn.se',
  'editorialedomani.it',
  'eurekareport.com.au',
  'ft.com',
  'handelsblatt.com',
  'hs.fi',
  'intelligentinvestor.com.au',
  'lesoir.be',
  'mexiconewsdaily.com',
  'miamiherald.com',
  'nzz.ch',
  'quora.com',
  'republic.ru',
  'seekingalpha.com',
  'thetimes.co.uk',
  'washingtonpost.com',
  'wiwo.de',
  'worldpoliticsreview.com',
  'wsj.com',
  'zeit.de',
];
var use_google_bot = use_google_bot_default.slice();

// Override User-Agent with Bingbot
var use_bing_bot = [
  'haaretz.co.il',
  'haaretz.com',
  'themarker.com',
];

// block paywall-scripts individually
var blockedRegexes = {
  'adweek.com': /.+\.lightboxcdn\.com\/.+/,
  'afr.com': /afr\.com\/assets\/vendorsReactRedux_client.+\.js/,
  'alternatives-economiques.fr': /.+\.poool\.fr\/.+/,
  'americanbanker.com': /cdn\.tinypass\.com\/.+/,
  'barrons.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
  'belfasttelegraph.co.uk': /cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js/,
  'bizjournals.com': /(assets\.bizjournals\.com\/static\/js\/app\/cxense\.js|cdn\.cxense\.com\/.+)/,
  'bloomberg.com': /cdn\.tinypass\.com\/.+/,
  'bostonglobe.com': /meter\.bostonglobe\.com\/js\/.+/,
  'brisbanetimes.com.au': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
  'businessinsider.com': /cdn\.tinypass\.com\/.+/,
  'challenges.fr': /.+\.poool\.fr\/.+/,
  'charliehebdo.fr': /.+\.poool\.fr\/.+/,
  'chicagobusiness.com': /cdn\.tinypass\.com\/.+/,
  'chicagotribune.com': /.+:\/\/.+\.tribdss\.com\/.+/,
  'chronicle.com': /(.+\.blueconic\.net\/.+|assets\.login\.chronicle\.com\/common\/che-auth0-user\.js)/,
  'clarin.com': /js\.matheranalytics\.com\/.+/,
  'corriere.it': /(cdn\.tinypass\.com\/|\.rcsobjects\.it\/rcs_(cpmt|tracking-service)\/|\.corriereobjects\.it\/.+\/js\/(_paywall\.sjs|tracking\/)|\.userzoom\.com\/files\/js\/)/,
  'digiday.com': /cdn\.tinypass\.com\/.+/,
  'dvhn.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'economist.com': /cdn\.tinypass\.com\/.+/,
  'editorialedomani.it': /(.+\.editorialedomani\.it\/pelcro\.js|js\.pelcro\.com\/.+)/,
  'elcomercio.pe': /elcomercio\.pe\/pf\/dist\/template\/elcomercio-noticia.+\.js/,
  'elmercurio.com': /\.(elmercurio\.com|emol\.cl)\/.+\/js\/((vendor\/)?modal|merPramV\d|PramModal\.min)\.js/,
  'elmundo.es': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
  'elpais.com': /.+\.epimg\.net\/js\/.+\/noticia\.min\.js/,
  'elperiodico.com': /cdn\.ampproject\.org\/v\d\/amp-(access|consent)-.+\.js/,
  'estadao.com.br': /acesso\.estadao\.com\.br\/paywall\/.+\/pw\.js/,
  'estrellavalpo.cl': /(.+\.mercuriovalpo\.cl\/impresa\/.+\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
  'exame.abril.com.br': /cdn\.tinypass\.com\/.+/,
  'financialpost.com': /cdn\.tinypass\.com\/.+/,
  'folha.uol.com.br': /(.+\.folha\.uol\.com\.br\/paywall\/js\/.+\/publicidade\.ads\.js|paywall\.folha\.uol\.com\.br\/.+|js\.matheranalytics\.com\/.+)/,
  'foreignaffairs.com': /.+\.foreignaffairs\.com\/sites\/default\/files\/js\/js_P9zr.+\.js/,
  'foreignpolicy.com': /cdn\.tinypass\.com\/.+/,
  'fortune.com': /cdn\.tinypass\.com\/.+/,
  'fresnobee.com': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
  'ftm.nl': /.+\.ftm\.nl\/js\/routing\?/,
  'gelocal.it': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
  'gestion.pe': /gestion\.pe\/pf\/dist\/template\/gestion-noticia.+\.js/,
  'globes.co.il': /cdn\.tinypass\.com\/.+/,
  'globo.com': /cdn\.tinypass\.com\/.+/,
  'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
  'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js.+/,
  'historyextra.com': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'ilmessaggero.it': /utils\.cedsdigital\.it\/js\/PaywallMeter\.js/,
  'ilrestodelcarlino.it': /cdn\.tinypass\.com\/.+/,
  'independent.ie': /cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js/,
  'inquirer.com': /cdn\.tinypass\.com\/.+/,
  'irishtimes.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
  'knack.be': /.+\.knack\.be\/js\/responsive\/rmgModal\.js/,
  'kurier.at': /cdn\.tinypass\.com\/.+/,
  'la-croix.com': /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/,
  'ladepeche.fr': /.+\.poool\.fr\/.+/,
  'lasegunda.com': /\.(lasegunda\.com|emol\.cl)\/.+\/js\/((vendor\/)?modal|merPramV\d|PramModal\.min)\.js/,
  'lastampa.it': /.+\.repstatic\.it\/minify\/sites\/lastampa\/.+\/config\.cache\.php\?name=social_js/,
  'latercera.com': /(.+\.latercera\.com\/arc\/subs\/p\.js|cdn\.cxense\.com\/.+)/,
  'latimes.com': /js\.matheranalytics\.com\/.+/,
  'lc.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'lejdd.fr': /.+\.poool\.fr\/.+/,
  'leparisien.fr': /cdn\.tinypass\.com\/.+/,
  'lesechos.fr': /cdn\.tinypass\.com\/.+/,
  'limesonline.com': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
  'livemint.com': /(.+\.livemint\.com\/js\/localWorker\.js|analytics\.htmedia\.in\/analytics-js\/.+\.js)/,
  'lopinion.fr': /.+\.poool\.fr\/.+/,
  'lrb.co.uk': /cdn\.tinypass\.com\/.+/,
  'marketwatch.com': /cdn\.cxense\.com\/.+/,
  'mercuriovalpo.cl': /(.+\.mercuriovalpo\.cl\/impresa\/.+\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
  'modernhealthcare.com': /cdn\.tinypass\.com\/.+/,
  'nationalgeographic.com': /.+\.blueconic\.net\/.+/,
  'nationalpost.com': /cdn\.tinypass\.com\/.+/,
  'nationalreview.com': /(.+\.blueconic\.net\/.+|cdn\.ampproject\.org\/v\d\/amp-access-.+\.js)/,
  'newrepublic.com': /.+\.onecount\.net\/js\/.+/,
  'newsweek.com': /js\.pelcro\.com\/.+/,
  'newyorker.com': /.+\.newyorker\.com\/verso\/static\/presenter-articles.+\.js/,
  'nknews.org': /.+\.nknews\.org\/wp-content\/plugins\/leaky-paywall-ajax\/js\/leaky-paywall-ajax\.js/,
  'nrz.de': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'nytimes.com': /(meter-svc\.nytimes\.com\/meter\.js|mwcm\.nyt\.com\/.+\.js)/,
  'quotidiano.net': /cdn\.tinypass\.com\/.+/,
  'repubblica.it': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
  'rollingstone.com': /cdn\.cxense\.com\/.+/,
  'sacbee.com': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
  'saechsische.de': /cdn\.tinypass\.com\/.+/,
  'science-et-vie.com': /.+\.qiota\.com\/.+/,
  'sciencesetavenir.fr': /.+\.poool\.fr\/.+/,
  'scmp.com': /cdn\.tinypass\.com\/.+/,
  'seekingalpha.com': /cdn\.tinypass\.com\/.+/,
  'sfchronicle.com': /.+\.blueconic\.net\/.+/,
  'slate.com': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'sloanreview.mit.edu': /(cdn\.tinypass\.com\/.+|.+\/sloanreview\.mit\.edu\/.+\/welcome-ad\.js)/,
  'smh.com.au': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
  'spectator.co.uk': /cdn\.tinypass\.com\/.+/,
  'spectator.com.au': /cdn\.tinypass\.com\/.+/,
  'spectator.us': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'technologyreview.com': /.+\.blueconic\.net\/.+/,
  'telegraph.co.uk': /(cdn\.tinypass\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|consent)-.+\.js|\.telegraph\.co\.uk\/.+\/piano.+\.js|assets\.adobedtm\.com\/.+\.js)/,
  'theage.com.au': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
  'thedailybeast.com': /cdn\.tinypass\.com\/.+/,
  'thehindu.com': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'thehindubusinessline.com': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'thenation.com': /cdn\.tinypass\.com\/.+/,
  'thestar.com': /emeter-nam\.mppglobal\.com\/probes\/JSONP\?/,
  'valeursactuelles.com': /.+\.qiota\.com\/.+/,
  'variety.com': /cdn\.cxense\.com\/.+/,
  'washingtonpost.com': /.+\.washingtonpost\.com\/.+\/pwapi-proxy\.min\.js/,
  'watoday.com.au': /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/,
  'waz.de': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'wp.de': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'wr.de': /(cdn\.cxense\.com\/.+|cdn\.tinypass\.com\/.+)/,
  'wsj.com': /(cdn\.ampproject\.org\/v\d\/amp-access-.+\.js|cdn\.cxense\.com\/.+)/
};

const ad_region_domains = ['bd.nl', 'ed.nl', 'tubantia.nl', 'bndestem.nl', 'pzc.nl', 'destentor.nl', 'gelderlander.nl'];
const au_comm_media_domains = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
const au_news_corp_domains = ['adelaidenow.com.au', 'cairnspost.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'theaustralian.com.au', 'themercury.com.au', 'townsvillebulletin.com.au', 'weeklytimesnow.com.au'];
const au_prov_news_domains = ['news-mail.com.au', 'frasercoastchronicle.com.au', 'gladstoneobserver.com.au', 'dailyexaminer.com.au', 'dailymercury.com.au', 'themorningbulletin.com.au', 'sunshinecoastdaily.com.au', 'gympietimes.com.au', 'northernstar.com.au', 'qt.com.au', 'thechronicle.com.au', 'warwickdailynews.com.au'];
const es_grupo_vocento_domains = ['diariosur.es', 'diariovasco.com', 'elcomercio.es', 'elcorreo.com', 'eldiariomontanes.es', 'elnortedecastilla.es', 'hoy.es', 'ideal.es', 'larioja.com', 'laverdad.es', 'lavozdigital.es'];
const fi_alma_talent_domains = ['arvopaperi.fi', 'kauppalehti.fi', 'marmai.fi', 'mediuutiset.fi', 'mikrobitti.fi', 'talouselama.fi', 'tekniikkatalous.fi', 'tivi.fi', 'uusisuomi.fi'];
const ilmessaggero_domains = ['corriereadriatico.it', 'ilgazzettino.it', 'ilmattino.it', 'quotidianodipuglia.it'];
const nymag_domains = ['grubstreet.com', 'thecut.com', 'vulture.com'];
// pg_domains has only grouped remove_cookies_select_drop rules
const pg_domains = ['parool.nl', 'trouw.nl', 'volkskrant.nl', 'humo.be', 'demorgen.be'];

const userAgentDesktopG = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobileG = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

const userAgentDesktopB = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
const userAgentMobileB = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"

var enabledSites = [];
var disabledSites = [];
var defaultSites_grouped_domains = Object.values(defaultSites);
var defaultSites_domains = defaultSites_grouped_domains.concat(ad_region_domains, au_comm_media_domains, au_news_corp_domains, au_prov_news_domains, es_grupo_vocento_domains, fi_alma_talent_domains, ilmessaggero_domains, nymag_domains);
var customSites = {};
var customSites_domains = [];

function setDefaultOptions() {
  ext_api.storage.local.set({
    sites: defaultSites
  }, function () {
    ext_api.runtime.openOptionsPage();
  });
}

// copy storage.sync to storage.local (quota exceeded)
ext_api.storage.sync.get({
  sites: {},
  sites_custom: {},
  daily_users: {},
  optIn: {},
  optInShown: {},
  customShown: {}
}, function (items) {
  if (Object.keys(items.sites).length > 0) {
    ext_api.storage.local.set({
      sites: items.sites,
      sites_custom: items.sites_custom,
      daily_users: items.daily_users,
      optIn: items.optIn,
      optInShown: items.optInShown,
      customShown: items.customShown
    }, function () {
      ext_api.storage.sync.remove(['sites', 'sites_custom']);
    });
  }
});

// add grouped sites to en/disabledSites & init rules (optional)
function add_grouped_sites(init_rules) {
  if (init_rules) {
    for (let domain of ad_region_domains)
      remove_cookies_select_drop[domain] = ['temptationTrackingId'];
    for (let domain of au_comm_media_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/;
    }
    for (let domain of au_news_corp_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-access-.+\.js/;
    }
    for (let domain of au_prov_news_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
    }
    for (let domain of es_grupo_vocento_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(access|subscriptions)-.+\.js/;
    }
    for (let domain of fi_alma_talent_domains) {
      use_google_bot.push(domain);
    }
    for (let domain of ilmessaggero_domains)
      blockedRegexes[domain] = /utils\.cedsdigital\.it\/js\/PaywallMeter\.js/;
    for (let domain of pg_domains)
      remove_cookies_select_drop[domain] = ['TID_ID'];
  }
  if (enabledSites.includes('ad.nl'))
    enabledSites = enabledSites.concat(ad_region_domains);
  else
    disabledSites = disabledSites.concat(ad_region_domains);
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
  if (enabledSites.includes('###_es_grupo_vocento'))
    enabledSites = enabledSites.concat(es_grupo_vocento_domains);
  else
    disabledSites = disabledSites.concat(es_grupo_vocento_domains);
  if (enabledSites.includes('###_fi_alma_talent'))
    enabledSites = enabledSites.concat(fi_alma_talent_domains);
  else
    disabledSites = disabledSites.concat(fi_alma_talent_domains);
  if (enabledSites.includes('ilmessaggero.it'))
    enabledSites = enabledSites.concat(ilmessaggero_domains);
  else
    disabledSites = disabledSites.concat(ilmessaggero_domains);
  if (enabledSites.includes('nymag.com'))
    enabledSites = enabledSites.concat(nymag_domains);
  else
    disabledSites = disabledSites.concat(nymag_domains);
}

// Get the enabled sites (from local storage) & add to allow/remove_cookies (if not already in one of these arrays)
// Add googlebot- and block_javascript-settings for custom sites
ext_api.storage.local.get({
  sites: {},
  sites_custom: {}
}, function (items) {
  var sites = items.sites;
  var sites_custom = items.sites_custom;

  for (let key in sites_custom) {
    var domainVar = sites_custom[key]['domain'].toLowerCase();
    if (sites_custom[key]['googlebot'] > 0 && !use_google_bot.includes(domainVar))
      use_google_bot.push(domainVar);
    if (sites_custom[key]['allow_cookies'] > 0 && !allow_cookies.includes(domainVar))
      allow_cookies.push(domainVar);
    if (sites_custom[key]['block_javascript'] > 0)
      block_js_custom.push(domainVar);
    if (sites_custom[key]['block_javascript_ext'] > 0)
      block_js_custom_ext.push(domainVar);
  }

  enabledSites = Object.keys(sites).filter(function (key) {
      return (sites[key] !== '' && sites[key] !== '###');
    }).map(function (key) {
      return sites[key].toLowerCase();
    });
  customSites = sites_custom;
  customSites_domains = Object.values(sites_custom).map(x => x.domain);
  disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
  add_grouped_sites(true);

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
  if (namespace === 'sync')
    return;
  for (let key in changes) {
    var storageChange = changes[key];
    if (key === 'sites') {
      var sites = storageChange.newValue;
      enabledSites = Object.keys(sites).filter(function (key) {
          return (sites[key] !== '' && sites[key] !== '###');
        }).map(function (key) {
          return sites[key];
        });
      disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
      add_grouped_sites(false);

      for (let domainVar of enabledSites) {
        if (!allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar)) {
          allow_cookies.push(domainVar);
          remove_cookies.push(domainVar);
        }
      }
      // reset disableJavascriptOnListedSites eventListener
      ext_api.webRequest.onBeforeRequest.removeListener(disableJavascriptOnListedSites);
      ext_api.webRequest.handlerBehaviorChanged();
    }
    if (key === 'sites_custom') {
      var sites_custom = storageChange.newValue ? storageChange.newValue : {};
      var sites_custom_old = storageChange.oldValue ? storageChange.oldValue : {};
      customSites = sites_custom;
      customSites_domains = Object.values(sites_custom).map(x => x.domain);

      // add/remove custom sites in options
      var sites_custom_added = Object.keys(sites_custom).filter(x => !Object.keys(sites_custom_old).includes(x) && !defaultSites.hasOwnProperty(x));
      var sites_custom_removed = Object.keys(sites_custom_old).filter(x => !Object.keys(sites_custom).includes(x) && !defaultSites.hasOwnProperty(x));

      ext_api.storage.local.get({
        sites: {}
      }, function (items) {
        var sites = items.sites;
        for (let key of sites_custom_added)
          sites[key] = sites_custom[key].domain;
        for (let key of sites_custom_removed)
          delete sites[key];

        ext_api.storage.local.set({
          sites: sites
        }, function () {
          true;
        });
      });

      // restore cookie-settings for removed custom (& also default) domain
      var sites_custom_default_domain_removed = Object.values(sites_custom_old).map(function (site_old) {
          return site_old.domain;
        }).filter(x => !Object.values(sites_custom).map(function (site_new) {
            return site_new.domain;
          }).includes(x) && defaultSites_domains.includes(x));
      for (let domain of sites_custom_default_domain_removed) {
        if (!allow_cookies_default.includes(domain) && !remove_cookies.includes(domain))
          remove_cookies.push(domain);
      }

      use_google_bot = use_google_bot_default.slice();
      block_js_custom = [];
      block_js_custom_ext = [];
      for (let key in sites_custom) {
        var domainVar = sites_custom[key]['domain'].toLowerCase();
        if (sites_custom[key]['googlebot'] > 0 && !use_google_bot.includes(domainVar)) {
          use_google_bot.push(domainVar);
        }
        if (sites_custom[key]['allow_cookies'] > 0) {
          if (allow_cookies.includes(domainVar)) {
            if (remove_cookies.includes(domainVar))
              remove_cookies.splice(remove_cookies.indexOf(domainVar), 1);
          } else
            allow_cookies.push(domainVar);
        } else if (!allow_cookies_default.includes(domainVar) && allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar))
            remove_cookies.push(domainVar);
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

// fix nytimes x-frame-options (hidden iframe content)
ext_api.webRequest.onHeadersReceived.addListener(function (details) {
  if (!isSiteEnabled(details)) {
    return;
  }
  var responseHeaders = details.responseHeaders;
  responseHeaders = responseHeaders.map(function (responseHeader) {
      if (responseHeader.name === 'x-frame-options')
        responseHeader.value = 'SAMEORIGIN';
      return responseHeader;
    });
  return {
    responseHeaders: responseHeaders
  };
}, {
  urls: ["*://*.nytimes.com/*"]
},
  ['blocking', 'responseHeaders']);

var block_js_default = ["*://cdn.tinypass.com/*", "*://*.piano.io/*", "*://*.poool.fr/*",  "*://cdn.ampproject.org/v*/amp-access-*.js", "*://*.blueconic.net/*", "*://*.cxense.com/*", "*://*.evolok.net/*", "*://js.matheranalytics.com/*", "*://*.onecount.net/*", "*://js.pelcro.com/*", "*://*.qiota.com/*", "*://*.tribdss.com/*"];
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
  for (let n in requestHeaders) {
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

  // load toggleIcon.js (icon for dark or incognito mode in Chrome))
  if (typeof browser !== 'object') {
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
        ext_api.tabs.executeScript({
          file: 'toggleIcon.js',
          runAt: 'document_start'
        }, function (res) {
          if (ext_api.runtime.lastError || res[0]) {
            return;
          }
        });
      }
    });
  }

  let inkl_site = (matchUrlDomain('cdn.jsdelivr.net', details.url) && matchUrlDomain('inkl.com', header_referer) && isSiteEnabled({url: header_referer}));
  let bloomberg_site = (matchUrlDomain('assets.bwbx.io', details.url) && matchUrlDomain('bloomberg.com', header_referer) && isSiteEnabled({url: header_referer}));
  let au_nc_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && matchUrlDomain(au_news_corp_domains, header_referer) && isSiteEnabled({url: header_referer}));
  let au_apn_site = (header_referer && (urlHost(header_referer).endsWith('com.au') || urlHost(header_referer).endsWith('net.au')) && details.url.includes('https://media.apnarm.net.au/'));
  let au_swm_site = (header_referer && urlHost(header_referer).endsWith('com.au') && details.url.includes('https://s.thewest.com.au/'));
  let es_grupo_vocento_site = (matchUrlDomain('cdn.ampproject.org', details.url) && matchUrlDomain(es_grupo_vocento_domains, header_referer) && isSiteEnabled({url: header_referer}));
  let fr_lacroix_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && matchUrlDomain('la-croix.com', header_referer) && isSiteEnabled({url: header_referer}));
  let sz_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && matchUrlDomain('sueddeutsche.de', header_referer) && isSiteEnabled({url: header_referer}));
  let uk_telegraph_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && matchUrlDomain('telegraph.co.uk', header_referer) && isSiteEnabled({url: header_referer}));

  if (!isSiteEnabled(details) && !inkl_site && !bloomberg_site && !au_nc_amp_site && !au_apn_site && !au_swm_site && !es_grupo_vocento_site && !fr_lacroix_amp_site && !sz_amp_site && !uk_telegraph_amp_site) {
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
      "value": useUserAgentMobile ? userAgentMobileG : userAgentDesktopG
    })
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": "66.249.66.1"
    })
  }

  // override User-Agent to use Bingbot
  if (matchUrlDomain(use_bing_bot, details.url)) {
    requestHeaders.push({
      "name": "User-Agent",
      "value": useUserAgentMobile ? userAgentMobileB : userAgentDesktopB
    })
  }

  // random IP for esprit.presse.fr
  if (matchUrlDomain('esprit.presse.fr', details.url)) {
    requestHeaders.push({
      "name": "X-Forwarded-For",
      "value": randomIP()
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
      if ((currentTab && isSiteEnabled(currentTab)) || medium_custom_domain || au_apn_site || au_swm_site) {
        if (currentTab.url !== currentTabUrl) {
          csDone = false;
          currentTabUrl = currentTab.url;
        }
        if ((['main_frame', 'script', 'other', 'xmlhttprequest'].includes(details.type) || matchUrlDomain(cs_limit_except, currentTabUrl)) && !csDone) {
          ext_api.tabs.executeScript(tabId, {
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
  } else {//mercuriovalpo.cl
    ext_api.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {
      if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
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
    let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
    let isCustomSite = matchUrlDomain(customSites_domains, currentUrl);
    if (!isDefaultSite && isCustomSite) {
      ext_api.permissions.contains({
        origins: ["<all_urls>"]
      }, function (result) {
        if (!result)
          badgeText = '';
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


function site_switch() {
    ext_api.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
            let currentUrl = tabs[0].url;
            let isDefaultSite = matchUrlDomain(defaultSites_grouped_domains, currentUrl);
            let defaultSite_title = isDefaultSite ? Object.keys(defaultSites).find(key => defaultSites[key] === isDefaultSite) : '';
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

function popup_show_toggle_tab(callback) {
    ext_api.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
            let currentUrl = tabs[0].url;
            let isDefaultSiteGrouped = matchUrlDomain(defaultSites_grouped_domains, currentUrl);
            let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
            let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
            let domain = isDefaultSiteGrouped || (!isDefaultSite && isCustomSite);
            callback(domain);
        }
    });
};

// remove cookies after page load
ext_api.webRequest.onCompleted.addListener(function (details) {
  var domainVar = matchUrlDomain(remove_cookies, details.url);
  if (!domainVar || !enabledSites.includes(domainVar))
    return;
  ext_api.cookies.getAll({
    domain: domainVar
  }, function (cookies) {
    for (let cookie of cookies) {
      var rc_domain = cookie.domain.replace(/^(\.?www\.|\.)/, '');
      // hold specific cookie(s) from remove_cookies domains
      if ((rc_domain in remove_cookies_select_hold) && remove_cookies_select_hold[rc_domain].includes(cookie.name)) {
        continue; // don't remove specific cookie
      }
      // drop only specific cookie(s) from remove_cookies domains
      if ((rc_domain in remove_cookies_select_drop) && !(remove_cookies_select_drop[rc_domain].includes(cookie.name))) {
        continue; // only remove specific cookie
      }
      cookie.domain = cookie.domain.replace(/^\./, '');
      ext_api.cookies.remove({
        url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path,
        name: cookie.name
      });
    }
  });
}, {
  urls: ["<all_urls>"]
});

function clear_cookies() {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
      ext_api.tabs.executeScript({
        file: 'clearCookies.js',
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
  // check storage for opt in
  if (message.request === 'optin') {
    ext_api.storage.local.get("optIn", function (result) {
      // send message back to content script with value of opt in
      ext_api.tabs.sendMessage(
        sender.tab.id, {
        "optIn": (true == result.optIn)
      });
    });
  }
  // clear cookies for domain
  if (message.domain) {
    var domainVar = message.domain.replace('www.', '');
    ext_api.cookies.getAll({
      domain: domainVar
    }, function (cookies) {
      for (let cookie of cookies) {
        cookie.domain = cookie.domain.replace(/^\./, '');
        ext_api.cookies.remove({
          url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path,
          name: cookie.name
        });
      }
    });
  }
  if (message.scheme && ![chrome_scheme, 'undefined'].includes(message.scheme)) {
      let icon_path = {path: {'128': 'bypass.png'}};
      if (message.scheme === 'dark')
          icon_path = {path: {'128': 'bypass-dark.png'}};
      ext_api.browserAction.setIcon(icon_path);
      chrome_scheme = message.scheme;
  }
  if (message.csDone) {
    csDone = true;
    //console.log('msg.csDone: ' + csDone);
  }
});

// show the tab if we haven't registered the user reacting to the prompt.
ext_api.storage.local.get(["optInShown", "customShown"], function (result) {
  if (!result.optInShown || !result.customShown) {
    ext_api.tabs.create({
      url: "optin/opt-in.html"
    });
    ext_api.storage.local.set({
      "optInShown": true,
      "customShown": true
    });
  }
});

function isSiteEnabled(details) {
  var enabledSite = matchUrlDomain(enabledSites, details.url);
  if (!ext_name.includes('Clean'))
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
