/* Please respect alphabetical order when adding a site in any list */

'use strict';
var ext_api = (typeof browser === 'object') ? browser : chrome;
var ext_name = ext_api.runtime.getManifest().name;

const cs_limit_except = ['afr.com', 'discovermagazine.com', 'elcomercio.pe', 'elmercurio.com', 'elpais.com', 'faz.net', 'gestion.pe', 'harpers.org', 'inkl.com', 'jpost.com', 'la-croix.com', 'lescienze.it', 'lne.es', 'marketwatch.com', 'newleftreview.org', 'prospectmagazine.co.uk', 'techinasia.com', 'thepointmag.com'];
var currentTabUrl = '';
var csDone = false;

// Cookies from this list are blocked by default (obsolete)
// defaultSites are loaded from sites.js at installation extension
// var defaultSites = {};

const restrictions = {
  'adweek.com': /^((?!\.adweek\.com\/(.+\/)?(amp|agencyspy|tvnewser|tvspy)\/).)*$/,
  'barrons.com': /.+\.barrons\.com\/(amp\/)?article(s)?\/.+/,
  'bloombergquint.com': /^((?!\.bloombergquint\.com\/bq-blue-exclusive\/).)*$/,
  'elcomercio.pe': /.+\/elcomercio\.pe\/.+((\w)+(\-)+){3,}.+/,
  'elpais.com': /(\/elpais\.com\/$|\/(.+\.)?elpais\.com\/.+\.html)/,
  'faz.net': /^((?!\/.+\.faz\.net\/aktuell\/(\?switchfaznet)?$).)*$/,
  'foreignaffairs.com': /.+\.foreignaffairs\.com\/(articles|fa-caching|interviews|reviews|sites)\/.+/,
  'ft.com': /.+\.ft.com\/content\//,
  'gestion.pe': /.+\/gestion\.pe\/.+((\w)+(\-)+){3,}.+/,
  'globo.com': /^((?!\/valor\.globo\.com\/).)*$/,
  'quora.com': /^((?!quora\.com\/search\?q=).)*$/,
  'seekingalpha.com': /.+\/seekingalpha\.com\/($|(amp\/)?(article|news)\/|samw\/)/,
  'techinasia.com': /.+\.techinasia\.com\/.+((\w)+(\-)+){3,}.+/,
  'wsj.com': /^((?!\/cn\.wsj\.com\/).)*$/
}

// Don't remove cookies before page load
// allow_cookies are completed with domains in sites.js (default allow/remove_cookies)
var allow_cookies_default = [
  'abc.es',
  'belfasttelegraph.co.uk',
  'berlingske.dk',
  'bostonglobe.com',
  'business-standard.com',
  'charliehebdo.fr',
  'cicero.de',
  'clarin.com',
  'cmjornal.pt',
  'chronicle.com',
  'df.cl',
  'dn.se',
  'dvhn.nl',
  'editorialedomani.it',
  'elconfidencial.com',
  'elmercurio.com',
  'elmundo.es',
  'elpais.com',
  'elperiodico.com',
  'esprit.presse.fr',
  'euobserver.com',
  'eurekareport.com.au',
  'expansion.com',
  'faz.net',
  'finance.si',
  'financialpost.com',
  'folha.uol.com.br',
  'ftm.nl',
  'fortune.com',
  'freiepresse.de',
  'gelocal.it',
  'gestion.pe',
  'gva.be',
  'haaretz.co.il',
  'haaretz.com',
  'handelsblatt.com',
  'hilltimes.com',
  'hs.fi',
  'ilfattoquotidiano.it',
  'ilrestodelcarlino.it',
  'independent.ie',
  'intelligentinvestor.com.au',
  'jpost.com',
  'knack.be',
  'kurier.at',
  'la-croix.com',
  'lavanguardia.com',
  'lc.nl',
  'lejdd.fr',
  'lesechos.fr',
  'limesonline.com',
  'lne.es',
  'lrb.co.uk',
  'marketwatch.com',
  'medium.com',
  'modernhealthcare.com',
  'nationalgeographic.com',
  'nationalpost.com',
  'nationalreview.com',
  'newleftreview.org',
  'newrepublic.com',
  'noordhollandsdagblad.nl',
  'nouvelobs.com',
  'noz.de',
  'nybooks.com',
  'nytimes.com',
  'nzz.ch',
  'observador.pt',
  'parismatch.com',
  'piqd.de',
  'prospectmagazine.co.uk',
  'quotidiano.net',
  'quora.com',
  'repubblica.it',
  'rollingstone.com',
  'ruhrnachrichten.de',
  'saechsische.de',
  'scribd.com',
  'seekingalpha.com',
  'slader.com',
  'startribune.com',
  'stocknews.com',
  'stratfor.com',
  'sudouest.fr',
  'sueddeutsche.de',
  'svz.de',
  'techinasia.com',
  'the-american-interest.com',
  'theartnewspaper.com',
  'thehindu.com',
  'thehindubusinessline.com',
  'themarker.com',
  'thewest.com.au',
  'time.com',
  'timeshighereducation.com',
  'towardsdatascience.com',
  'usinenouvelle.com',
  'variety.com',
  'washingtonpost.com',
  'wiwo.de',
  'worldpoliticsreview.com',
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
  'qz.com': ['gdpr'],
  'seattletimes.com': ['st_newsletter_splash_seen'],
  'wsj.com': ['wsjregion', 'ResponsiveConditional_initialBreakpoint']
}

// select only specific cookie(s) to drop from remove_cookies domains
var remove_cookies_select_drop = {
  'ambito.com': ['TDNotesRead'],
  'caixinglobal.com': ['CAIXINGLB_LOGIN_UUID'],
  'dn.se': ['randomSplusId'],
  'fd.nl': ['socialread'],
  'griffithreview.com': ['issuem_lp'],
  'nrc.nl': ['counter'],
  'theatlantic.com': ['articleViews'],
  'thepointmag.com': ['monthly_history']
}

// Override User-Agent with Googlebot
var use_google_bot_default = [
  'abc.es',
  'barrons.com',
  'berlingske.dk',
  'deutsche-wirtschafts-nachrichten.de',
  'df.cl',
  'dn.se',
  'editorialedomani.it',
  'euobserver.com',
  'eurekareport.com.au',
  'finance.si',
  'ft.com',
  'handelsblatt.com',
  'hilltimes.com',
  'hs.fi',
  'intelligentinvestor.com.au',
  'mexiconewsdaily.com',
  'miamiherald.com',
  'newleftreview.org',
  'nouvelobs.com',
  'nzz.ch',
  'piqd.de',
  'quora.com',
  'republic.ru',
  'ruhrnachrichten.de',
  'seekingalpha.com',
  'statista.com',
  'stratfor.com',
  'thetimes.co.uk',
  'usinenouvelle.com',
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

var use_facebook_referer_default = ['clarin.com', 'fd.nl', 'ilmanifesto.it', 'law.com', 'sloanreview.mit.edu'];
var use_facebook_referer = use_facebook_referer_default.slice();
var use_google_referer_default = [];
var use_google_referer = use_google_referer_default.slice();
var use_twitter_referer_default = ['medium.com', 'towardsdatascience.com'];
var use_twitter_referer = use_twitter_referer_default.slice();
var use_random_ip = ['esprit.presse.fr', 'slader.com'];
var change_headers = use_google_bot.concat(use_bing_bot, use_facebook_referer, use_google_referer, use_twitter_referer, use_random_ip);

// block paywall-scripts individually
var blockedRegexes = {
  'adweek.com': /.+\.lightboxcdn\.com\/.+/,
  'afr.com': /afr\.com\/assets\/vendorsReactRedux_client.+\.js/,
  'alternatives-economiques.fr': /.+\.poool\.fr\/.+/,
  'americanbanker.com': /\.tinypass\.com\/.+/,
  'barrons.com': /(cdn\.cxense\.com\/.+|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/,
  'belfasttelegraph.co.uk': /(cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/,
  'bizjournals.com': /(assets\.bizjournals\.com\/static\/js\/app\/cxense\.js|cdn\.cxense\.com\/.+)/,
  'bloomberg.com': /(\.tinypass\.com\/|assets\.bwbx\.io\/s3\/fence\/)/,
  'bostonglobe.com': /meter\.bostonglobe\.com\/js\/.+/,
  'businessinsider.com': /\.tinypass\.com\/.+/,
  'challenges.fr': /.+\.poool\.fr\/.+/,
  'charliehebdo.fr': /.+\.poool\.fr\/.+/,
  'chicagobusiness.com': /\.tinypass\.com\/.+/,
  'chicagotribune.com': /.+:\/\/.+\.tribdss\.com\/.+/,
  'chronicle.com': /(.+\.blueconic\.net\/.+|assets\.login\.chronicle\.com\/common\/che-auth0-user\.js)/,
  'clarin.com': /js\.matheranalytics\.com\/.+/,
  'cmjornal.pt': /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad)-.+\.js/,
  'corriere.it': /(\.tinypass\.com\/|\.rcsobjects\.it\/rcs_(cpmt|tracking-service)\/|\.corriereobjects\.it\/.+\/js\/(_paywall\.sjs|tracking\/)|\.userzoom\.com\/files\/js\/)/,
  'digiday.com': /\.tinypass\.com\/.+/,
  'dvhn.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'economist.com': /\.tinypass\.com\/.+/,
  'editorialedomani.it': /(.+\.editorialedomani\.it\/pelcro\.js|js\.pelcro\.com\/.+)/,
  'elcomercio.pe': /elcomercio\.pe\/pf\/dist\/template\/elcomercio-noticia.+\.js/,
  'elconfidencial.com': /\.tinypass\.com\/.+/,
  'elmercurio.com': /\.(elmercurio\.com|emol\.cl)\/(.+\/)?js\/(.+\/)?(modal|merPramV\d|PramModal\.min)\.js/,
  'elmundo.es': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'elpais.com': /(\.epimg\.net\/js\/.+\/noticia\.min\.js|\.cdn\.arcpublishing\.com\/arc\/subs\/p\.min\.js|cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|consent)-.+\.js)/,
  'elperiodico.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'estadao.com.br': /acesso\.estadao\.com\.br\/paywall\/.+\/pw\.js/,
  'estrellavalpo.cl': /(.+\.mercuriovalpo\.cl\/impresa\/.+\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
  'exame.abril.com.br': /\.tinypass\.com\/.+/,
  'expansion.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'financialpost.com': /\.tinypass\.com\/.+/,
  'folha.uol.com.br': /(.+\.folha\.uol\.com\.br\/paywall\/js\/.+\/publicidade\.ads\.js|paywall\.folha\.uol\.com\.br\/.+|js\.matheranalytics\.com\/.+)/,
  'foreignaffairs.com': /.+\.foreignaffairs\.com\/sites\/default\/files\/js\/js_[^y].+\.js/,
  'foreignpolicy.com': /\.tinypass\.com\/.+/,
  'fortune.com': /\.tinypass\.com\/.+/,
  'freiepresse.de': /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js/,
  'ftm.nl': /.+\.ftm\.nl\/js\/routing\?/,
  'gelocal.it': /(\.repstatic.\it\/minify\/sites\/gelocal\/.+\/config\.cache(_\d)?\.php|cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js)/,
  'gestion.pe': /gestion\.pe\/pf\/dist\/template\/gestion-noticia.+\.js/,
  'globes.co.il': /\.tinypass\.com\/.+/,
  'globo.com': /\.tinypass\.com\/.+/,
  'griffithreview.com': /\.griffithreview\.com\/.+\/leaky-paywall\//,
  'haaretz.co.il': /haaretz\.co\.il\/htz\/js\/inter\.js/,
  'haaretz.com': /haaretz\.com\/hdc\/web\/js\/minified\/header-scripts-int.js.+/,
  'hbr.org': /\.tinypass\.com\/.+/,
  'historyextra.com': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'ilrestodelcarlino.it': /\.tinypass\.com\/.+/,
  'ilsecoloxix.it': /(\.repstatic\.it\/minify\/sites\/gelocal\/.+\/config\.cache\.php\?name=ilsecoloxix_pw_js|cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js)/,
  'independent.ie': /(cdn\.flip-pay\.com\/clients\/inm\/flip-pay\.js|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/,
  'inquirer.com': /\.tinypass\.com\/.+/,
  'irishtimes.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js/,
  'japantimes.co.jp': /\.piano\.io\//,
  'jpost.com': /\.jpost\.com\/bundles\/js_article\?/,
  'knack.be': /.+\.knack\.be\/js\/responsive\/rmgModal\.js/,
  'kurier.at': /\.tinypass\.com\/.+/,
  'la-croix.com': /cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js/,
  'lasegunda.com': /\.(lasegunda\.com|emol\.cl)\/(.+\/)?js\/(.+\/)?(modal|merPramV\d|PramModal\.min)\.js/,
  'lanuovasardegna.it': /\.repstatic\.it\/minify\/sites\/lanuovasardegna\/.+\/config\.cache\.php\?name=social_js/,
  'lastampa.it': /.+\.repstatic\.it\/minify\/sites\/lastampa\/.+\/config\.cache\.php\?name=social_js/,
  'latercera.com': /(.+\.latercera\.com\/arc\/subs\/p\.js|cdn\.cxense\.com\/.+)/,
  'latimes.com': /js\.matheranalytics\.com\/.+/,
  'lavanguardia.com': /(\.evolok\.net\/.+\/authorize\/|\.lavanguardia\.com\/(js\/)?godo-)/,
  'lc.nl': /.+\.evolok\.net\/.+\/authorize\/.+/,
  'le1hebdo.fr':  /(\.qiota\.com\/|\/le1hebdo\.fr\/assets\/front\/js\/qiota\.script\.js)/,
  'lejdd.fr': /.+\.poool\.fr\/.+/,
  'leparisien.fr': /\.tinypass\.com\/.+/,
  'lesechos.fr': /\.tinypass\.com\/.+/,
  'limesonline.com': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
  'livemint.com': /(.+\.livemint\.com\/js\/localWorker\.js|analytics\.htmedia\.in\/analytics-js\/.+\.js)/,
  'lne.es': /cdn\.ampproject\.org\/v\d\/amp-(access|consent)-.+\.js/,
  'lopinion.fr': /.+\.poool\.fr\/.+/,
  'lrb.co.uk': /\.tinypass\.com\/.+/,
  'marketwatch.com': /(cdn\.cxense\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js)/,
  'mercuriovalpo.cl': /(.+\.mercuriovalpo\.cl\/impresa\/.+\/assets\/(vendor|\d)\.js|pram\.pasedigital\.cl\/API\/User\/Status\?)/,
  'modernhealthcare.com': /\.tinypass\.com\/.+/,
  'nationalgeographic.com': /.+\.blueconic\.net\/.+/,
  'nationalpost.com': /\.tinypass\.com\/.+/,
  'nationalreview.com': /(.+\.blueconic\.net\/.+|cdn\.ampproject\.org\/v\d\/amp-(access|ad)-.+\.js)/,
  'newrepublic.com': /.+\.onecount\.net\/js\/.+/,
  'newsweek.com': /js\.pelcro\.com\/.+/,
  'newyorker.com': /.+\.newyorker\.com\/verso\/static\/presenter-articles.+\.js/,
  'noz.de': /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|fx-flying-carpet)-.+\.js/,
  'nytimes.com': /(meter-svc\.nytimes\.com\/meter\.js|mwcm\.nyt\.com\/.+\.js)/,
  'observador.pt': /\.tinypass\.com\/.+/,
  'parismatch.com': /.+\.poool\.fr\/.+/,
  'quotidiano.net': /\.tinypass\.com\/.+/,
  'repubblica.it': /scripts\.repubblica\.it\/pw\/pw\.js.+/,
  'rollingstone.com': /cdn\.cxense\.com\/.+/,
  'ruhrnachrichten.de': /\.tinypass\.com\/.+/,
  'saechsische.de': /\.tinypass\.com\/.+/,
  'science-et-vie.com': /.+\.qiota\.com\/.+/,
  'sciencesetavenir.fr': /.+\.poool\.fr\/.+/,
  'scmp.com': /\.tinypass\.com\/.+/,
  'seekingalpha.com': /(\.tinypass\.com\/|cdn\.ampproject\.org(\/.+)?\/v\d\/amp-(access|ad|loader)-.+\.js)/,
  'sfchronicle.com': /.+\.blueconic\.net\/.+/,
  'slate.com': /(cdn\.cxense\.com\/.+|\.tinypass\.com\/.+)/,
  'sloanreview.mit.edu': /(\.tinypass\.com\/.+|.+\/sloanreview\.mit\.edu\/.+\/welcome-ad\.js)/,
  'spectator.co.uk': /\.tinypass\.com\/.+/,
  'spectator.com.au': /\.tinypass\.com\/.+/,
  'spectator.us': /(cdn\.cxense\.com\/.+|\.tinypass\.com\/.+)/,
  'svz.de': /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|consent|fx-flying-carpet)-.+\.js/,
  'technologyreview.com': /.+\.blueconic\.net\/.+/,
  'telegraph.co.uk': /(\.tinypass\.com\/|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js|\.telegraph\.co\.uk\/.+\/piano.+\.js|assets\.adobedtm\.com\/.+\.js)/,
  'theartnewspaper.com': /\.amazonaws.com\/production-website-scripts\/bouncer\.js/,
  'thedailybeast.com': /\.tinypass\.com\/.+/,
  'hilltimes.com': /\.hilltimes\.com\/.+\/js\/loadingoverlay\/loadingoverlay\.min\.js/,
  'thehindu.com': /(cdn\.cxense\.com\/.+|\.tinypass\.com\/.+)/,
  'thehindubusinessline.com': /(cdn\.cxense\.com\/.+|\.tinypass\.com\/.+)/,
  'thenation.com': /\.tinypass\.com\/.+/,
  'time.com': /\/time\.com\/dist\/meter-wall-client-js\..+\.js/,
  'timeshighereducation.com': /\.timeshighereducation\.com\/sites\/default\/files\/js\/js_bbCGL.+\.js/,
  'valeursactuelles.com': /.+\.qiota\.com\/.+/,
  'variety.com': /cdn\.cxense\.com\/.+/,
  'washingtonpost.com': /.+\.washingtonpost\.com\/.+\/pwapi-proxy\.min\.js/,
  'wsj.com': /(cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js|cdn\.cxense\.com\/.+)/
};

const au_comm_media_domains = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
const au_news_corp_domains = ['adelaidenow.com.au', 'cairnspost.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'theaustralian.com.au', 'themercury.com.au', 'townsvillebulletin.com.au', 'weeklytimesnow.com.au'];
const au_prov_news_domains = ['news-mail.com.au', 'frasercoastchronicle.com.au', 'gladstoneobserver.com.au', 'dailyexaminer.com.au', 'dailymercury.com.au', 'themorningbulletin.com.au', 'sunshinecoastdaily.com.au', 'gympietimes.com.au', 'northernstar.com.au', 'qt.com.au', 'thechronicle.com.au', 'warwickdailynews.com.au'];
const ca_torstar_domains = ['niagarafallsreview.ca', 'stcatharinesstandard.ca', 'thepeterboroughexaminer.com', 'therecord.com', 'thespec.com', 'thestar.com', 'wellandtribune.ca'];
const de_funke_media_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'morgenpost.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'waz.de', 'wp.de', 'wr.de'];
const de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de'];
const de_rp_medien_domains = ['aachener-nachrichten.de', 'ga.de', 'rp-online.de', 'saarbruecker-zeitung.de', 'volksfreund.de'];
const es_grupo_vocento_domains = ['diariosur.es', 'diariovasco.com', 'elcomercio.es', 'elcorreo.com', 'eldiariomontanes.es', 'elnortedecastilla.es', 'hoy.es', 'ideal.es', 'larioja.com', 'laverdad.es', 'lavozdigital.es'];
const fi_alma_talent_domains = ['arvopaperi.fi', 'kauppalehti.fi', 'marmai.fi', 'mediuutiset.fi', 'mikrobitti.fi', 'talouselama.fi', 'tekniikkatalous.fi', 'tivi.fi', 'uusisuomi.fi'];
const fr_be_groupe_rossel_domains = ['aisnenouvelle.fr', 'courrier-picard.fr', 'lardennais.fr', 'lavoixdunord.fr', 'lecho.be', 'lesoir.be', 'lest-eclair.fr', 'liberation-champagne.fr', 'lunion.fr', 'nordeclair.fr', 'paris-normandie.fr', 'sudinfo.be'];
const fr_groupe_ebra_domains = ['bienpublic.com', 'dna.fr', 'estrepublicain.fr', 'lalsace.fr', 'ledauphine.com', 'lejsl.com', 'leprogres.fr', 'republicain-lorrain.fr', 'vosgesmatin.fr'];
const fr_groupe_la_depeche_domains = ['centrepresseaveyron.fr', 'ladepeche.fr', 'lindependant.fr', 'midi-olympique.fr', 'midilibre.fr', 'nrpyrenees.fr', 'petitbleu.fr'];
const it_ilmessaggero_domains = ['corriereadriatico.it', 'ilgazzettino.it', 'ilmattino.it', 'ilmessaggero.it', 'quotidianodipuglia.it'];
const nl_ad_region_domains = ['ad.nl', 'bd.nl', 'ed.nl', 'tubantia.nl', 'bndestem.nl', 'pzc.nl', 'destentor.nl', 'gelderlander.nl'];
const usa_mcc_domains = ['bnd.com', 'charlotteobserver.com', 'fresnobee.com', 'kansas.com', 'kansascity.com', 'kentucky.com', 'newsobserver.com', 'sacbee.com', 'star-telegram.com', 'thestate.com', 'tri-cityherald.com'];
const usa_nymag_domains = ['curbed.com', 'grubstreet.com', 'nymag.com', 'thecut.com', 'vulture.com'];

// grouped domains (rules only)
const au_nine_domains = ['brisbanetimes.com.au', 'smh.com.au', 'theage.com.au', 'watoday.com.au'];
const es_epiberica_domains = ['diariodeibiza.es', 'diariodemallorca.es', 'farodevigo.es', 'laprovincia.es'];
const nl_pg_domains = ['parool.nl', 'trouw.nl', 'volkskrant.nl', 'humo.be', 'demorgen.be'];

const userAgentDesktopG = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobileG = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"

const userAgentDesktopB = "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"
const userAgentMobileB = "Chrome/80.0.3987.92 Mobile Safari/537.36 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"

var enabledSites = [];
var disabledSites = [];
var defaultSites_grouped_domains = Object.values(defaultSites);
var defaultSites_domains = defaultSites_grouped_domains.concat(au_comm_media_domains, au_news_corp_domains, au_prov_news_domains, ca_torstar_domains, de_funke_media_domains, de_madsack_domains, de_rp_medien_domains, es_grupo_vocento_domains, fi_alma_talent_domains, fr_be_groupe_rossel_domains, fr_groupe_ebra_domains, fr_groupe_la_depeche_domains, it_ilmessaggero_domains, nl_ad_region_domains, usa_mcc_domains, usa_nymag_domains);
var customSites = {};
var customSites_domains = [];
var excludedSites = [];

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

var grouped_sites = {
'###_au_comm_media': au_comm_media_domains,
'###_au_news_corp': au_news_corp_domains,
'###_au_prov_news': au_prov_news_domains,
'###_ca_torstar': ca_torstar_domains,
'###_de_funke_medien': de_funke_media_domains,
'###_de_madsack': de_madsack_domains,
'###_de_rp_medien': de_rp_medien_domains,
'###_es_grupo_vocento': es_grupo_vocento_domains,
'###_fi_alma_talent': fi_alma_talent_domains,
'###_fr_be_groupe_rossel': fr_be_groupe_rossel_domains,
'###_fr_groupe_ebra': fr_groupe_ebra_domains,
'###_fr_groupe_la_depeche': fr_groupe_la_depeche_domains,
'###_it_ilmessaggero': it_ilmessaggero_domains,
'###_nl_ad_region': nl_ad_region_domains,
'###_usa_mcc': usa_mcc_domains,
'###_usa_nymag': usa_nymag_domains
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
      blockedRegexes[domain] = /.+cdn-au\.piano\.io\/api\/tinypass.+\.js/;
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
    for (let domain of ca_torstar_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /\.(ca|com)\/api\/overlaydata/;
    }
    for (let domain of de_funke_media_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(cdn\.cxense\.com\/.+|\.tinypass\.com\/.+)/;
    }
    for (let domain of de_madsack_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(ad|subscriptions)-.+\.js/;
    }
    for (let domain of de_rp_medien_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(access|(sticky-)?ad|fx-flying-carpet|subscriptions)-.+\.js/;
    }
    for (let domain of es_grupo_vocento_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent|subscriptions)-.+\.js/;
    }
    for (let domain of fi_alma_talent_domains) {
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
      blockedRegexes[domain] = /(.+\.poool\.fr\/.+|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/;
    }
    for (let domain of fr_groupe_la_depeche_domains) {
      allow_cookies.push(domain);
      blockedRegexes[domain] = /(.+\.poool\.fr\/.+|cdn\.ampproject\.org\/v\d\/amp-(access|ad|consent)-.+\.js)/;//|iframe
    }
    for (let domain of it_ilmessaggero_domains)
      blockedRegexes[domain] = /utils\.cedsdigital\.it\/js\/PaywallMeter\.js/;
    for (let domain of nl_ad_region_domains)
      remove_cookies_select_drop[domain] = ['temptationTrackingId'];
    for (let domain of usa_mcc_domains)
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/;
    // rules only
    for (let domain of au_nine_domains)
      blockedRegexes[domain] = /cdn\.ampproject\.org\/v\d\/amp-subscriptions-.+\.js/;
    for (let domain of es_epiberica_domains)
      allow_cookies.push(domain);
    for (let domain of nl_pg_domains)
      remove_cookies_select_drop[domain] = ['TID_ID'];
    use_google_bot_default = use_google_bot.slice();
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

  enabledSites = Object.keys(sites).filter(function (key) {
      return (sites[key] !== '' && sites[key] !== '###');
    }).map(function (key) {
      return sites[key].toLowerCase();
    });
  customSites = sites_custom;
  customSites_domains = Object.values(sites_custom).map(x => x.domain);
  disabledSites = defaultSites_domains.concat(customSites_domains).filter(x => !enabledSites.includes(x) && x !== '###');
  add_grouped_sites(true);  //and exclude sites

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
    // reset disableJavascriptOnListedSites eventListener
    ext_api.webRequest.onBeforeRequest.removeListener(disableJavascriptOnListedSites);
    ext_api.webRequest.handlerBehaviorChanged();

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

// elviajero|retina|verne.elpais.com block inline script
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
  'urls': ["*://elviajero.elpais.com/*", "*://retina.elpais.com/*", "*://verne.elpais.com/*"]
},
  ['blocking', 'responseHeaders']);

var block_js_default = ["*://*.tinypass.com/*", "*://*.piano.io/*", "*://*.poool.fr/*",  "*://cdn.ampproject.org/v*/amp-access-*.js", "*://*.blueconic.net/*", "*://*.cxense.com/*", "*://*.evolok.net/*", "*://js.matheranalytics.com/*", "*://*.newsmemory.com/*", "*://*.onecount.net/*", "*://js.pelcro.com/*", "*://*.qiota.com/*", "*://*.tribdss.com/*"];
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
  var medium_custom_domain = (matchUrlDomain('cdn-client.medium.com', details.url) && !matchUrlDomain(['medium.com', 'towardsdatascience.com'], header_referer) && enabledSites.includes('###_medium_custom'));
  if (medium_custom_domain) {
    let mc_domain = urlHost(header_referer);
    if (!use_twitter_referer.includes(mc_domain)) {
      use_twitter_referer.push(mc_domain);
      change_headers.push(mc_domain);
    }
    if (!enabledSites.includes(mc_domain))
      enabledSites.push(mc_domain);
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
  let au_nc_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && matchUrlDomain(au_news_corp_domains, header_referer) && isSiteEnabled({url: header_referer}));
  let au_apn_site = (header_referer && (urlHost(header_referer).endsWith('com.au') || urlHost(header_referer).endsWith('net.au')) && details.url.includes('https://media.apnarm.net.au/'));
  let au_swm_site = (header_referer && urlHost(header_referer).endsWith('com.au') && details.url.includes('https://s.thewest.com.au/'));
  let cl_elmerc_site = (matchUrlDomain('emol.cl', details.url) && matchUrlDomain('elmercurio.com', header_referer) && isSiteEnabled({url: header_referer}));
  let uk_nlr_site = (matchUrlDomain('stripe.com', details.url) && matchUrlDomain('newleftreview.org', header_referer) && isSiteEnabled({url: header_referer}));
  let usa_discmag_site = (matchUrlDomain('ctfassets.net', details.url) && matchUrlDomain('discovermagazine.com', header_referer) && isSiteEnabled({url: header_referer}));
  let usa_mw_site = (matchUrlDomain('wsj.net', details.url) && matchUrlDomain('marketwatch.com', header_referer) && isSiteEnabled({url: header_referer}));

  let bpc_amp_site = (matchUrlDomain('cdn.ampproject.org', details.url) && isSiteEnabled({url: header_referer}) &&
    matchUrlDomain(['barrons.com', 'belfasttelegraph.co.uk', 'cicero.de', 'cmjornal.pt', 'elmundo.es', 'elpais.com', 'elperiodico.com', 'expansion.com', 'freiepresse.de', 'gelocal.it', 'ilsecoloxix.it', 'independent.ie', 'irishtimes.com', 'la-croix.com', 'lne.es', 'marketwatch.com', 'nationalreview.com', 'noz.de', 'seekingalpha.com', 'sueddeutsche.de', 'svz.de', 'telegraph.co.uk'].concat(au_nine_domains, de_madsack_domains, de_rp_medien_domains, es_grupo_vocento_domains, fr_groupe_ebra_domains, fr_groupe_la_depeche_domains, usa_mcc_domains), header_referer));

  if (!isSiteEnabled(details) && !inkl_site && !au_nc_amp_site && !au_apn_site && !au_swm_site && !cl_elmerc_site && !medium_custom_domain && !uk_nlr_site && !usa_discmag_site && !usa_mw_site && !bpc_amp_site) {
    return;
  }

  // remove cookies Discover Magazine
  if (details.type === 'image' && matchUrlDomain('ctfassets.net', details.url) && matchUrlDomain('discovermagazine.com', header_referer) && isSiteEnabled({url: 'https://www.discovermagazine.com'})) {
    ext_api.cookies.getAll({domain: 'discovermagazine.com'}, function(cookies) {
      for (let cookie of cookies) {
        ext_api.cookies.remove({url: (cookie.secure ? "https://" : "http://") + cookie.domain + cookie.path, name: cookie.name});
      }
    });
  }

  // block javascript of (sub)domain for custom sites (optional)
  var domain_blockjs = matchUrlDomain(block_js_custom, details.url);
  if (domain_blockjs && matchUrlDomain(domain_blockjs, details.url) && details.type === 'script') {
    return { cancel: true };
  }

  var tabId = details.tabId;

  var useUserAgentMobile = false;
  var setReferer = false;

if (['main_frame', 'xmlhttprequest'].includes(details.type) && matchUrlDomain(change_headers, details.url)){
  // if referer exists, set it to google
  requestHeaders = requestHeaders.map(function (requestHeader) {
    if (requestHeader.name === 'Referer') {
      if (matchUrlDomain(use_google_bot, details.url) || matchUrlDomain(use_google_referer, details.url)) {
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
    if (matchUrlDomain(use_google_bot, details.url) || matchUrlDomain(use_google_referer, details.url)) {
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

function popup_show_toggle_tab(callback) {
  ext_api.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    if (tabs.length > 0 && tabs[0].url && tabs[0].url.indexOf("http") !== -1) {
      let currentUrl = tabs[0].url;
      let domain;
      let isExcludedSite = matchUrlDomain(excludedSites, currentUrl);
      if (!isExcludedSite) {
        let isDefaultSiteGrouped = matchUrlDomain(defaultSites_domains, currentUrl);
        let isDefaultSite = matchUrlDomain(defaultSites_domains, currentUrl);
        let isCustomSite = matchUrlDomain(Object.values(customSites_domains), currentUrl);
        domain = isDefaultSiteGrouped || (!isDefaultSite && isCustomSite);
      }
      callback(domain);
    }
  });
};

// remove cookies after page load
ext_api.webRequest.onCompleted.addListener(function (details) {
  var domainVar = matchUrlDomain(remove_cookies, details.url);
  if ((!['main_frame', 'xmlhttprequest', 'other'].includes(details.type)) || !domainVar || !enabledSites.includes(domainVar))
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
      // hold on to consent-cookie
      if (cookie.name.match(/(consent|^optanon)/i)) {
        continue;
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
