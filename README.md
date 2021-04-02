# Bypass Paywalls Clean for Chrome

* [Installation instructions](#installation-instructions)
* [Update](#update)
* [List of supported websites](#list-of-supported-websites)
* [Sites with limited number of free articles](#sites-with-limited-number-of-free-articles)
* [New site requests](#new-site-requests)
* [Add custom site](#add-custom-site)
* [Add excluded site](#add-excluded-site)
* [Troubleshooting](#troubleshooting)
* [Changelog-releases](#changelog-releases)
* [License](#license)

### Installation instructions
Due to [Google internal policy](https://developer.chrome.com/webstore/program_policies), the extension is not available on the Chrome Web Store.  
The following instructions are needed to install third-party extensions in [Chromium](https://en.wikipedia.org/wiki/Chromium_(web_browser))-based desktop browsers.  
In extension developer mode you can always install BPC by `Load unpacked` (no automatic updates) or by crx-file (automatic updates, but possible 'whitelisting' of extension is needed).

#### Load unpacked: Chrome (desktop), Microsoft Edge (Chromium)/Brave/Yandex
* or 'whitelist' extension and install automatically updating crx-file (see next section)

1. Download this repository as a [ZIP-file from GitLab](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/archive/master/bypass-paywalls-chrome-clean-master.zip).
2. Unzip the file and you should have a folder named `bypass-paywalls-chrome-clean-master`.
3. Move the folder to a permanent location on your computer (do not delete the folder after installation).
4. Go to the extensions page (`chrome://extensions` or `edge://extensions`).
5. Enable Developer Mode.
6. Click `Load unpacked` and select the extension folder.

* by default BPC has limited permissions, but you can opt-in to enable custom sites (and also clear cookies/block general paywall-scripts for non-listed sites).   
* in Chrome/Opera/Brave to disable the developer mode extensions popup use the extensions toolbar menu (by default enabled in Chrome 87+ or (if available) enable (experimental) chrome flag: chrome://flags/#extensions-toolbar-menu)

If you're familiar with Git(Hub)-clients you can also clone this repo and update the extension that way (load unpacked folder used by Git(Hub)-client).

#### CRX-file: other Chromium browsers (Opera/Vivaldi)
* or add extension to 'whitelist' for Chrome, MS Edge, Brave or Yandex (see instructions below for Windows)

1. Download the extension as a crx-file from the [releases page](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/releases).
2. In your browser go to the extensions page.
3. Enable Developer Mode.
4. Drag your crx-file anywhere on the page to import it.
5. If dragging crx-file does not work, try Chrome procedure (above).

* by default BPC has limited permissions, but you can opt-in to enable custom sites (and also clear cookies/block general paywall-scripts for non-listed sites).   
* In Windows 'whitelist' BPC (run as administrator one of the reg-files in [whitelist-downloads](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/tree/master/whitelist)  
If you already have 'whitelisted' extensions than you should change "1" to a new key (also change name of HLM-key for beta/developer versions of browsers).  
Example Chrome-regfile:  
Windows Registry Editor Version 5.00  
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallWhitelist]  
"1"="lkbebcjgcmobigpeffafkodonchffocl"

#### Android
1. Install [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser&hl=nl) or [Yandex Browser](https://play.google.com/store/apps/details?id=com.yandex.browser&hl=en) from the Google PlayStore.
2. For Kiwi Browser load the CRX-file in releases (auto-updating, no whitelist needed, opt-in for custom sites not working (use kiwi-custom crx; updates to latest regular version)).
3. For Yandex Browser follow Chrome instructions above (load unpacked; step 6: pick `manifest.json` instead of the folder).

#### Firefox
Visit the [Firefox repository](https://gitlab.com/magnolia1234/bypass-paywalls-firefox-clean) of Bypass Paywall Clean.

#### Notes
* This extension works best alongside the adblocker [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en).
* On Yandex Android use [uBlock Origin development build](https://chrome.google.com/webstore/detail/ublock-origin-dev-build/cgbcahbpdhpcegmbfconppldiemgcoii).
* If you live in the EU, also consider installing the extension [I don't care about cookies](https://chrome.google.com/webstore/detail/i-dont-care-about-cookies/fihnjjcciajhdojfnbdddfaoknhalnja) in order to remove cookie warnings (or add filter [Easylist Cookies](https://easylist-downloads.adblockplus.org/easylist-cookie.txt) | [I don't care about cookies custom filter](https://www.i-dont-care-about-cookies.eu/abp) to uBlock Origin).
* Do not delete extension's folder from your computer/smartphone or Bypass Paywalls Clean (in developer mode) will disappear at restart.
* Every time you open Chrome it may warn you about running extensions in developer mode, just close the popup to keep the extension enabled.
* You will be logged out for most of the sites you have checked.

### Update
For crx-installation: check for updates (in chrome://extensions).\
For zip-installation (load unpacked/developer mode): unzip files to installation folder or use a Git(Hub)-client to clone the extension (locally).

### List of supported websites

_* free articles only._

##### World news
[First Things](https://www.firstthings.com) -
[Foreign Affairs](https://www.foreignaffairs.com) -
[Foreign Policy](https://www.foreignpolicy.com) -
[Harper's Magazine](https://harpers.org) -
[Inkl](https://www.inkl.com) -
[National Review](https://www.nationalreview.com) -
[Newsweek](https://www.newsweek.com) -
[Stratfor](https://stratfor.com) -
[The American Interest](https://www.the-american-interest.com) -
[The Atlantic](https://www.theatlantic.com) -
[The Christian Science Monitor](https://www.csmonitor.com) -
[The Nation](https://www.thenation.com) -
[The New Republic](https://newrepublic.com) -
[The New York Review of Books](https://www.nybooks.com) -
[The New York Times](https://www.nytimes.com) -
[The New Yorker](https://www.newyorker.com) -
[The Spectator USA](https://spectator.us) -
[The Washington Post](https://www.washingtonpost.com) -
[Time Magazine](https://time.com) -
[World Politics Review](https://www.worldpoliticsreview.com)

##### Business
[Adweek](https://www.adweek.com) -
[American Affairs](https://americanaffairsjournal.org) -
[American Banker](https://www.americanbanker.com) -
[Barron's](https://www.barrons.com) -
[Bloomberg](https://www.bloomberg.com) -
[Business Insider](https://www.businessinsider.com) -
[Digiday](https://digiday.com) -
[Entrepreneur](https://www.entrepreneur.com) -
[Fortune](https://fortune.com) -
[Harvard Business Review](https://www.hbr.org) -
[Inc.com](https://www.inc.com) -
[Law.com](https://www.law.com)* -
[MarketWatch](https://www.marketwatch.com) -
[MIT Sloan Management Review](https://sloanreview.mit.edu) -
[Modern Healthcare](https://www.modernhealthcare.com) -
[Quartz](https://qz.com)* -
[Seeking Alpha](https://seekingalpha.com) -
[Stock News](https://stocknews.com) -
[The Business Journals](https://www.bizjournals.com) -
[The Wall Street Journal](https://www.wsj.com)

##### Tech/Science
[Chemical & Engineering News](https://cen.acs.org) -
[Chronicle of Higher Education](https://www.chronicle.com) -
[Dark Reading](https://www.darkreading.com) -
[Discover Magazine](https://www.discovermagazine.com) -
[MIT Technology Review](https://www.technologyreview.com) -
[National Geographic USA](https://www.nationalgeographic.com) -
[Nautilus](https://nautil.us) -
[Scientific American](https://www.scientificamerican.com)* -
[Times Higher Education](https://www.timeshighereducation.com) -
[Towards Data Science](https://www.towardsdatascience.com) -
[VentureBeat](https://venturebeat.com) -
[Wired](https://www.wired.com)

#### Encyclopedia/Book library/Knowledge base
[BBC History Extra](https://www.historyextra.com) -
[Encyclopedia Britannica](https://www.britannica.com) -
[Glassdoor](https://www.glassdoor.com) -
[Loeb Classical Library](https://www.loebclassics.com) -
[Philosophy Now](https://philosophynow.org) -
[Quora](https://www.quora.com) -
[Scribd](http://www.scribd.com) -
[Slader](https://www.slader.com) -
[Statista](https://www.statista.com)

##### Magazines/Blogs
[Apollo Magazine](https://www.apollo-magazine.com) -
[Atavist Magazine](https://magazine.atavist.com) -
[Commentary Magazine](https://www.commentarymagazine.com) -
[Medium](https://www.medium.com/topics) (for custom domains enable custom sites) -
[Rolling Stone](https://www.rollingstone.com) -
[Slate](https://slate.com) -
[SofRep](https://sofrep.com) -
[Sports Illustrated](https://www.si.com) -
[The Art Newspaper](https://www.theartnewspaper.com) -
[The Daily Beast](https://www.thedailybeast.com)* -
[The Point Magazine](https://thepointmag.com) -
[Vanity Fair](https://www.vanityfair.com) -
[Variety](https://variety.com)

##### Local USA news
[Crain's Chicago Business](https://www.chicagobusiness.com) -
[Houston Chronicle](https://www.houstonchronicle.com) -
[Los Angeles Business Journal](https://labusinessjournal.com) -
[Los Angeles Times](https://www.latimes.com) -
[Miami Herald](https://www.miamiherald.com) -
[Mountain View Voice](https://www.mv-voice.com) -
[New York Magazine](https://www.nymag.com) (+ [Curbed](https://www.curbed.com/), [Grub Street](https://www.grubstreet.com), [The Cut](https://www.thecut.com) & [Vulture](https://www.vulture.com)) -
[Newsday](https://www.newsday.com) -
[Orange County Register](https://www.ocregister.com) -
[Palo Alto Online](https://www.paloaltoonline.com) -
[Pittsburgh Post Gazette](https://post-gazette.com) -
[San Diego Union Tribune](https://sandiegouniontribune.com) -
[San Francisco Chronicle](https://www.sfchronicle.com) -
[Star Tribune](https://www.startribune.com) -
[The Boston Globe](https://www.bostonglobe.com) -
[The Dallas Morning News](https://www.dallasnews.com) -
[The Denver Post](https://www.denverpost.com) -
[The Mercury News](https://www.mercurynews.com) -
[The Seattle Times](https://www.seattletimes.com) -
[The Philadelphia Inquirer](https://www.inquirer.com) -
[Winston-Salem Journal](https://www.journalnow.com)\
Grouped in options:\
Gannett Group (local USA Today) sites like (opt-in to custom sites)
[Detroit Free Press](https://www.freep.com) -
[Milwaukee Journal Sentinel](https://www.jsonline.com) -
[The Indianapolis Star](https://www.indystar.com) -
[The Record (North Jersey)](https://www.northjersey.com)\
McClatchy Group sites like (opt-in to custom sites for unlisted)
[Belleville News-Democrat](https://www.bnd.com) -
[Fort Worth Star-Telegram](https://www.star-telegram.com) -
[Lexington Herald-Leader](https://www.kentucky.com) -
[The Charlotte Observer](https://www.charlotteobserver.com) -
[The Fresno Bee](https://www.fresnobee.com) -
[The Kansas City Star](https://www.kansascity.com) -
[The News & Observer](https://www.newsobserver.com) -
[The Sacramento Bee](https://www.sacbee.com) -
[The State](https://www.thestate.com) -
[The Wichita Eagle](https://www.kansas.com) -
[Tri-City Herald](https://www.tri-cityherald.com)\
Tribune Publishing Company sites like
[Baltimore Sun](https://www.baltimoresun.com) -
[Chicago Tribune](https://www.chicagotribune.com) -
[Daily Press](https://www.dailypress.com) -
[Hartford Courant](https://www.courant.com) -
[New York Daily News](https://www.nydailynews.com) -
[Orlando Sentinel](https://www.orlandosentinel.com) -
[SunSentinel](https://www.sun-sentinel.com) -
[The Morning Call](https://www.mcall.com) -
[The Virginian-Pilot](https://www.pilotonline.com)

#### Canada
[Financial Post](https://www.financialpost.com) -
[Le Devoir](https://www.ledevoir.com) -
[National Post](https://www.nationalpost.com) -
[The Globe and Mail](https://www.theglobeandmail.com) -
[The Hill Times](https://www.hilltimes.com) -
[The Logic](https://thelogic.co)\
[The Toronto Star](https://www.thestar.com) and regional TorStar sites (grouped in options) like
[Niagara Falls Review](https://www.niagarafallsreview.ca) -
[Peterborough Examiner](https://www.thepeterboroughexaminer.com) -
[St. Catharines Standard](https://www.stcatharinesstandard.ca) -
[The Hamilton Spectator](https://www.thespec.com) -
[Waterloo Region Record](https://www.therecord.com) -
[Welland Tribune](https://www.wellandtribune.ca)

#### Europe

[EUobserver](https://euobserver.com)

##### United Kingdom/Ireland
[Belfast Telegraph](https://www.belfasttelegraph.co.uk) -
[Financial News](https://www.fnlondon.com) -
[Financial Times](https://www.ft.com) -
[Irish Independent](https://www.independent.ie) -
[London Review of Books](https://www.lrb.co.uk) -
[New Left Review](https://newleftreview.org) -
[Prospect Magazine](https://www.prospectmagazine.co.uk) -
[The Economist](https://www.economist.com) -
[The Irish Times](https://www.irishtimes.com) -
[The New Statesman](https://www.newstatesman.com) -
[The Spectator](https://www.spectator.co.uk) -
[The Telegraph](https://www.telegraph.co.uk) -
[The Times](https://www.thetimes.co.uk) -
[The Times Literary Supplement](https://www.the-tls.co.uk)

##### Denmark

[Berlingske](https://www.berlingske.dk)

##### Finland
[Helsingin Sanomat](https://www.hs.fi)\
Alma Talent sites (grouped in options) like
[Arvopaperi](https://www.arvopaperi.fi) -
[Kauppalehti](https://www.kauppalehti.fi) -
[Markkinointi & Mainonta](https://www.marmai.fi) -
[Mediuutiset](https://www.mediuutiset.fi) -
[Mikrobitti](https://www.mikrobitti.fi) -
[Talouselämä](https://www.talouselama.fi) -
[Tekniikka & Talous](https://www.tekniikkatalous.fi) -
[Tivi](https://www.tivi.fi) -
[Uusi Suomi](https://www.uusisuomi.fi)

##### France/Wallonia
[Alternatives Economiques](https://www.alternatives-economiques.fr) -
[Atlantico](https://atlantico.fr) -
[Challenges](https://www.challenges.fr) -
[Charlie Hebdo](https://charliehebdo.fr) -
[Esprit](https://esprit.presse.fr) -
[L'Obs](https://www.nouvelobs.com) -
[L'Opinion](https://www.lopinion.fr) -
[L'Usine Nouvelle](https://www.usinenouvelle.com) -
[La Croix](https://www.la-croix.com) -
[La Tribune](https://www.latribune.fr) -
[Le Journal du Dimanche](https://lejdd.fr) -
[Le Journal du Net](https://www.journaldunet.com) -
[Le Parisien](https://www.leparisien.fr) -
[Le Un](https://le1hebdo.fr) -
[Les Échos](https://www.lesechos.fr) -
[Libération](https://www.liberation.fr)* -
[Paris Match](https://www.parismatch.com) -
[Science & Vie](https://www.science-et-vie.com) -
[Sciences et Avenir](https://www.sciencesetavenir.fr) -
[Sud Ouest](https://www.sudouest.fr) -
[Valeurs Actuelles](https://www.valeursactuelles.com)\
Grouped in options:\
Groupe EBRA sites like
[Dernières Nouvelles d'Alsace](https://www.dna.fr) -
[L'Alsace](https://www.lalsace.fr) -
[L'Est Républicain](https://www.estrepublicain.fr) -
[Le Bien Public](https://www.bienpublic.com) -
[Le Dauphiné Libéré](https://www.ledauphine.com) -
[Le Journal de Saône-et-Loire](https://www.lejsl.com) -
[Le Progrès](https://www.leprogres.fr) -
[Le Républicain Lorrain](https://www.republicain-lorrain.fr) -
[Vosges Matin](https://www.vosgesmatin.fr)\
Groupe La Dépêche sites like
[Centre Presse](https://www.centrepresseaveyron.fr) -
[L'Indépendant](https://www.lindependant.fr) -
[La Dépêche du Midi](https://www.ladepeche.fr) -
[La Nouvelle République des Pyrénées](https://www.nrpyrenees.fr) -
[Le Petit Bleu d'Agen](https://www.petitbleu.fr) -
[Midi Libre](https://www.midilibre.fr) -
[Midi Olympique](https://www.midi-olympique.fr)  
Groupe Rossel sites (grouped in options) like
[L'Aisne nouvelle](https://www.aisnenouvelle.fr) -
[L'Ardennais](https://www.lardennais.fr) -
[L'Est-Éclair](https://www.lest-eclair.fr) -
[L'Union](https://www.lunion.fr) -
[L'Écho](https://lecho.be) -
[La Voix du Nord](https://www.lavoixdunord.fr) -
[Le Courrier picard](https://www.courrier-picard.fr) -
[Le Soir](https://www.lesoir.be) -
[Libération Champagne](https://www.liberation-champagne.fr) -
[Nord Éclair](https://www.nordeclair.fr) -
[Paris Normandie](https://www.paris-normandie.fr) -
[SudInfo](https://www.sudinfo.be)

##### Germany/Austria
[Augsburger Allgemeine](https://www.augsburger-allgemeine.de) -
[Berliner Zeitung](https://www.berliner-zeitung.de) -
[Cicero](https://www.cicero.de) -
[Deutsche Wirtschafts Nachrichten](https://deutsche-wirtschafts-nachrichten.de) -
[Die Rheinpfalz](https://www.rheinpfalz.de) -
[Die Zeit](https://www.zeit.de) -
[Frankfurter Allgemeine Zeitung](https://www.faz.net) -
[Freie Presse](https://www.freiepresse.de) -
[Handelsblatt](https://www.handelsblatt.com) -
[Krautreporter.de](https://krautreporter.de) -
[Kurier.at](https://kurier.at) -
[Mitteldeutsche Zeitung](https://www.mz-web.de) -
[Neue Osnabrücker Zeitung](https://www.noz.de]) -
[Nordwest Zeitung](https://www.nwzonline.de) -
[Piqd.de](https://www.piqd.de) -
[Rhein-Zeitung](https://www.rhein-zeitung.de) -
[Ruhr Nachrichten](https://www.ruhrnachrichten.de) -
[Sächsische Zeitung](https://www.saechsische.de) -
[Schleswig-Holsteinischer Zeitungsverlag](https://www.shz.de) -
[Schweriner Volkszeitung](https://www.svz.de) -
[Süddeutsche Zeitung](https://www.sueddeutsche.de) -
[WirtschaftsWoche](https://www.wiwo.de)\
Grouped in options:\
Funke Mediengruppe sites like
[Berliner Morgenpost](https://www.morgenpost.de) -
[Braunschweiger Zeitung](https://www.braunschweiger-zeitung.de) -
[Hamburger Abendblatt](https://www.abendblatt.de) -
[Neue Ruhr Zeitung](https://www.nrz.de) -
[Ostthüringer Zeitung](https://www.otz.de) -
[Thüringer Allgemeine](https://www.thueringer-allgemeine.de) -
[Thüringische Landeszeitung](https://www.tlz.de) -
[Westdeutsche Allgemeine Zeitung](https://www.waz.de) -
[Westfalenpost](https://www.wp.de) -
[Westfälische Rundschau](https://www.wr.de)\
Madsack Mediengruppe sites like
[Hannoversche Allgemeine Zeitung](https://www.haz.de) -
[Kieler Nachrichten](https://www.kn-online.de) -
[Leipziger Volkszeitung](https://www.lvz.de) -
[Lübecker Nachrichten](https://www.ln-online.de) -
[Märkische Allgemeine](https://www.maz-online.de) -
[Neue Presse (Hannover)](https://www.neuepresse.de) -
[Ostsee-Zeitung](https://www.ostsee-zeitung.de)\
Rheinische Post Mediengruppe like
[Aachener Nachrichten](https://www.aachener-nachrichten.de) -
[Aachener Zeitung](https://www.aachener-zeitung.de) -
[General-Anzeiger Bonn](https://ga.de) -
[Rheinische Post](https://rp-online.de) -
[Saarbrücker Zeitung](http://www.saarbruecker-zeitung.de) -
[Trierischer Volksfreund](http://www.volksfreund.de)

##### Italy
[Corriere Della Sera](https://www.corriere.it) -
[Domani](https://editorialedomani.it) -
[GElocal.it](https://quotidiani.gelocal.it) -
[Il Fatto Quotidiano](https://www.ilfattoquotidiano.it) -
[Il Manifesto](https://ilmanifesto.it) -
[Il Resto del Carlino](https://www.ilrestodelcarlino.it) -
[Il Secolo XIX](https://www.ilsecoloxix.it) -
[La Nuova Sardegna](https://www.lanuovasardegna.it) -
[La Repubblica](https://www.repubblica.it) -
[La Stampa](https://www.lastampa.it) -
[Le Scienze](https://www.lescienze.it) -
[LimesOnline (it/en)](https://www.limesonline.com) -
[Quotidiano.net](https://www.quotidiano.net)\
Grouped in options:\
[Il Messaggero](https://www.ilmessaggero.it) and regional sites like
[Corriere Adriatico](https://www.corriereadriatico.it) -
[Il Gazzettino](https://www.ilgazzettino.it) -
[Il Mattino](https://www.ilmattino.it) -
[Quotidiano di Puglia](https://www.quotidianodipuglia.it)

##### Netherlands/Flanders
[Algemeen Dagblad](https://www.ad.nl) and regional ADR sites (grouped in options) like
[BN DeStem](https://www.bndestem.nl) -
[Brabants Dagblad](https://www.bd.nl) -
[Eindhovens Dagblad](https://www.ed.nl) -
[Gelderlander](https://www.gelderlander.nl) -
[PZC](https://www.pzc.nl) -
[Stentor](https://www.destentor.nl) -
[Tubantia](https://tubantia.nl)  
[Dagblad van het Noorden](https://www.dvhn.nl) -
[De Morgen](https://www.demorgen.be) -
[De Tijd](https://www.tijd.be) -
[Financieele Dagblad](https://fd.nl) -
[Follow the Money](https://www.ftm.nl) -
[Gazet van Antwerpen](https://www.gva.be) -
[Groene Amsterdammer](https://www.groene.nl) -
[Humo.be](https://www.humo.be) -
[Knack.be](https://www.knack.be) -
[Leeuwarder Courant](https://www.lc.nl) -
[Noordhollands Dagblad](https://www.noordhollandsdagblad.nl) -
[NRC Handelsblad](https://www.nrc.nl) -
[Parool](https://www.parool.nl) -
[Telegraaf](https://www.telegraaf.nl) -
[Trouw](https://www.trouw.nl) -
[Volkskrant](https://www.volkskrant.nl)

##### Portugal
[Correio da Manhã](https://www.cmjornal.pt) -
[Observador](https://observador.pt)

##### Russia
[Republic.ru](https://republic.ru)

##### Slovenia
[Finance.si](https://www.finance.si)

##### Spain
[ABC](https://www.abc.es) -
[Diario de Ibiza](https://www.diariodeibiza.es) -
[Diario de Mallorca](https://www.diariodemallorca.es) -
[El Confidencial](https://www.elconfidencial.com) -
[El Diario.es](https://www.eldiario.es) -
[El Español](https://www.elespanol.com) -
[El Mundo](https://www.elmundo.es) -
[El País](https://elpais.com) -
[El Periódico de Catalunya](https://www.elperiodico.com) -
[Expansión](https://www.expansion.com) -
[Faro de Vigo](https://www.farodevigo.es) -
[La Nueva España](https://www.lne.es) -
[La Provincia](https://www.laprovincia.es) -
[La Vanguardia](https://www.lavanguardia.com) -
[Política Exterior](https://www.politicaexterior.com)\
Grouped in options:\
Grupo Vocento (ABC) regional sites like
[Diario Vasco](https://www.diariovasco.com) -
[El Comercio](https://www.elcomercio.es) -
[El Correo](https://www.elcorreo.com) -
[El Diario Montañés](https://www.eldiariomontanes.es) -
[El Norte de Castilla](https://www.elnortedecastilla.es) -
[Hoy](https://www.hoy.es) -
[Ideal](https://www.ideal.es) -
[La Rioja](https://www.larioja.com) -
[La Verdad](https://www.laverdad.es) -
[La Voz de Cádiz](https://www.lavozdigital.es) -
[Sur](https://www.diariosur.es)

##### Sweden
[Dagens Nyheter](https://www.dn.se)

##### Switzerland
[Neue Zürcher Zeitung](https://www.nzz.ch)

#### Africa

###### Kenya

[Daily Nation](https://nation.africa)

#### Australia/New Zealand

[Brisbane Times](https://www.brisbanetimes.com.au) -
[Griffith Review](https://www.griffithreview.com) -
[New Zealand Herald](https://www.nzherald.co.nz) -
[The Age](https://www.theage.com.au) -
[The Australian Financial Review](https://www.afr.com) -
[The Saturday Paper](https://www.thesaturdaypaper.com.au) -
[The Spectator Australia](https://www.spectator.com.au) -
[The Sydney Morning Herald](https://www.smh.com.au) -
[The West Australian (+ regional)](https://thewest.com.au) -
[WAtoday](https://www.watoday.com.au)

##### > News Corp Australia (grouped in options)
[Cairns Post](https://www.cairnspost.com.au) -
[Geelong Advertiser](https://www.geelongadvertiser.com.au) -
[Gold Coast Bulletin](https://www.goldcoastbulletin.com.au) -
[Herald Sun](https://www.heraldsun.com.au) -
[Northern Territory News](https://www.ntnews.com.au) -
[The Advertiser/AdelaideNow](https://www.adelaidenow.com.au) -
[The Australian](https://www.theaustralian.com.au) -
[The Courier-Mail](https://www.couriermail.com.au) -
[The Daily Telegraph](https://www.dailytelegraph.com.au) -
[The Mercury Tasmania](https://www.themercury.com.au) -
[The Weekly Times](https://www.weeklytimesnow.com.au) -
[Townsville Bulletin](https://www.townsvillebulletin.com.au)

##### > Financial

[Eureka Report](https://www.eurekareport.com.au) -
[Intelligent Investor](https://www.intelligentinvestor.com.au)

##### > Australian Community Media (daily, grouped in options)
[Bendigo Advertiser](https://www.bendigoadvertiser.com.au) -
[Central Western Daily](https://www.centralwesterndaily.com.au) -
[Daily Liberal](https://www.dailyliberal.com.au) -
[Illawarra Mercury](https://www.illawarramercury.com.au) -
[Newcastle Herald](https://www.newcastleherald.com.au) -
[The Advocate](https://www.theadvocate.com.au) -
[The Border Mail](https://www.bordermail.com.au) -
[The Canberra Times](https://www.canberratimes.com.au) -
[The Courier](https://www.thecourier.com.au) -
[The Daily Advertiser](https://www.dailyadvertiser.com.au) -
[The Examiner](https://www.examiner.com.au) -
[The Northern Daily Leader](https://www.northerndailyleader.com.au) -
[The Port Macquarie News](https://www.portnews.com.au) -
[The Standard](https://www.standard.net.au) -
[Western Advocate](https://www.westernadvocate.com.au)
* add to custom sites for unlisted & block general paywall-script Piano

##### > Australian Provincial Newspapers (all, grouped in options)
[Bundaberg News Mail](https://www.news-mail.com.au) -
[Fraser Coast Chronicle](https://www.frasercoastchronicle.com.au) -
[Gladstone Observer](https://www.gladstoneobserver.com.au) -
[Grafton Daily Examiner](https://www.dailyexaminer.com.au) -
[Mackay Daily Mercury](https://www.dailymercury.com.au) -
[Rockhampton Morning Bulletin](https://www.themorningbulletin.com.au) -
[Sunshine Coast Daily](https://www.sunshinecoastdaily.com.au) -
[The Gympie Times](https://www.gympietimes.com.au) -
[The Northern Star](https://www.northernstar.com.au) -
[The Queensland Times](https://www.qt.com.au) -
[Toowoomba Chronicle](https://www.thechronicle.com.au) -
[Warwick Daily News](https://www.warwickdailynews.com.au)
* opt-in to custom sites for unlisted

#### East Asia
[Caixin Global](https://www.caixinglobal.com) -
[CommonWealth Magazine Taiwan](https://www.cw.com.tw) -
[Harvard Business Review Taiwan](https://www.hbrtaiwan.com) -
[Nikkei Asian Review](https://asia.nikkei.com) -
[NK News](https://www.nknews.org)* -
[South China Morning Post](https://www.scmp.com) -
[Tech in Asia](https://www.techinasia.com) -
[The Diplomat](https://www.thediplomat.com) -
[The Japan Times](https://www.japantimes.co.jp)

#### India
[Bloomberg Quint](https://www.bloombergquint.com)* -
[Business Standard](https://www.business-standard.com) -
[LiveMint](https://www.livemint.com) -
[The Hindu](https://www.thehindu.com) -
[The Hindu BusinessLine](https://www.thehindubusinessline.com)

#### Israel
[Globes](https://www.globes.co.il) -
[Haaretz.co.il](https://www.haaretz.co.il) -
[Haaretz.com](https://www.haaretz.com) -
[The Jerusalem Post](https://www.jpost.com) -
[The Marker](https://www.themarker.com)

#### Lebanon
[L'Orient-Le Jour](https://www.lorientlejour.com)

#### Latin America

##### Argentina
[Ámbito](https://www.ambito.com) -
[Clarín](https://www.clarin.com) -
[La Nación](https://www.lanacion.com.ar)
##### Brazil
[Exame](https://exame.abril.com.br) -
[Folha de S. Paulo](https://www.folha.uol.com.br) -
[O Estado de S. Paulo](https://estadao.com.br) -
[O Globo](https://oglobo.globo.com) -
[Valor Econômico](https://valor.globo.com)*
##### Chile
[Diario Financiero](https://www.df.cl) -
[El Mercurio](https://digital.elmercurio.com) -
[El Mercurio de Valparaíso](https://www.mercuriovalpo.cl) -
[La Estrella de Valparaíso](https://www.estrellavalpo.cl) -
[La Segunda](https://digital.lasegunda.com) -
[La Tercera](https://www.latercera.com)
##### Mexico
[Mexico News Daily](https://mexiconewsdaily.com)
##### Peru
[El Comercio](https://elcomercio.pe) -
[Gestión](https://gestion.pe)

_* free articles only._

### Sites with limited number of free articles
The free article limit can normally be bypassed by removing cookies for the site.  
Click on the BPC-icon and then 'clear cookies'-button in the popup.  
For user with the limited permissions BPC-version this will only work for supported sites; for other sites use:
1. Install the extension [Cookie Remover](https://chrome.google.com/webstore/detail/cookie-remover/kcgpggonjhmeaejebeoeomdlohicfhce) or [Disable Cookies](https://chrome.google.com/webstore/detail/disable-cookies/lkmjmficaoifggpfapbffkggecbleang?hl=en).
2. When coming across a paywall, click the cookie icon in your extension toolbar then refresh the page.

If removing the cookies works you can also add the site as a custom site.

### New site requests
You can submit a request for a new website [here](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/issues).  
Please read the following instructions and share your results for a quicker process.  
Remember to check the [previous requests](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/issues) before asking for a new website.
1. Visit an article on the site you want to bypass the paywall for and copy the article title.
2. Open up a new incognito window (Ctrl+Shift+N) and paste the article title into Google.
3. Click on the same article from the Google search results page. Or you can:
4. Disable javascript on the website by clicking the button right icon </> on the uBlock Origin panel.
5. Refresh the page.

### Add custom site
Add your own custom site (also for testing).  
Check 'Options'-link in popup-menu and go to custom sites.  
\* by default BPC has limited permissions, but you can opt-in to enable custom sites (and also clear cookies/block general paywall-scripts for non-listed sites).\
Make sure the (new) site is checked under Options (or check on/off-button).  
By default sites' cookies/local storage are removed after page loads (to bypass article limit).  
Also you can enable Googlebot user-agent, disable Javascript for (sub)domain(s)/external sources and/or set the referer (to Facebook, Google or Twitter; ignored when Googlebot is set).

### Add excluded site
Add excluded sites/domains (for your subscriptions).\
You can also exclude a specific domain which is grouped in options.

### Troubleshooting
* This extension works best alongside [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm).
* Add usefull custom filter [Fanboy's Enhanced Tracking List](https://www.fanboy.co.nz/enhancedstats.txt)
* If a site doesn't work, try turning off uBlock and refreshing.
* Make sure the (new) site is checked under Options.
* Make sure you're running the last version of Bypass Paywalls Clean.
* If none of these work, you can submit an issue [here](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/issues).

### Changelog-releases
* Visit the [changelog page](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/blob/master/changelog.txt).
* Or check the [commits](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/commits/master/).
* [Download the latest version](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/releases)

### License
* Bypass Paywalls Clean is [MIT-licensed](https://gitlab.com/magnolia1234/bypass-paywalls-chrome-clean/-/blob/master/LICENSE).
