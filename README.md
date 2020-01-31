# Bypass Paywalls Clean for Chrome

* [Installation instructions](#installation-instructions)
* [List of supported websites](#list-of-supported-websites)
* [Sites with limited number of free articles](#sites-with-limited-number-of-free-articles)
* [New site requests](#new-site-requests)
* [Troubleshooting](#troubleshooting)
* [Changelog](#changelog)
* [Pull Requests](#pull-requests)
* [Show your support](#show-your-support)
* [License](#license)

### Installation instructions
Due to [Google internal policy](https://developer.chrome.com/webstore/program_policies), the extension is not available on the Chrome Web Store. The following instructions are needed to install third-party extensions in [Chromium](https://en.wikipedia.org/wiki/Chromium_(web_browser))-based browsers:
#### Chrome (Windows, MacOS, Linux), Microsoft Edge (version 79)
1. Download this repo as a [ZIP file from GitHub](https://github.com/magnolia1234/bypass-paywalls-chrome-clean/archive/master.zip).
2. Unzip the file and you should have a folder named `bypass-paywalls-chrome-clean-master`.
3. Move the folder to a permanent location on your computer (do not delete the folder after installation).
4. Go to the extensions page (`chrome://extensions` or `edge://extensions`).
5. Enable Developer Mode.
6. Click `Load unpacked` and select the extension folder.

#### Android
1. Install [Yandex Browser](https://play.google.com/store/apps/details?id=com.yandex.browser&hl=en) from the Google PlayStore (Bypass Paywalls Clean doesn't work with Kiwi Browser yet).
2. Follow Chrome instructions located just above (step 6: pick `manifest.json` instead of the folder).

#### Other Chromium browsers (Opera/Vivaldi/Yandex/Brave)
1. Download the extension as a .crx file from the [releases page](https://github.com/magnolia1234/bypass-paywalls-chrome-clean/releases).
2. In your browser go to the extensions page.
3. Enable Developer Mode.
4. Drag your .crx file anywhere on the page to import it.

#### Firefox
Visit the [Firefox repository](https://github.com/magnolia1234/bypass-paywalls-firefox-clean) of Bypass Paywall Clean.

**Notes**
* This extension works best alongside the adblocker [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm?hl=en). If you live in the EU, also consider installing the extension [I don't care about cookies
](https://chrome.google.com/webstore/detail/i-dont-care-about-cookies/fihnjjcciajhdojfnbdddfaoknhalnja) in order to remove cookie warnings.
* Do not delete extension's folder from your computer/smartphone or Bypass Paywalls Clean will disappear at restart.
* Every time you open Chrome it may warn you about running extensions in developer mode, just click 🗙 to keep the extension enabled.
* You will be logged out for any site you have checked.

### List of supported websites
#### United States of America
##### World news
[First Things](https://www.firstthings.com) -
[Foreign Policy](https://www.foreignpolicy.com) -
[Harper's Magazine](https://harpers.org) -
[The American Interest](https://www.the-american-interest.com) -
[The Atlantic](https://www.theatlantic.com) -
[The Christian Science Monitor](https://www.csmonitor.com) -
[The Nation](https://www.thenation.com) -
[The New York Times](https://www.nytimes.com) -
[The New Yorker](https://www.newyorker.com) -
[The Washington Post](https://www.washingtonpost.com) -
[Vanity Fair](https://www.vanityfair.com) -
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
[Quartz](https://qz.com) -
[The Business Journals](https://www.bizjournals.com) -
[The Wall Street Journal](https://www.wsj.com)
##### Sports
[The Athletic](https://theathletic.com)
##### Tech/Science
[Chemical & Engineering News](https://cen.acs.org) -
[Dark Reading](https://www.darkreading.com) -
[MIT Technology Review](https://www.technologyreview.com) -
[Towards Data Science](https://www.towardsdatascience.com) -
[Wired](https://www.wired.com) -
[Scientific American](https://www.scientificamerican.com)*
##### Blogs
[Medium](https://www.medium.com) (all sites) -
[SofRep](https://sofrep.com) -
[The Daily Beast](https://www.thedailybeast.com)*

##### Local US news
[Baltimore Sun](baltimoresun.com) -
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
[SunSentinel](https://www.sun-sentinel.com) -
[The Boston Globe](https://www.bostonglobe.com) -
[The Denver Post](https://www.denverpost.com) -
[The Mercury News](https://www.mercurynews.com) -
[The Morning Call](https://www.mcall.com) -
[The Seattle Times](https://www.seattletimes.com) -
[The News-Gazette](https://www.news-gazette.com) -
[The Philadelphia Inquirer](https://www.inquirer.com) -
[The Sacramento Bee](https://www.sacbee.com)* -
[Winston-Salem Journal](https://www.journalnow.com)

#### Australia/New Zealand
[Cairns Post](https://www.cairnspost.com.au) –
[Central Western Daily](https://www.centralwesterndaily.com.au) -
[Gold Coast Bulletin](https://www.goldcoastbulletin.com.au) –
[Herald Sun](https://www.heraldsun.com.au) –
[New Zealand Herald](https://www.nzherald.co.nz) -
[Newcastle Herald](https://www.newcastleherald.com.au) -
[Northern Territory News](https://www.ntnews.com.au) –
[The Advertiser](https://www.adelaidenow.com.au) –
[The Advocate](https://www.theadvocate.com.au) -
[The Age](https://www.theage.com.au) -
[The Australian](https://www.theaustralian.com.au) -
[The Australian Financial Review](https://www.afr.com) -
[The Canberra Times](https://www.canberratimes.com.au) -
[The Courier-Mail](https://www.couriermail.com.au) –
[The Daily Telegraph](https://www.dailytelegraph.com.au) –
[The Examiner](https://www.examiner.com.au) -
[The Mercury Tasmania](https://www.themercury.com.au) -
[The Saturday Paper](https://www.thesaturdaypaper.com.au) -
[The Sydney Morning Herald](https://www.smh.com.au) –
[The Weekly Times](https://www.weeklytimesnow.com.au) –
[Townsville Bulletin](https://www.townsvillebulletin.com.au)

#### Canada
[National Post](https://www.nationalpost.com) -
[Le Devoir](https://www.ledevoir.com) -
[The Toronto Star](https://www.thestar.com) -
[The Globe and Mail](https://www.theglobeandmail.com)

#### Europe
##### United Kingdom/Ireland
[Financial News](https://www.fnlondon.com) -
[Financial Times](https://www.ft.com) -
[London Review of Books](https://www.lrb.co.uk) -
[The Economist](https://www.economist.com) -
[The Irish Times](https://www.irishtimes.com)* -
[The New Statesman](https://www.newstatesman.com) -
[The Spectator](https://www.spectator.co.uk) -
[The Telegraph](https://www.telegraph.co.uk) -
[The Times](https://www.thetimes.co.uk) -
[The Times Literary Supplement](https://www.the-tls.co.uk)
##### France/Wallonia
[Challenges](https://www.challenges.fr) –
[L'Écho](https://lecho.be) -
[Le Journal du Dimanche](https://lejdd.fr) –
[Le Monde](https://www.lemonde.fr) -
[Le Parisien](https://www.leparisien.fr) -
[Les Échos](https://www.lesechos.fr) -
[Libération](https://www.liberation.fr)* –
[Valeurs Actuelles](https://www.valeursactuelles.com)
##### Germany/Austria
[Handelsblatt](https://www.handelsblatt.com) -
[Kleine Zeitung](https://www.kleinezeitung.at)
##### Italy
[Corriere Della Sera](https://www.corriere.it) -
[La Repubblica](https://www.repubblica.it) -
[La Stampa](https://www.lastampa.it)
##### Netherlands/Flanders
[Algemeen Dagblad](https://www.ad.nl) and regional ADR sites like
[BN DeStem](https://www.bndestem.nl) -
[Brabants Dagblad](https://www.bd.nl) -
[Eindhovens Dagblad](https://www.ed.nl) -
[Gelderlander](https://www.gelderlander.nl) -
[PZC](https://www.pzc.nl) -
[Stentor](https://www.destentor.nl) -
[Tubantia](https://tubantia.nl)\
[De Morgen](https://www.demorgen.be) -
[De Tijd](https://www.tijd.be) -
[Groene Amsterdammer](https://www.groene.nl) -
[NRC Handelsblad](https://www.nrc.nl) -
[Parool](https://www.parool.nl) -
[Telegraaf](https://www.telegraaf.nl) -
[Trouw](https://www.trouw.nl) -
[Volkskrant](https://www.volkskrant.nl) -
[Vrij Nederland](https://www.vn.nl)
##### Spain
[El País](https://elpais.com)
##### Sweden
[Dagens Nyheter](https://www.dn.se)

#### East Asia
[Caixin Global](https://www.caixinglobal.com) -
[Nikkei Asian Review](https://asia.nikkei.com) -
[NK News](https://www.nknews.org) -
[Tech in Asia](https://www.techinasia.com) -
[The Diplomat](https://www.thediplomat.com) -
[The Japan Times](https://www.japantimes.co.jp)

#### India
[Bloomberg Quint](https://www.bloombergquint.com)* -
[ET Prime](https://prime.economictimes.indiatimes.com) -
[The Hindu](https://www.thehindu.com)

#### Israel
[Haaretz.co.il](https://www.haaretz.co.il) -
[Haaretz.com](https://www.haaretz.com) -
[The Marker](https://www.themarker.com)

#### Latin America
##### Argentina
[La Nación](https://www.lanacion.com.ar)
##### Brazil
[Exame](https://exame.abril.com.br) –
[Folha de S. Paulo](https://www.folha.uol.com.br) -
[O Estado de S. Paulo](https://estadao.com.br) –
[O Globo](https://oglobo.globo.com) –
[Valor Econômico](https://valor.globo.com)*
##### Chile
[La Tercera](https://www.latercera.com)
##### Mexico
[Mexico News Daily](https://mexiconewsdaily.com)

#### Encyclopedia/Book library/Knowledge base
[Encyclopedia Britannica](https://www.britannica.com) -
[Glassdoor](https://www.glassdoor.com) -
[Loeb Classical Library](https://www.loebclassics.com) -
[Quora](https://www.quora.com) -
[Scribd](http://www.scribd.com) -
[Statista](https://www.statista.com)

_*free articles only._

### Sites with limited number of free articles
The free article limit can normally be bypassed by removing cookies for the site.*
1. Install the extension [Disable Cookies](https://chrome.google.com/webstore/detail/disable-cookies/lkmjmficaoifggpfapbffkggecbleang?hl=en).
2. When coming across a paywall, click the cookie icon in your extension toolbar then refresh the page.

_*may not always succeed._

### New site requests
You can submit a request for a new website [here](https://github.com/magnolia1234/bypass-paywalls-chrome-clean/issues/new). Please read the following instructions and share your results for a quicker process. Remember to check the [previous requests](https://github.com/magnolia1234/bypass-paywalls-chrome-clean/issues?q=is%3Aissue+label%3Aenhancement) before asking for a new website.
1. Visit an article on the site you want to bypass the paywall for and copy the article title.
2. Open up a new incognito window (Ctrl+Shift+N) and paste the article title into Google.
3. Click on the same article from the Google search results page. Or you can:
4. Disable javascript on the website by clicking the button right icon </> on the uBlock panel.
5. Refresh the page.

### Troubleshooting
* This extension works best alongside [uBlock Origin](https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm).
* If a site doesn't work, try turning off uBlock and refreshing. Also try reinstalling the extension.
* Make sure the site is checked under Options (on macOS sometimes the sites are unselected).
* Make sure you're running the last version of Bypass Paywalls Clean.
* If none of these work, you can submit an issue [here](https://github.com/magnolia1234/bypass-paywalls-chrome-clean/issues).

### Changelog
* Visit the [releases page](https://github.com/magnolia1234/bypass-paywalls-chrome-clean/releases).

### Pull Requests
* PRs are welcome.

### Show your support
* I am not asking for donations or anything like that, all I ask is that you star this repo.

### License
* Bypass Paywalls Clean is [MIT-licensed](https://github.com/magnolia1234/bypass-paywalls-chrome-clean/blob/master/LICENSE).
