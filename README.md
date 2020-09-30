# Bypass Paywalls Clean for Chrome

* [Installation instructions](#installation-instructions)
* [List of supported websites](#list-of-supported-websites)
* [Sites with limited number of free articles](#sites-with-limited-number-of-free-articles)
* [New site requests](#new-site-requests)
* [Add custom site](#add-custom-site)
* [Troubleshooting](#troubleshooting)
* [Changelog-releases](#changelog-releases)
* [License](#license)

### Installation instructions
Due to [Google internal policy](https://developer.chrome.com/webstore/program_policies), the extension is not available on the Chrome Web Store.  
The following instructions are needed to install third-party extensions in [Chromium](https://en.wikipedia.org/wiki/Chromium_(web_browser))-based browsers:
#### Chrome (Windows, MacOS, Linux), Microsoft Edge (Chromium)/Brave/Yandex (or 'whitelist' extension and install automatically updating crx-file; see below)
1. Download this repository as a [ZIP file from BitBucket](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/get/master.zip).
2. Unzip the file and you should have a folder named `magnolia1234-bypass-paywalls-chrome-clean-master`.
3. Move the folder to a permanent location on your computer (do not delete the folder after installation).  
* replace manifest.json with the one in lp-folder if you want to use the limited permissions version (custom sites will not be working though).
4. Go to the extensions page (`chrome://extensions` or `edge://extensions`).
5. Enable Developer Mode.
6. Click `Load unpacked` and select the extension folder.  
* in Chrome/Opera/Brave disable the developer mode extensions popup by enabling the extensions toolbar menu under (experimental) chrome flags: chrome://flags/#extensions-toolbar-menu  
  
If you're familiar with Git(Hub)-clients you can also clone this repo and update the extension that way (load unpacked folder used by Git(Hub)-client).

#### Other Chromium browsers (Opera/Vivaldi) or add extension to 'whitelist' for Chrome, MS Edge, Brave or Yandex (see instructions below for Windows)
1. Download the extension as a .crx file from the [download page](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/downloads).
2. In your browser go to the extensions page.
3. Enable Developer Mode.
4. Drag your .crx file anywhere on the page to import it.
5. If dragging crx does not work, try Chrome procedure (above).  
* In Windows 'whitelist' BPC (run as administrator one of the files in [whitelist-downloads](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean-whitelist/downloads)  
If you already have 'whitelisted' extensions than you should change "1" to a new key (and change name in HLM-key for beta/developer versions of browsers).  
Example Chrome-regfile:  
Windows Registry Editor Version 5.00  
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Google\Chrome\ExtensionInstallWhitelist]  
"1"="lkbebcjgcmobigpeffafkodonchffocl" 

#### Android
1. Install [Kiwi Browser](https://play.google.com/store/apps/details?id=com.kiwibrowser.browser&hl=nl) or [Yandex Browser](https://play.google.com/store/apps/details?id=com.yandex.browser&hl=en) from the Google PlayStore.
2. Follow Chrome instructions located just above (step 6: pick `manifest.json` instead of the folder).

#### Firefox
Visit the [Firefox repository](https://bitbucket.org/magnolia1234/bypass-paywalls-firefox-clean) of Bypass Paywall Clean.

#### Notes
* This extension works best alongside the adblocker [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en).
* On Yandex Android use [uBlock Origin development build](https://chrome.google.com/webstore/detail/ublock-origin-dev-build/cgbcahbpdhpcegmbfconppldiemgcoii).
* If you live in the EU, also consider installing the extension [I don't care about cookies](https://chrome.google.com/webstore/detail/i-dont-care-about-cookies/fihnjjcciajhdojfnbdddfaoknhalnja) in order to remove cookie warnings (or use filter Easylist Cookies/[I don't care about cookies custom filter](https://www.i-dont-care-about-cookies.eu/abp) in uBlock Origin).
* Do not delete extension's folder from your computer/smartphone or Bypass Paywalls Clean (in developer mode) will disappear at restart.
* Every time you open Chrome it may warn you about running extensions in developer mode, just close the popup to keep the extension enabled.
* You will be logged out for most of the sites you have checked.

### List of supported websites

##### World news
[First Things](https://www.firstthings.com) -
[Foreign Policy](https://www.foreignpolicy.com) -
[Harper's Magazine](https://harpers.org) -
[Inkl](https://www.inkl.com) -
[National Review](https://www.nationalreview.com) -
[Newsweek](https://www.newsweek.com) -
[The American Interest](https://www.the-american-interest.com) -
[The Atlantic](https://www.theatlantic.com) -
[The Christian Science Monitor](https://www.csmonitor.com) -
[The Nation](https://www.thenation.com) -
[The New Republic](https://newrepublic.com) -
[The New York Times](https://www.nytimes.com) -
[The New Yorker](https://www.newyorker.com) -
[The Washington Post](https://www.washingtonpost.com) -
[World Politics Review](https://www.worldpoliticsreview.com)

##### Business
[Adweek](https://www.adweek.com) -
[American Affairs](https://americanaffairsjournal.org) -
[American Banker](https://www.americanbanker.com) -
[Barron's](https://www.barrons.com) -
[Bloomberg](https://www.bloomberg.com) -
[Business Insider](https://www.businessinsider.com) -
[Digiday](https://digiday.com) –
[Fortune](https://fortune.com) -
[Harvard Business Review](https://www.hbr.org) -
[Inc.com](https://www.inc.com) -
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
[Atavist Magazine](https://magazine.atavist.com) -
[Commentary Magazine](https://www.commentarymagazine.com) -
[Medium](https://www.medium.com) (all sites) -
[Rolling Stone](https://www.rollingstone.com) -
[SofRep](https://sofrep.com) -
[The Daily Beast](https://www.thedailybeast.com)* -
[Vanity Fair](https://www.vanityfair.com) -
[Variety](https://variety.com)

##### Local USA news
[Baltimore Sun](https://www.baltimoresun.com) -
[Crain's Chicago Business](https://www.chicagobusiness.com) -
[Chicago Tribune](https://www.chicagotribune.com) -
[Daily Press](https://www.dailypress.com) -
[Hartford Courant](https://www.courant.com) -
[Los Angeles Business Journal](https://labusinessjournal.com) -
[Los Angeles Times](https://www.latimes.com) -
[Miami Herald](https://www.miamiherald.com) -
[Mountain View Voice](https://www.mv-voice.com) -
[New York Magazine](https://www.nymag.com) -
[Orange County Register](https://www.ocregister.com) -
[Orlando Sentinel](https://www.orlandosentinel.com) -
[Palo Alto Online](https://www.paloaltoonline.com) -
[Pittsburgh Post Gazette](https://post-gazette.com) -
[San Diego Union Tribune](https://sandiegouniontribune.com) -
[San Francisco Chronicle](https://www.sfchronicle.com) -
[Star Tribune](https://www.startribune.com) -
[SunSentinel](https://www.sun-sentinel.com) -
[The Boston Globe](https://www.bostonglobe.com) -
[The Denver Post](https://www.denverpost.com) -
[The Fresno Bee](https://www.fresnobee.com) -
[The Mercury News](https://www.mercurynews.com) -
[The Morning Call](https://www.mcall.com) -
[The Seattle Times](https://www.seattletimes.com) -
[The News-Gazette](https://www.news-gazette.com) -
[The Philadelphia Inquirer](https://www.inquirer.com) -
[The Sacramento Bee](https://www.sacbee.com) -
[Winston-Salem Journal](https://www.journalnow.com)

#### Australia/New Zealand

[Brisbane Times](https://www.brisbanetimes.com.au) -
[New Zealand Herald](https://www.nzherald.co.nz) -
[The Age](https://www.theage.com.au) -
[The Australian Financial Review](https://www.afr.com) -
[The Saturday Paper](https://www.thesaturdaypaper.com.au) -
[The Spectator Australia](https://www.spectator.com.au) -
[The Sydney Morning Herald](https://www.smh.com.au) –
[WAtoday](https://www.watoday.com.au)

##### > News Corp Australia
[Cairns Post](https://www.cairnspost.com.au) –
[Geelong Advertiser](https://www.geelongadvertiser.com.au) -
[Gold Coast Bulletin](https://www.goldcoastbulletin.com.au) –
[Herald Sun](https://www.heraldsun.com.au) –
[Northern Territory News](https://www.ntnews.com.au) –
[The Advertiser/AdelaideNow](https://www.adelaidenow.com.au) –
[The Australian](https://www.theaustralian.com.au) -
[The Courier-Mail](https://www.couriermail.com.au) –
[The Daily Telegraph](https://www.dailytelegraph.com.au) –
[The Mercury Tasmania](https://www.themercury.com.au) -
[The Weekly Times](https://www.weeklytimesnow.com.au) –
[Townsville Bulletin](https://www.townsvillebulletin.com.au)

##### > Financial

[Eureka Report](https://www.eurekareport.com.au) -
[Intelligent Investor](https://www.intelligentinvestor.com.au)

##### > Australian Community Media
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

#### > Australian Provincial Newspapers
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

#### Canada
[Le Devoir](https://www.ledevoir.com) -
[National Post](https://www.nationalpost.com) -
[The Globe and Mail](https://www.theglobeandmail.com) -
[The Toronto Star](https://www.thestar.com)

#### Europe
##### United Kingdom/Ireland
[Belfast Telegraph](https://www.belfasttelegraph.co.uk) -
[Financial News](https://www.fnlondon.com) -
[Financial Times](https://www.ft.com) -
[Irish Independent](https://www.independent.ie) -
[London Review of Books](https://www.lrb.co.uk) -
[The Economist](https://www.economist.com) -
[The Irish Times](https://www.irishtimes.com) -
[The New Statesman](https://www.newstatesman.com) -
[The Spectator](https://www.spectator.co.uk) -
[The Telegraph](https://www.telegraph.co.uk) -
[The Times](https://www.thetimes.co.uk) -
[The Times Literary Supplement](https://www.the-tls.co.uk)
##### France/Wallonia
[Challenges](https://www.challenges.fr) –
[Charlie Hebdo](https://charliehebdo.fr) -
[L'Écho](https://lecho.be) -
[L'Opinion](https://www.lopinion.fr) –
[La Dépêche](https://www.ladepeche.fr) –
[Le Journal du Dimanche](https://lejdd.fr) –
[Le Journal du Net](https://www.journaldunet.com) -
[Le Parisien](https://www.leparisien.fr) -
[Le Soir](https://plus.lesoir.be) -
[Les Échos](https://www.lesechos.fr) -
[Libération](https://www.liberation.fr)* –
[Science & Vie](https://www.science-et-vie.com) -
[Sciences et Avenir](https://www.sciencesetavenir.fr) -
[Valeurs Actuelles](https://www.valeursactuelles.com)
##### Germany/Austria
[Die Zeit](https://www.zeit.de) -
[Frankfurter Allgemeine Zeitung](https://www.faz.net) -
[Handelsblatt](https://www.handelsblatt.com) -
[Süddeutsche Zeitung](https://www.sueddeutsche.de) -
[Westdeutsche Allgemeine Zeitung](https://www.waz.de)
##### Italy
[Corriere Della Sera](https://www.corriere.it) -
[Domani](https://editorialedomani.it) -
[Il Fatto Quotidiano](https://www.ilfattoquotidiano.it) -
[Il Manifesto](https://ilmanifesto.it) -
[Il Messaggero](https://www.ilmessaggero.it) -
[La Repubblica](https://www.repubblica.it) -
[La Stampa](https://www.lastampa.it) -
[Le Scienze](https://www.lescienze.it) -
[LimesOnline (it/en)](https://www.limesonline.com)
##### Netherlands/Flanders
[Algemeen Dagblad](https://www.ad.nl) and regional ADR sites like
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
##### Russia
[Republic.ru](https://republic.ru)
##### Spain
[ABC](https://www.abc.es) -
[El Mundo](https://www.elmundo.es) -
[El País](https://elpais.com)
##### Sweden
[Aftonbladet](https://www.aftonbladet.se) -
[Dagens Nyheter](https://www.dn.se)
##### Switzerland
[Neue Zürcher Zeitung](https://www.nzz.ch)

#### East Asia
[Caixin Global](https://www.caixinglobal.com) -
[CommonWealth Magazine Taiwan](https://www.cw.com.tw) -
[Harvard Business Review Taiwan](https://www.hbrtaiwan.com) -
[Nikkei Asian Review](https://asia.nikkei.com) -
[NK News](https://www.nknews.org)* -
[South China Morning Post](https://www.scmp.com) -
[Tech in Asia](https://www.techinasia.com) -
[The Business Times](https://www.businesstimes.com.sg) -
[The Diplomat](https://www.thediplomat.com) -
[The Japan Times](https://www.japantimes.co.jp)

#### India
[Bloomberg Quint](https://www.bloombergquint.com)* -
[Business Standard](https://www.business-standard.com) -
[LiveMint](https://www.livemint.com) -
[The Hindu](https://www.thehindu.com)

#### Israel
[Globes](https://www.globes.co.il) -
[Haaretz.co.il](https://www.haaretz.co.il) -
[Haaretz.com](https://www.haaretz.com) -
[The Marker](https://www.themarker.com)

#### Latin America
##### Argentina
[Clarín](https://www.clarin.com) -
[La Nación](https://www.lanacion.com.ar)
##### Brazil
[Exame](https://exame.abril.com.br) –
[Folha de S. Paulo](https://www.folha.uol.com.br) -
[O Estado de S. Paulo](https://estadao.com.br) –
[O Globo](https://oglobo.globo.com) –
[Valor Econômico](https://valor.globo.com)*
##### Chile
[Diario Financiero](https://www.df.cl) -
[El Mercurio](https://digital.elmercurio.com) -
[El Mercurio de Valparaíso](https://www.mercuriovalpo.cl) -
[La Segunda](https://digital.lasegunda.com) -
[La Tercera](https://www.latercera.com)
##### Mexico
[Mexico News Daily](https://mexiconewsdaily.com)
##### Peru
[El Comercio](https://elcomercio.pe) -
[Gestión](https://gestion.pe)

_*free articles only._

### Sites with limited number of free articles
The free article limit can normally be bypassed by removing cookies for the site.*  
1. Install the extension [Cookie Remover](https://chrome.google.com/webstore/detail/cookie-remover/kcgpggonjhmeaejebeoeomdlohicfhce) or [Disable Cookies](https://chrome.google.com/webstore/detail/disable-cookies/lkmjmficaoifggpfapbffkggecbleang?hl=en).  
2. When coming across a paywall, click the cookie icon in your extension toolbar then refresh the page.

If removing the cookies works you can also add the site as a custom site.

_*may not always succeed._

### New site requests
You can submit a request for a new website [here](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/issues?status=new&status=open).  
Please read the following instructions and share your results for a quicker process.  
Remember to check the [previous requests](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/issues) before asking for a new website.  
1. Visit an article on the site you want to bypass the paywall for and copy the article title.  
2. Open up a new incognito window (Ctrl+Shift+N) and paste the article title into Google.  
3. Click on the same article from the Google search results page. Or you can:  
4. Disable javascript on the website by clicking the button right icon </> on the uBlock Origin panel.  
5. Refresh the page.

### Add custom site
Add your own custom site (also for testing).  
Check 'Options'-link in popup-menu and go to custom sites.  
By default sites' cookies/local storage are removed after page loads (to bypass article limit).  
Also you can enable Googlebot user-agent or disable Javascript for (sub)domain(s)/external sources.

### Troubleshooting
* This extension works best alongside [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm).
* Make sure the (new) site is checked under Options.
* Make sure you're running the last version of Bypass Paywalls Clean.
* If none of these work, you can submit an issue [here](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/issues).

### Changelog-releases
* Visit the [changelog page](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/src/master/changelog.txt).
* Or check the [commits](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/commits).
* [Download the latest version](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/downloads)

### License
* Bypass Paywalls Clean is [MIT-licensed](https://bitbucket.org/magnolia1234/bypass-paywalls-chrome-clean/src/master/LICENSE).
