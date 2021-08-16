/* Please respect alphabetical order when adding a site in any list */

'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;
var ext_name = ext_api.runtime.getManifest().name;

const cs_limit_except = ['elespanol.com', 'faz.net', 'inkl.com', 'la-croix.com', 'nation.africa', 'nationalgeographic.com'];
var currentTabUrl = '';
var csDone = false;

// Cookies from this list are blocked by default (obsolete)
// defaultSites are loaded from sites.js at installation extension
// var defaultSites = {};

const restrictions = {
  'adweek.com': /^((?!\.adweek\.com\/(.+\/)?(amp|agencyspy|tvnewser|tvspy)\/).)*$/,
  'barrons.com': /.+\.barrons\.com\/(amp\/)?article(s)?\/.+/,
  'bloomberg.com': /^((?!\.bloomberg\.com\/news\/terminal\/).)*$/,
  'bloombergquint.com': /^((?!\.bloombergquint\.com\/bq-blue-exclusive\/).)*$/,
  'economictimes.com': /.+\.economictimes\.com\/($|(__assets|prime)(\/.+)?|.+\.cms)/,
  'elespanol.com': /^((?!\/cronicaglobal\.elespanol\.com\/).)*$/,
  'elpais.com': /(\/elpais\.com\/$|\/(.+\.)?elpais\.com\/.+\.html)/,
  'faz.net': /^((?!\/.+\.faz\.net\/aktuell\/(\?switchfaznet)?$).)*$/,
  'foreignaffairs.com': /.+\.foreignaffairs\.com\/(articles|fa-caching|interviews|reviews|sites)\/.+/,
  'ft.com': /.+\.ft\.com\/content\//,
  'medianama.com': /\.medianama\.com\/((\d){4}\/(\d){2}|wp-content)\//,
  'timesofindia.com': /.+\.timesofindia\.com\/($|toi-plus(\/.+)?|.+\.cms)/,
  'nknews.org': /^((?!nknews\.org\/pro\/).)*$/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'seekingalpha.com': /.+\/seekingalpha\.com\/($|(amp\/)?(article|news)\/|samw\/)/,
  'statista.com': /^((?!\.statista\.com\/(outlook|study)\/).)*$/,
  'sueddeutsche.de': /^((?!projekte\.sueddeutsche\.de\/).)*$/,
  'techinasia.com': /\.techinasia\.com\/.+/,
  'wsj.com': /^((?!\/cn\.wsj\.com\/).)*$/
}

// Don't remove cookies before page load
// allow_cookies are completed with domains in custom sites (default allow/remove_cookies)
var allow_cookies_default = [
  'abc.es',
  'abril.com.br',
  'ajc.com',
  'apollo-magazine.com',
  'asiatimes.com',
  'atlantico.fr',
  'augsburger-allgemeine.de',
  'belfasttelegraph.co.uk',
  'berliner-zeitung.de',
  'berlingske.dk',
  'billboard.com',
  'bostonglobe.com',
  'business-standard.com',
  'businessoffashion.com',
  'charliehebdo.fr',
  'chronicle.com',
  'cicero.de',
  'clarin.com',
  'cmjornal.pt',
  'dallasnews.com',
  'df.cl',
  'di.se',
  'dn.se',
  'dvhn.nl',
  'editorialedomani.it',
  'elcomercio.pe',
  'elconfidencial.com',
  'elespanol.com',
  'elmercurio.com',
  'elpais.com',
  'elperiodico.com',
  'entrepreneur.com',
  'esprit.presse.fr',
  'euobserver.com',
  'eurekareport.com.au',
  'faz.net',
  'financialpost.com',
  'fortune.com',
  'freiepresse.de',
  'ftm.nl',
  'gestion.pe',
  'gva.be',
  'haaretz.co.il',
  'haaretz.com',
  'handelsblatt.com',
  'hilltimes.com',
  'hindustantimes.com',
  'ilfattoquotidiano.it',
  'inc42.com',
  'independent.ie',
  'infzm.com',
  'intelligentinvestor.com.au',
  'jpost.com',
  'knack.be',
  'kurier.at',
  'la-croix.com',
  'lanouvellerepublique.fr',
  'latribune.fr',
  'lavanguardia.com',
  'lc.nl',
  'lejdd.fr',
  'lesechos.fr',
  'letelegramme.fr',
  'lexpress.fr',
  'livelaw.in',
  'loeildelaphotographie.com',
  'lrb.co.uk',
  'marketwatch.com',
  'medianama.com',
  'medium.com',
  'modernhealthcare.com',
  'nation.africa',
  'nationalgeographic.com',
  'nationalpost.com',
  'nationalreview.com',
  'newleftreview.org',
  'newrepublic.com',
  'newsday.com',
  'nouvelobs.com',
  'noz.de',
  'nwzonline.de',
  'nybooks.com',
  'nyteknik.se',
  'nytimes.com',
  'nzz.ch',
  'observador.pt',
  'parismatch.com',
  'piqd.de',
  'politicaexterior.com',
  'prospectmagazine.co.uk',
  'quora.com',
  'reuters.com',
  'rhein-zeitung.de',
  'rheinpfalz.de',
  'rollingstone.com',
  'ruhrnachrichten.de',
  'saechsische.de',
  'scientificamerican.com',
  'scribd.com',
  'seekingalpha.com',
  'shz.de',
  'si.com',
  'slader.com',
  'staradvertiser.com',
  'startribune.com',
  'stocknews.com',
  'stratfor.com',
  'study.com',
  'sudouest.fr',
  'sueddeutsche.de',
  'svz.de',
  'techinasia.com',
  'telegraaf.nl',
  'the-american-interest.com',
  'theartnewspaper.com',
  'thehindu.com',
  'thehindubusinessline.com',
  'themarker.com',
  'thenewatlantis.com',
  'thewest.com.au',
  'thewrap.com',
  'time.com',
  'timeshighereducation.com',
  'towardsdatascience.com',
  'usatoday.com',
  'usinenouvelle.com',
  'variety.com',
  'velonews.com',
  'venturebeat.com',
  'washingtonpost.com',
  'wiwo.de',
  'worldpoliticsreview.com',
  'zeit.de',
];
var allow_cookies = allow_cookies_default.slice();

// select specific cookie(s) to hold from remove_cookies domains
var remove_cookies_select_hold = {
  'barrons.com': ['wsjregion'],
  'groene.nl': ['accept-cookies', 'popunder-hidden'],
  'newstatesman.com': ['STYXKEY_nsversion'],
  'qz.com': ['gdpr'],
  'seattletimes.com': ['st_newsletter_splash_seen'],
  'wsj.com': ['wsjregion', 'ResponsiveConditional_initialBreakpoint']
}

// select only specific cookie(s) to drop from remove_cookies domains
var remove_cookies_select_drop = {
  'ambito.com': ['TDNotesRead'],
  'caixinglobal.com': ['CAIXINGLB_LOGIN_UUID'],
  'fd.nl': ['socialread'],
  'griffithreview.com': ['issuem_lp'],
  'nrc.nl': ['counter'],
  'theatlantic.com': ['articleViews'],
  'thepointmag.com': ['monthly_history']
}

var cookies_select_domains = Object.keys(remove_cookies_select_hold).concat(Object.keys(remove_cookies_select_drop));

// Removes cookies after page load
// remove_cookies are completed with domains of custom sites (default allow/remove_cookies)
var remove_cookies_default = ['scientificamerican.com'];
var remove_cookies = remove_cookies_default.concat(cookies_select_domains);

allow_cookies = allow_cookies.concat(cookies_select_domains);

// Override User-Agent with Googlebot
var use_google_bot_default = [
  'abc.es',
  'barrons.com',
  'berlingske.dk',
  'deutsche-wirtschafts-nachrichten.de',
  'df.cl',
  'di.se',
  'dn.se',
  'editorialedomani.it',
  'elmercurio.com',
  'euobserver.com',
  'eurekareport.com.au',
  'fnlondon.com',
  'ft.com',
  'handelsblatt.com',
  'hilltimes.com',
  'intelligentinvestor.com.au',
  'lanouvellerepublique.fr',
  'leparisien.fr',
  'newleftreview.org',
  'nknews.org',
  'nouvelobs.com',
  'nzz.ch',
  'piqd.de',
  'quora.com',
  'republic.ru',
  'rhein-zeitung.de',
  'rheinpfalz.de',
  'ruhrnachrichten.de',
  'seekingalpha.com',
  'thetimes.co.uk',
  'usatoday.com',
  'usinenouvelle.com',
  'wired.com',
  'wiwo.de',
  'worldpoliticsreview.com',
  'wsj.com',
  'zeit.de',
];
var use_google_bot = use_google_bot_default.slice();

// Override User-Agent with Bingbot
var use_bing_bot_default = [
  'haaretz.co.il',
  'haaretz.com',
  'stratfor.com',
  'themarker.com',
];
var use_bing_bot = use_bing_bot_default.slice();

var use_facebook_referer_default = ['clarin.com', 'fd.nl', 'ilmanifesto.it', 'law.com', 'sloanreview.mit.edu'];
var use_facebook_referer = use_facebook_referer_default.slice();
var use_google_referer_default = ['statista.com'];
var use_google_referer = use_google_referer_default.slice();
var use_twitter_referer_default = ['medium.com', 'towardsdatascience.com'];
var use_twitter_referer = use_twitter_referer_default.slice();
var use_random_ip = ['esprit.presse.fr', 'slader.com'];
var change_headers = use_google_bot.concat(use_bing_bot, use_facebook_referer, use_google_referer, use_twitter_referer, use_random_ip);

// block paywall-scripts individually
var blockedRegexes = {
  'abril.com.br': /\.abril\.com\.br\/.+\/abril-paywall\/js\/abril-paywall\.js/,
  'adweek.com': /\.lightboxcdn\.com\//,
  'afr.com': /api\.afr\.com\/graphql\?query=.+PaywallRuleQuery/,
  'ajc.com': /loader-cdn\.azureedge\.net\//,
  'alternatives-economiques.fr': /\.poool\.fr\//,
  'americanbanker.com': /\.tinypass\.com\//,
  'apollo-magazine.com': /\.tinypass\.com\//,
  'asiatimes.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|analytics)-.+\.(m)?js/,
  'atlantico.fr': /\.poool\.fr\//,
  'augsburger-allgemeine.de':/(\.tinypass\.com\/|cdn\.ampproject\.org\/v\d\/amp-(ad|subscriptions)-.+\.js)/,
  'barrons.com': /(cdn\.cxense\.com\/.+|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/,
  'belfasttelegraph.co.uk': /(cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/,
  'billboard.com': /(cdn\.cxense\.com\/|\.tinypass\.com\/)/,
  'bizjournals.com': /(assets\.bizjournals\.com\/static\/js\/app\/cxense\.js|cdn\.cxense\.com\/)/,
  'bloomberg.com': /\.tinypass\.com\//,
  'bostonglobe.com': /\.blueconic\.net\//,
  'businessinsider.com': /\.tinypass\.com\//,
  'challenges.fr': /\.poool\.fr\//,
  'charliehebdo.fr': /\.poool\.fr\//,
  'chronicle.com': /(\.blueconic\.net\/|\.chronicle\.com\/(common\/)?(che-auth0-user|script)\.js)/,
  'clarin.com': /js\.matheranalytics\.com\//,
  'cmjornal.pt': /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad)-.+\.js/,
  'commentary.org': /\.commentary\.org\/.+\/js\/dg-locker-public\.js/,
  'corriere.it': /(\.tinypass\.com\/|\.rcsobjects\.it\/rcs_(cpmt|tracking-service)\/|\.corriereobjects\.it\/.+\/js\/(_paywall\.sjs|tracking\/)|\.userzoom\.com\/files\/js\/)/,
  'dallasnews.com': /(\.blueconic\.net\/|js\.matheranalytics\.com\/)/,
  'digiday.com': /cdn.\.tinypass\.com\//,
  'dvhn.nl': /\.evolok\.net\/.+\/authorize\//,
  'economist.com': /\.tinypass\.com\//,
  'editorialedomani.it': /(\.editorialedomani\.it\/pelcro\.js|js\.pelcro\.com\/)/,
  'elcomercio.pe': /\.amazonaws\.com\/prod\/sdk-identity\.min\.js/,
  'elconfidencial.com': /\.tinypass\.com\//,
  'elespanol.com': /\.eestatic\.com\/assets_js\/web\/v\d\/historia.*\.min\.js/,
  'elmercurio.com': /\.(elmercurio\.com|emol\.cl)\/(.+\/)?js\/(.+\/)?(modal|merPramV\d|PramModal\.min)\.js/,
  'elpais.com': /(\.epimg\.net\/js\/.+\/(noticia|user)\.min\.js|\/elpais\.com\/arc\/subs\/p\.min\.js|cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|consent)-.+\.js)/,
  'elperiodico.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'estadao.com.br': /acesso\.estadao\.com\.br\/paywall\/.+\/pw\.js/,
  'estrellavalpo.cl': /(\.mercuriovalpo\.cl\/impresa\/.+\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
  'exame.com': /\/exame\.com\/.+\/js\/pywll-dyn\.js/,
  'financialpost.com': /\.tinypass\.com\//,
  'foreignaffairs.com': /\.foreignaffairs\.com\/sites\/default\/files\/js\/js_[^y].+\.js/,
  'foreignpolicy.com': /(cdn\.cxense\.com\/|\.tinypass\.com\/)/,
  'fortune.com': /\.tinypass\.com\//,
  'freiepresse.de': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'ftm.nl': /\.ftm\.nl\/js\/routing\?/,
  'gestion.pe': /\.amazonaws\.com\/prod\/sdk-identity\.min\.js/,
  'globes.co.il': /\.tinypass\.com\//,
  'globo.com': /\.tinypass\.com\//,
  'griffithreview.com': /\.griffithreview\.com\/.+\/leaky-paywall\//,
  'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
  'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js/,
  'hbr.org': /\.tinypass\.com\//,
  'hilltimes.com': /\.hilltimes\.com\/.+\/js\/loadingoverlay\/loadingoverlay\.min\.js/,
  'historyextra.com': /\.evolok\.net\/.+\/authorize\//,
  'houstonchronicle.com': /\.blueconic\.net\//,
  'inc.com': /\.tinypass\.com\//,
  'inc42.com': /(\.tinypass\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad|analytics)-.+\.(m)?js)/,
  'independent.ie': /(cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/,
  'inquirer.com': /\.tinypass\.com\//,
  'irishtimes.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js/,
  'japantimes.co.jp': /\.piano\.io\//,
  'jpost.com': /\.jpost\.com\/bundles\/js_article\?/,
  'knack.be': /\.knack\.be\/js\/responsive\/rmgModal\.js/,
  'kurier.at': /\.tinypass\.com\//,
  'la-croix.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js/,
  'lasegunda.com': /\.(lasegunda\.com|emol\.cl)\/(.+\/)?js\/(.+\/)?(modal|merPramV\d|PramModal\.min)\.js/,
  'latercera.com': /(\.latercera\.com\/arc\/subs\/p\.js|cdn\.cxense\.com\/)/,
  'latimes.com': /metering\.platform\.latimes\.com\/v\d\/meter/,
  'latribune.fr': /\.poool\.fr\//,
  'lavanguardia.com': /(\.evolok\.net\/.+\/authorize\/|\.lavanguardia\.com\/(js\/)?godo-)/,
  'lc.nl': /\.evolok\.net\/.+\/authorize\//,
  'lejdd.fr': /\.poool\.fr\//,
  'leparisien.fr': /\.tinypass\.com\//,
  'lesechos.fr': /\.tinypass\.com\//,
  'letelegramme.fr': /\.poool\.fr\//,
  'lexpress.fr': /\.poool\.fr\//,
  'livemint.com': /(\.livemint\.com\/js\/localWorker\.js|analytics\.htmedia\.in\/analytics-js\/.+\.js)/,
  'loeildelaphotographie.com': /cdn\.loeildelaphotographie\.com\/wp-content\/.+\/hague-child\/js\/script-.+\.js/,
  'lopinion.fr': /\.poool\.fr\//,
  'lrb.co.uk': /\.tinypass\.com\//,
  'marketwatch.com': /(cdn\.cxense\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js)/,
  'mercuriovalpo.cl': /(.+\.mercuriovalpo\.cl\/impresa\/.+\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
  'mexiconewsdaily.com': /\.mexiconewsdaily\.com\/c\/assets\/pigeon\.js/,
  'modernhealthcare.com': /(\.tinypass\.com\/|\.modernhealthcare\.com\/.+\/js\/js_.+\.js)/,
  'nation.africa': /(\.evolok\.net\/|nation\.africa\/resource\/themes\/nation-.+\/js\/.+\.js)/,
  'nationalgeographic.com': /\.blueconic\.net\//,
  'nationalpost.com': /\.tinypass\.com\//,
  'nationalreview.com': /(\.blueconic\.net\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js)/,
  'newrepublic.com': /\.onecount\.net\/js\//,
  'newsday.com': /(loader-cdn\.azureedge\.net\/|js\.matheranalytics\.com\/)/,
  'newsweek.com': /js\.pelcro\.com\//,
  'newyorker.com': /\.newyorker\.com\/verso\/static\/presenter-articles.+\.js/,
  'nknews.org': /\.nknews\.org\/wp-content\/themes\/nknews\/js\/bootstrap\.min\.js/,
  'noz.de': /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|fx-flying-carpet)-.+\.js/,
  'nwzonline.de': /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|fx-flying-carpet)-.+\.js/,
  'nyteknik.se': /\.nyteknik\.se\/.+\/static\/js\/site\.min\.js/,
  'nytimes.com': /(meter-svc\.nytimes\.com\/meter\.js|mwcm\.nyt\.com\/.+\.js)/,
  'observador.pt': /\.tinypass\.com\//,
  'parismatch.com': /\.poool\.fr\//,
  'qz.com': /\.tinypass\.com\//,
  'reuters.com': /\.reuters\.com\/(arc\/subs\/p\.min|pf\/resources\/dist\/reuters\/js\/index)\.js/,
  'rollingstone.com': /cdn\.cxense\.com\//,
  'ruhrnachrichten.de': /\.tinypass\.com\//,
  'saechsische.de': /\.tinypass\.com\//,
  'sandiegouniontribune.com': /metering\.platform\.sandiegouniontribune\.com\/v\d\/meter/,
  'science-et-vie.com': /\.qiota\.com\//,
  'sciencesetavenir.fr': /\.poool\.fr\//,
  'scmp.com': /(\.tinypass\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad|analytics|consent|fx-flying-carpet)-.+\.js)/,
  'seekingalpha.com': /(\.tinypass\.com\/|cdn\.ampproject\.org(\/.+)?\/v\d\/amp-(access|ad|loader)-.+\.js)/,
  'sfchronicle.com': /\.blueconic\.net\//,
  'shz.de': /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|fx-flying-carpet)-.+\.js/,
  'si.com': /\.blueconic\.net\//,
  'slate.com': /(cdn\.cxense\.com\/|\.tinypass\.com\/)/,
  'sloanreview.mit.edu': /(\.tinypass\.com\/|\/sloanreview\.mit\.edu\/.+\/welcome-ad\.js)/,
  'spectator.co.uk': /\.tinypass\.com\//,
  'spectator.com.au': /\.tinypass\.com\//,
  'spectator.us': /(cdn\.cxense\.com\/|\.tinypass\.com\/)/,
  'svz.de': /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|fx-flying-carpet)-.+\.js/,
  'technologyreview.com': /\.blueconic\.net\//,
  'telegraph.co.uk': /(\.tinypass\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js|\.telegraph\.co\.uk\/.+\/piano.+\.js|assets\.adobedtm\.com\/.+\.js)/,
  'theartnewspaper.com': /\.amazonaws.com\/production-website-scripts\/bouncer\.js/,
  'thedailybeast.com': /\.tinypass\.com\//,
  'theglobeandmail.com': /smartwall\.theglobeandmail\.com\//,
  'thehindu.com': /(cdn\.cxense\.com\/|\.tinypass\.com\/)/,
  'thehindubusinessline.com': /(cdn\.cxense\.com\/|\.tinypass\.com\/)/,
  'thenation.com': /\.tinypass\.com\//,
  'thenewatlantis.com': /\.thenewatlantis\.com\/.+\/thenewatlantis\/js\/(gate|donate)\.js/,
  'thesaturdaypaper.com.au': /\.thesaturdaypaper\.com\.au\/sites\/all\/modules\/custom\/node_meter\/pw\.js/,
  'thewrap.com': /\.wallkit\.net\/js\//,
  'time.com': /\/time\.com\/dist\/meter-wall-client-js\..+\.js/,
  'timeshighereducation.com': /\.timeshighereducation\.com\/sites\/default\/files\/js\/js_bbCGL.+\.js/,
  'valeursactuelles.com': /\.qiota\.com\//,
  'variety.com': /cdn\.cxense\.com\//,
  'velonews.com': /\.velonews\.com\/.+\/scripts\/contentGate.+\.js/,
  'venturebeat.com': /\.wallkit\.net\/js\//,
  'washingtonpost.com': /(\.washingtonpost\.com\/.+\/default-article\/.+\/load_immediately\/.+\.js|cdn\.ampproject\.org\/.+\/v\d\/amp-(access|(sticky-)?ad|subscriptions)-.+\.js)/,
  'wsj.com': /(cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js|cdn\.cxense\.com\/)/
};

// grouped domains in sites.js (for options)

// grouped domains (rules only)
const au_nine_domains = ['brisbanetimes.com.au', 'smh.com.au', 'theage.com.au', 'watoday.com.au'];
const es_epiberica_domains = ['diariodeibiza.es', 'diariodemallorca.es', 'farodevigo.es', 'laprovincia.es', 'levante-emv.com', 'lne.es'];
const es_unidad_domains = ['elmundo.es', 'expansion.com', 'marca.com'];
const it_repubblica_domains = ['gelocal.it', 'ilsecoloxix.it', 'lanuovasardegna.it', 'lastampa.it', 'limesonline.com', 'repubblica.it'].concat(['lescienze.it']);
const nl_pg_domains = ['parool.nl', 'trouw.nl', 'volkskrant.nl', 'humo.be', 'demorgen.be'];
const usa_genomeweb_domains = ['genomeweb.com', '360dx.com', 'precisiononcologynews.com'];

const userAgentDesktopG = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobileG = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

const userAgentDesktopB = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
const userAgentMobileB = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"

var enabledSites = [];
var disabledSites = [];
var customSites = {};
var customSites_domains = [];
var excludedSites = [];

function setDefaultOptions() {
  ext_api.storage.local.set({
    sites: filterObject(defaultSites, function (val, key) {
      return !val.includes('#options_disable_')
    })
  }, function () {
    ext_api.runtime.openOptionsPage();
  });
}

var grouped_sites = {
'###_au_comm_media': au_comm_media_domains,
'###_au_news_corp': au_news_corp_domains,
'###_au_prov_news': au_prov_news_domains,
'###_br_folha': br_folha_domains,
'###_ca_torstar': ca_torstar_domains,
'###_de_funke_medien': de_funke_media_domains,
'###_de_madsack': de_madsack_domains,
'###_economictimes': economictimes_domains,
'###_es_grupo_vocento': es_grupo_vocento_domains,
'###_fi_alma_talent': fi_alma_talent_domains,
'###_fi_sanoma': fi_sanoma_domains,
'###_fr_be_groupe_rossel': fr_be_groupe_rossel_domains,
'###_fr_groupe_ebra': fr_groupe_ebra_domains,
'###_fr_groupe_la_depeche': fr_groupe_la_depeche_domains,
'###_it_ilmessaggero': it_ilmessaggero_domains,
'###_it_quotidiano': it_quotidiano_domains,
'###_nl_ad_region': nl_ad_region_domains,
'###_nl_mediahuis_region': nl_mediahuis_region_domains,
'###_no_nhst_media': no_nhst_media_domains,
'###_timesofindia': timesofindia_domains,
'###_usa_crainsbiz': usa_crainsbiz_domains,
'###_usa_mcc': usa_mcc_domains,
'###_usa_mng': usa_mng_domains,
'###_usa_nymag': usa_nymag_domains,
'###_usa_tribune': usa_tribune_domains,
'###_usa_theathletic': usa_theathletic_domains
};

function add_grouped__enabled_domains(groups) {
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

// add grouped sites to en/disabledSites & init rules (optional)
function add_grouped_sites(init_rules) {
  add_grouped__enabled_domains(grouped_sites);
  if (init_rules) {
    for (let domain of au_comm_media_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn-au\.piano\.io\/api\/tinypass.+\.js/;
    }
    for (let domain of au_news_corp_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(access|ad|iframe)-.+\.js/;
    }
    for (let domain of au_prov_news_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
    }
    for (let domain of br_folha_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] =  /(\.folha\.uol\.com\.br\/paywall\/js\/.+\/publicidade\.ads\.js|paywall\.folha\.uol\.com\.br\/|js\.matheranalytics\.com\/)/;
    }
    for (let domain of ca_torstar_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /\.(ca|com)\/api\/overlaydata/;
    }
    for (let domain of de_funke_media_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(cdn\.cxense\.com\/|\.tinypass\.com\/)/;
      use_google_bot.push(domain);
    }
    for (let domain of de_madsack_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(ad|subscriptions)-.+\.js/;
    }
    for (let domain of economictimes_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
    }
    for (let domain of es_grupo_vocento_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(access|ad|subscriptions)-.+\.js/;
    }
    for (let domain of fi_alma_talent_domains) {
      if (!['mediuutiset.fi'].includes(domain))
        blockedRegexes[domain] = /\.fi\/static\/vendor\..+\.chunk\.js/;
      use_google_bot.push(domain);
    }
    for (let domain of fi_sanoma_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
    }
    for (let domain of fr_be_groupe_rossel_domains) {
      if (!['lecho.be'].includes(domain)) {
        allow_cookies.push(domain);
        use_google_bot.push(domain);
      }
    }
    for (let domain of fr_groupe_ebra_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(\.poool\.fr\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/;
    }
    for (let domain of fr_groupe_la_depeche_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(\.poool\.fr\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent|subscriptions)-.+\.js)/;//|iframe
    }
    for (let domain of it_ilmessaggero_domains)
      blockedRegexes[domain] = /utils\.cedsdigital\.it\/js\/PaywallMeter\.js/;
    for (let domain of nl_ad_region_domains) {
      allow_cookies.push(domain);
      remove_cookies.push(domain);
      remove_cookies_select_drop[domain] = ['temptationTrackingId'];
    }
    for (let domain of it_quotidiano_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(cdn\.cxense\.com\/|\.tinypass\.com\/)/;
    }
    for (let domain of nl_mediahuis_region_domains)
      allow_cookies.push(domain);
    for (let domain of no_nhst_media_domains) {
      allow_cookies.push(domain);
      use_facebook_referer.push(domain);
    }
    for (let domain of timesofindia_domains) {
      allow_cookies.push(domain);
      use_google_bot.push(domain);
      if (domain === 'timesofindia.com')
        blockedRegexes[domain] = /\.timesofindia\.com\/jsrender\.cms/;
      else
        blockedRegexes[domain] = /timesofindia\.indiatimes\.com\/jsrender\/version-1\.cms/;
    }
    for (let domain of usa_crainsbiz_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(\.tinypass\.com\/|\.(crains.+|.+business)\.com\/.+\/js\/js_.+\.js)/;
    }
    for (let domain of usa_mcc_domains)
      blockedRegexes[domain] = /(js\.matheranalytics\.com\/|cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js)/;
    for (let domain of usa_tribune_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /\.tribdss\.com\//;
    }
    for (let domain of usa_mng_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(\.blueconic\.net\/|\.tinypass\.com\/|\.com\/.+\/loader\.min\.js|cdn\.ampproject\.org\/v\d\/amp-((sticky-)?ad|subscriptions)-.+\.js)/;
    }
    for (let domain of usa_theathletic_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/;
    }

    // rules only
    for (let domain of au_nine_domains)
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-((sticky-)?ad|subscriptions)-.+\.js/;
    for (let domain of es_unidad_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] =  /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|consent)-.+\.js/;
    }
    for (let domain of es_epiberica_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(access|analytics|consent)-.+\.js/;
    }
    for (let domain of it_repubblica_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(scripts\.repubblica\.it\/pw\/pw\.js|cdn\.ampproject\.org\/v\d\/amp-(access|ad|user-notification)-.+\.js)/;
    }
    for (let domain of nl_pg_domains) {
      allow_cookies.push(domain);
      remove_cookies.push(domain);
      remove_cookies_select_drop[domain] = ['TID_ID'];
    }
    for (let domain of usa_genomeweb_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /crain-platform-.+-prod\.s3\.amazonaws\.com\/s3fs-public\/js\/js_.+\.js/;
    }

    use_google_bot_default = use_google_bot.slice();
    use_bing_bot_default = use_bing_bot.slice();
    use_facebook_referer_default = use_facebook_referer.slice();
    use_google_referer_default = use_google_referer.slice();
    use_twitter_referer_default = use_twitter_referer.slice();
    change_headers = use_google_bot.concat(use_bing_bot, use_facebook_referer, use_google_referer, use_twitter_referer, use_random_ip);
  }
}

// Get the enabled sites (from local storage) & add to allow/remove_cookies (if not already in one of these arrays)
// Add googlebot- and block_javascript-settings for custom sites
ext_api.storage.local.get({
  sites: {},
  sites_custom: {},
  sites_excluded: []
}, function (items) {
  var sites = items.sites;
  var sites_custom = items.sites_custom;
  excludedSites = items.sites_excluded;

  enabledSites = Object.keys(sites).filter(function (key) {
      return (sites[key] !== '' && sites[key] !== '###');
    }).map(function (key) {
      return sites[key].toLowerCase();
    });
  customSites = sites_custom;
  customSites_domains = Object.values(sites_custom).map(x => x.domain);
  disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
  add_grouped_sites(true);  //and exclude sites

  for (let key in sites_custom) {
    var domainVar = sites_custom[key]['domain'].toLowerCase();
    if (sites_custom[key]['googlebot'] > 0 && !use_google_bot.includes(domainVar))
      use_google_bot.push(domainVar);
    switch (sites_custom[key]['useragent']) {
    case 'googlebot':
      if (!use_google_bot.includes(domainVar))
        use_google_bot.push(domainVar);
      break;
    case 'bingbot':
      if (!use_bing_bot.includes(domainVar))
        use_bing_bot.push(domainVar);
      break;
    }
    if (sites_custom[key]['allow_cookies'] > 0 && !allow_cookies.includes(domainVar) && !defaultSites_domains.includes(domainVar))
      allow_cookies.push(domainVar);
    if (sites_custom[key]['block_javascript'] > 0)
      block_js_custom.push(domainVar);
    if (sites_custom[key]['block_javascript_ext'] > 0)
      block_js_custom_ext.push(domainVar);
    switch (sites_custom[key]['referer']) {
    case 'facebook':
      use_facebook_referer.push(domainVar);
      break;
    case 'google':
      use_google_referer.push(domainVar);
      break;
    case 'twitter':
      use_twitter_referer.push(domainVar);
    }
  }

  for (let domainVar of enabledSites) {
    if (!allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar) && !defaultSites_domains.includes(domainVar)) {
      allow_cookies.push(domainVar);
      remove_cookies.push(domainVar);
    }
  }

  change_headers = use_google_bot.concat(use_bing_bot, use_facebook_referer, use_google_referer, use_twitter_referer, use_random_ip);
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
        if (!allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar) && !defaultSites_domains.includes(domainVar)) {
          allow_cookies.push(domainVar);
          remove_cookies.push(domainVar);
        }
      }
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

      use_google_bot = use_google_bot_default.slice();
      use_bing_bot = use_bing_bot_default.slice();
      use_facebook_referer = use_facebook_referer_default.slice();
      use_google_referer = use_google_referer_default.slice();
      use_twitter_referer = use_twitter_referer_default.slice();
      block_js_custom = [];
      block_js_custom_ext = [];
      for (let key in sites_custom) {
        var domainVar = sites_custom[key]['domain'].toLowerCase();
        if (sites_custom[key]['googlebot'] > 0 && !use_google_bot.includes(domainVar)) {
          use_google_bot.push(domainVar);
        }
        switch (sites_custom[key]['useragent']) {
        case 'googlebot':
          if (!use_google_bot.includes(domainVar))
            use_google_bot.push(domainVar);
          break;
        case 'bingbot':
          if (!use_bing_bot.includes(domainVar))
            use_bing_bot.push(domainVar);
          break;
        }
        if (!defaultSites_domains.includes(domainVar)) {
          if (sites_custom[key]['allow_cookies'] > 0) {
            if (allow_cookies.includes(domainVar)) {
              if (remove_cookies.includes(domainVar))
                remove_cookies.splice(remove_cookies.indexOf(domainVar), 1);
            } else
              allow_cookies.push(domainVar);
          } else if (allow_cookies.includes(domainVar) && !remove_cookies.includes(domainVar))
            remove_cookies.push(domainVar);
        }
        if (sites_custom[key]['block_javascript'] > 0) {
          block_js_custom.push(domainVar);
        }
        if (sites_custom[key]['block_javascript_ext'] > 0) {
          block_js_custom_ext.push(domainVar);
        }
        switch (sites_custom[key]['referer']) {
        case 'facebook':
          use_facebook_referer.push(domainVar);
          break;
        case 'google':
          use_google_referer.push(domainVar);
          break;
        case 'twitter':
          use_twitter_referer.push(domainVar);
        }
      }
      change_headers = use_google_bot.concat(use_bing_bot, use_facebook_referer, use_google_referer, use_twitter_referer, use_random_ip);
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
    if (key === 'version_new') {
      version_new = storageChange.newValue;
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

var block_js_default = ["*://cdn.tinypass.com/*", "*://*.piano.io/*", "*://*.poool.fr/*",  "*://cdn.ampproject.org/v*/amp-access-*.js", "*://cdn.ampproject.org/v*/amp-subscriptions-*.js", "*://*.blueconic.net/*", "*://*.cxense.com/*", "*://*.evolok.net/*", "*://js.matheranalytics.com/*", "*://*.newsmemory.com/*", "*://*.onecount.net/*", "*://js.pelcro.com/*", "*://*.qiota.com/*", "*://*.tribdss.com/*"];
var block_js_custom = [];
var block_js_custom_ext = [];
var block_js = block_js_default.concat(block_js_custom);

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

  // block script for additional McClatchy sites (opt-in to custom sites)
  var usa_mcc_domain = ((matchUrlDomain('mcclatchyinteractive.com', details.url) && ['script'].includes(details.type)) ||
  (matchUrlDomain('mcclatchy-wires.com', details.url) && ['image'].includes(details.type)) &&
  !matchUrlDomain(usa_mcc_domains, header_referer) && enabledSites.includes('###_usa_mcc'));
  if (usa_mcc_domain) {
    let mcc_domain = urlHost(header_referer).replace(/^(account|amp)\./, '');
    blockedRegexes[mcc_domain] = /(js\.matheranalytics\.com\/|cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js)/;
    usa_mcc_domains.push(mcc_domain);
    if (!enabledSites.includes(mcc_domain))
      enabledSites.push(mcc_domain);
  }

  // block script for additional MediaNews Group sites (opt-in to custom sites)
  var usa_mng_domain = (details.url.match(/\.com\/wp-content\/plugins\/dfm(-pushly|_zeus)\/.+\.js/) && ['script'].includes(details.type) &&
  !matchUrlDomain(usa_mng_domains, header_referer) && enabledSites.includes('###_usa_mng'));
  if (usa_mng_domain) {
    let mng_domain = urlHost(header_referer).replace(/^www\./, '');
    blockedRegexes[mng_domain] = /(\.blueconic\.net\/|\.tinypass\.com\/|\.com\/.+\/loader\.min\.js|cdn\.ampproject\.org\/v\d\/amp-((sticky-)?ad|subscriptions)-.+\.js)/;
    usa_mng_domains.push(mng_domain);
    if (!enabledSites.includes(mng_domain))
      enabledSites.push(mng_domain);
  }

  // block script for additional Madsack/RND sites (opt-in to custom sites)
  var de_rnd_domain = (matchUrlDomain('rndtech.de', details.url) && ['script'].includes(details.type) && !matchUrlDomain(de_madsack_domains.concat(['madsack.de', 'madsack-medien-campus.de', 'rnd.de']), header_referer) && enabledSites.includes('###_de_madsack'));
  if (de_rnd_domain) {
    let rnd_domain = urlHost(header_referer).replace(/^(www|m)\./, '');
    if (!de_madsack_domains.includes(rnd_domain)) {
      allow_cookies.push(rnd_domain);
      blockedRegexes[rnd_domain] = /(cdn\.cxense\.com\/|\.tinypass\.com\/)/;
      de_madsack_domains.push(rnd_domain);
      if (!enabledSites.includes(rnd_domain))
        enabledSites.push(rnd_domain);
    }
  }

  // set user-agent to GoogleBot for additional Snamoma Media Finland (opt-in to custom sites)
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
  var block_regex = true;
  if (domain && details.url.match(blockedRegexes[domain]) && isSiteEnabled({url: header_referer})) {
    if (block_regex)
      return { cancel: true };
  }

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
  let au_apn_site = (header_referer && (urlHost(header_referer).endsWith('com.au') || urlHost(header_referer).endsWith('net.au')) && details.url.includes('https://media.apnarm.net.au/'));
  let au_swm_site = (header_referer && urlHost(header_referer).endsWith('com.au') && details.url.includes('https://s.thewest.com.au/'));

  if (isSiteEnabled({url: header_referer})) {
    let inkl_site = (matchUrlDomain('cdn.jsdelivr.net', details.url) && matchUrlDomain('inkl.com', header_referer));
    let cl_elmerc_site = (matchUrlDomain('emol.cl', details.url) && matchUrlDomain('elmercurio.com', header_referer));
    let es_elesp_site = (matchUrlDomain('eestatic.com', details.url) && matchUrlDomain('elespanol.com', header_referer));
    let it_repubblica_site = (matchUrlDomain(['repstatic.it'], details.url) && matchUrlDomain(it_repubblica_domains, header_referer));
    let usa_mw_site = (matchUrlDomain('wsj.net', details.url) && matchUrlDomain('marketwatch.com', header_referer));
    let usa_natgeo_site = (matchUrlDomain('natgeofe.com', details.url) && matchUrlDomain('nationalgeographic.com', header_referer));
    let usa_today_site = (matchUrlDomain('gannett-cdn.com', details.url) && matchUrlDomain(['usatoday.com'], header_referer));
    allow_ext_source = allow_ext_source || inkl_site || cl_elmerc_site || es_elesp_site || it_repubblica_site || usa_mw_site || usa_natgeo_site || usa_today_site;

    bpc_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && matchUrlDomain(['asiatimes.com', 'augsburger-allgemeine.de', 'barrons.com', 'belfasttelegraph.co.uk', 'cicero.de', 'cmjornal.pt', 'elpais.com', 'elperiodico.com', 'freiepresse.de', 'inc42.com', 'independent.ie', 'irishtimes.com', 'la-croix.com', 'marketwatch.com', 'nationalreview.com', 'noz.de', 'nwzonline.de', 'scmp.com', 'seekingalpha.com', 'shz.de', 'staradvertiser.com', 'sueddeutsche.de', 'svz.de', 'telegraph.co.uk', 'washingtonpost.com'].concat(au_news_corp_domains, au_nine_domains, de_madsack_domains, es_epiberica_domains, es_grupo_vocento_domains, es_unidad_domains, fr_groupe_ebra_domains, fr_groupe_la_depeche_domains, it_repubblica_domains, usa_mcc_domains, usa_mng_domains, usa_theathletic_domains), header_referer));
  }

  if (!isSiteEnabled(details) && !allow_ext_source && !bpc_amp_site && !au_apn_site && !au_swm_site) {
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
    !(matchUrlDomain('wsj.com', details.url) && enabledSites.includes('#options_disable_gb_wsj'));

if (matchUrlDomain(change_headers, details.url) && (['main_frame', 'sub_frame', 'xmlhttprequest'].includes(details.type) || matchUrlDomain('thetimes.co.uk', details.url))) {
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
      useUserAgentMobile = requestHeader.value.toLowerCase().includes("mobile");
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
  if (matchUrlDomain(use_bing_bot, details.url)) {
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
      if ((currentTab && isSiteEnabled(currentTab)) || medium_custom_domain || au_apn_site || au_swm_site) {
        if (currentTab.url !== currentTabUrl) {
          csDone = false;
          currentTabUrl = currentTab.url;
        }
        if ((!['font', 'stylesheet'].includes(details.type) || matchUrlDomain(cs_limit_except, currentTabUrl)) && !csDone) {
          let lib_file = 'lib/empty.js';
          if (matchUrlDomain(['bloomberg.com', 'cicero.de', 'economictimes.com', 'gva.be', 'lesechos.fr', 'newleftreview.org', 'newyorker.com', 'nzherald.co.nz', 'prospectmagazine.co.uk', 'sudouest.fr', 'techinasia.com', 'valor.globo.com', 'washingtonpost.com'].concat(nl_mediahuis_region_domains, no_nhst_media_domains, usa_theathletic_domains), currentTabUrl))
            lib_file = 'lib/purify.min.js';
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
    if (version_new)
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

var version_new;
check_update();
function check_update() {
  var manifestData = ext_api.runtime.getManifest();
  var manifest_new = 'https://bitbucket.org/magnolia1234/bypass-paywalls-firefox-clean/raw/master/manifest.json';
  fetch(manifest_new)
  .then(response => {
    if (response.ok) {
      response.json().then(json => {
        ext_api.management.getSelf(function (result) {
          var installType = result.installType;
          var version_len = (installType === 'development') ? 7 : 5;
          version_new = json['version'];
          if (version_new.substring(0, version_len) <= manifestData.version.substring(0, version_len))
            version_new = '';
          ext_api.storage.local.set({
            version_new: version_new
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

function filterObject(obj, callback) {
  return Object.fromEntries(Object.entries(obj).
    filter(([key, val]) => callback(val, key)));
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
