//"use strict";
var ext_api = (typeof browser === 'object') ? browser : chrome;
var domain;
var csDone = false;

var ca_torstar_domains = ['niagarafallsreview.ca', 'stcatharinesstandard.ca', 'thepeterboroughexaminer.com', 'therecord.com', 'thespec.com', 'thestar.com', 'wellandtribune.ca'];
var de_funke_media_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'morgenpost.de', 'nrz.de', 'waz.de', 'wp.de', 'wr.de'];
var de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de'];
var es_grupo_vocento_domains = ['diariosur.es', 'diariovasco.com', 'elcomercio.es', 'elcorreo.com', 'eldiariomontanes.es', 'elnortedecastilla.es', 'hoy.es', 'ideal.es', 'larioja.com', 'laverdad.es', 'lavozdigital.es'];
var fr_groupe_ebra_domains = ['bienpublic.com', 'dna.fr', 'estrepublicain.fr', 'lalsace.fr', 'ledauphine.com', 'lejsl.com', 'leprogres.fr', 'republicain-lorrain.fr', 'vosgesmatin.fr'];
var fr_groupe_la_depeche_domains = ['centrepresseaveyron.fr', 'ladepeche.fr', 'lindependant.fr', 'midi-olympique.fr', 'midilibre.fr', 'nrpyrenees.fr', 'petitbleu.fr'];

// clean local storage of sites (with an exemption for hold-list)
var arr_localstorage_hold = ['charliehebdo.fr', 'elmundo.es', 'expansion.com', 'kurier.at', 'nknews.org', 'seekingalpha.com', 'sfchronicle.com', 'thehindu.com', 'thetimes.co.uk'];
arr_localstorage_hold = arr_localstorage_hold.concat(de_funke_media_domains, es_grupo_vocento_domains);
if (!matchDomain(arr_localstorage_hold)){
    window.localStorage.clear();
}

// listen to responses from background script
if (ext_api.runtime && (matchDomain(['belfasttelegraph.co.uk', 'bostonglobe.com', 'independent.ie']) || window.location.hostname.match(/\.(com|net)\.au$/))) {
ext_api.runtime.onMessage.addListener(function (message, sender) {
    // setCookie opt-in
    if (message.optIn) {
        let hostname = window.location.hostname;
        if (hostname.match(/\.(com|net)\.au$/)) {
            // Australian Provincial Newspapers
            domain = window.location.hostname.replace('www.', '');
            let au_apn_script = document.querySelector('script[src^="https://media.apnarm.net.au/"]');
            if (au_apn_script || (domain = matchDomain(['news-mail.com.au', 'frasercoastchronicle.com.au', 'gladstoneobserver.com.au', 'dailyexaminer.com.au', 'dailymercury.com.au', 'themorningbulletin.com.au', 'sunshinecoastdaily.com.au', 'gympietimes.com.au', 'northernstar.com.au', 'qt.com.au', 'thechronicle.com.au', 'warwickdailynews.com.au'])))
                if (!cookieExists('subscribed'))
                    setCookie('subscribed', 'true', domain, '/', 14);
        } else {
            if (matchDomain('bostonglobe.com')) {
                if (!cookieExists('s_fid')) {
                    let s_fid = genHexString(16) + '-' + genHexString(16);
                    setCookie('s_fid', s_fid, 'bostonglobe.com', '/', 14);
                }
            } else if (domain = matchDomain(['belfasttelegraph.co.uk', 'independent.ie'])) {
                if (!cookieExists('subscriber'))
                    setCookie('subscriber', '{"subscriptionStatus": true}', domain, '/', 14);
                if (hostname.includes('amp.')) {
                    let subscriber = document.querySelector('section[amp-access="subscriber"]');
                    if (subscriber)
                        subscriber.removeAttribute('amp-access-hide');
                    let not_subscriber = document.querySelector('section[amp-access="NOT subscriber"]');
                    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
                    removeDOMElement(not_subscriber, ...amp_ads);
                }
            }
        }
    }
});

// ask for opt-in confirmation
ext_api.runtime.sendMessage({request: 'optin'});
}

// Content workarounds/domain

if (matchDomain("thesaturdaypaper.com.au")) {
    let paywall = document.querySelector('div.paywall-hard-always-show');
    removeDOMElement(paywall);
}

else if (domain = matchDomain(["brisbanetimes.com.au", "smh.com.au", "theage.com.au", "watoday.com.au"])) {
    let url = window.location.href;
    let for_subscribers = document.querySelector('meta[content^="FOR SUBSCRIBERS"]');
    if (for_subscribers) {
        window.setTimeout(function () {
            window.location.href = url.replace('www.', 'amp.');
        }, 500); // Delay (in milliseconds)
    } else if (url.includes('amp.' + domain)) {
        let subscr_sections = document.querySelectorAll('div[subscriptions-section="content"]');
        for (let subscr_section of subscr_sections) {
            subscr_section.removeAttribute('subscriptions-section');
        }
        let amp_ads = document.querySelectorAll('amp-ad');
        removeDOMElement(...amp_ads);
    }
}

else if (window.location.hostname.endsWith(".com.au") || window.location.hostname.endsWith(".net.au")) {
    // Australian Community Media newspapers
    let au_cm_sites = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
    let au_piano_script = document.querySelector('script[src="https://cdn-au.piano.io/api/tinypass.min.js"]');
    if (matchDomain(au_cm_sites) || au_piano_script) {
        const subscribe_truncate = document.querySelector('.subscribe-truncate');
        if (subscribe_truncate)
            subscribe_truncate.classList.remove('subscribe-truncate');
        const subscriber_hiders = document.querySelectorAll('.subscriber-hider');
        for (let subscriber_hider of subscriber_hiders) {
            subscriber_hider.classList.remove('subscriber-hider');
        }
        let story_generic_iframe = document.querySelector('.story-generic__iframe');
        removeDOMElement(story_generic_iframe);
    } else if (window.location.hostname.endsWith(".com.au")) {
        // Australia News Corp
        let au_nc_sites = ['adelaidenow.com.au', 'cairnspost.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'theaustralian.com.au', 'themercury.com.au', 'townsvillebulletin.com.au', 'weeklytimesnow.com.au'];
        if (matchDomain(au_nc_sites)) {
            let header_ads = document.querySelector('.header_ads-container');
            removeDOMElement(header_ads);
            if (window.location.hostname.startsWith('amp.')) {
                let div_hidden_all = document.querySelectorAll('div[amp-access="access AND subscriber"]');
                for (let div_hidden of div_hidden_all)
                    div_hidden.removeAttribute('amp-access-hide');
            } else if (window.location.href.includes('?amp')) {
                //window.setTimeout(function () {
                let div_hidden = document.querySelector('div[amp-access="subscriber AND status=\'logged-in\'"]');
                if (div_hidden)
                    div_hidden.removeAttribute('amp-access-hide');
                //}, 500); // Delay (in milliseconds)
            }
            let amp_iframes = document.querySelectorAll('amp-iframe');
            let elem;
            for (let amp_iframe of amp_iframes) {
                elem = document.createElement('a');
                elem.innerText = 'Video-link';
                elem.setAttribute('href', amp_iframe.getAttribute('src'));
                elem.setAttribute('target', '_blank');
                amp_iframe.parentElement.insertBefore(elem, amp_iframe);
                removeDOMElement(amp_iframe);
            }
        } else {
            // Australian Seven West Media
            let swm_script = document.querySelector('script[src^="https://s.thewest.com.au"]');
            if (matchDomain("thewest.com.au") || swm_script) {
                window.setTimeout(function () {
                    let breach_screen = document.querySelector('div[data-testid*="BreachScreen"]');
                    if (breach_screen) {
                        let scripts = document.querySelectorAll('script');
                        let json_script;
                        for (let script of scripts) {
                            if (script.innerText.includes('window.PAGE_DATA ='))
                                json_script = script;
                            continue;
                        }
                        if (json_script) {
                            let json_text = json_script.innerHTML.split('window.PAGE_DATA =')[1].split('</script')[0];
                            json_text = json_text.replace(/undefined/g, '"undefined"');
                            let json_article = JSON.parse(json_text);
                            let json_pub;
                            for (let key in json_article)
                                if (json_article[key].data.result.resolution && json_article[key].data.result.resolution.publication) {
                                    json_pub = json_article[key].data.result.resolution.publication;
                                    continue;
                                }
                            let json_content
                            if (json_pub)
                                json_content = json_pub.content.blocks;
                            else
                                window.location.reload(true);
                            //let json_video = json_pub.mainVideo;
                            let url = window.location.href;
                            let url_loaded = json_pub._self;
                            if (!url.includes(url_loaded.slice(-10)))
                                window.location.reload(true);
                            let article = '';
                            let div_content = document.createElement('div');
                            for (let par of json_content) {
                                if (par.kind === 'text') {
                                    article = article + '<p>' + par.text + '</p>';
                                } else if (par.kind === 'subhead') {
                                    article = article + '<h2>' + par.text + '</h2>';
                                } else if (par.kind === 'pull-quote') {
                                    article = article + '<i>' + (par.attribution ? par.attribution + ': ' : '') + par.text + '</i>';
                                } else if (par.kind === 'embed') {
                                    if (par.reference.includes('https://omny.fm/') || par.reference.includes('https://docdro.id/')) {
                                        article = article + '<embed src="' + par.reference + '" style="height:500px; width:100%" frameborder="0"></embed>';
                                    } else {
                                        article = article + 'Embed: ' + '<a href="' + par.reference + '" target="_blank">' + par.reference + '</a>';
                                        console.log('embed: ' + par.reference);
                                    }
                                } else if (par.kind === 'unordered-list') {
                                    if (par.items) {
                                        article = article + '<ul>';
                                        for (let item of par.items)
                                            if (item.text && item.intentions[0].href) {
                                                article = article + '<li><a href="' + item.intentions[0].href + '">' + item.text + '</a></li>';
                                            }
                                        article = article + '</ul>';
                                    }
                                } else if (par.kind === 'inline') {
                                    if (par.asset.kind === 'image') {
                                        article = article + '<figure><img src="' + par.asset.original.reference + '" style="width:100%">';
                                        article = article + '<figcaption>' +
                                            par.asset.captionText + ' ' + par.asset.copyrightByline +
                                            ((par.asset.copyrightCredit && par.asset.captionText !== par.asset.copyrightByline) ? '/' + par.asset.copyrightCredit : '') +
                                            '<figcaption></figure>';
                                    }
                                } else {
                                    article = article + '<p>' + par.text + '</p>';
                                    console.log(par.kind);
                                }
                            }
                            let content = document.querySelector('div[class*="StyledArticleContent"]');
                            let parser = new DOMParser();
                            let par_html = parser.parseFromString('<div>' + article + '</div>', 'text/html');
                            let par_dom = par_html.querySelector('div');
                            if (content) {
                                content.appendChild(par_dom);
                            } else {
                                par_dom.setAttribute('style', 'margin: 20px;');
                                breach_screen.parentElement.insertBefore(par_dom, breach_screen);
                            }
                        }
                        removeDOMElement(breach_screen);
                    }
                }, 1000); // Delay (in milliseconds)
                let header_advert = document.querySelector('.headerAdvertisement');
                if (header_advert)
                    header_advert.setAttribute('style', 'display: none;');
            }
        }
    }
}

else if (matchDomain('rep.repubblica.it')) {
    window.setTimeout(function () {
        if (window.location.href.includes('/pwa/')) {
            window.location.href = window.location.href.replace('/pwa/', '/ws/detail/');
        }
    }, 500); // Delay (in milliseconds)
    if (window.location.href.includes('/ws/detail/')) {
        const paywall = document.querySelector('.paywall[subscriptions-section="content"]');
        if (paywall) {
            paywall.removeAttribute('subscriptions-section');
            const preview = document.querySelector('div[subscriptions-section="content-not-granted"]');
            removeDOMElement(preview);
            csDone = true;
        }
    }
}

else if (matchDomain("americanbanker.com")) {
    const paywall = document.querySelector('.embargo-content');
    if (paywall)
        paywall.classList.remove('embargo-content');
}

else if (matchDomain('telegraaf.nl')) {
    if (window.location.href.startsWith('https://www.telegraaf.nl/error?ref=/')) {
        window.location.href = window.location.href.split('&')[0].replace('error?ref=/', '');
    }
    let refresh = document.querySelector('div[id="content"] > meta[http-equiv="refresh"]');
    if (refresh) {
        window.setTimeout(function () {
            window.location.reload(true);
        }, 500);
    }
    let article_wrapper = document.querySelector('.ArticlePageWrapper__uid');
    let spotx_banner = document.querySelector('.ArticleBodyBlocks__inlineArticleSpotXBanner');
    let paywall = document.querySelector('.PopupBackdrop__block');
    removeDOMElement(spotx_banner, paywall);
    let premium = document.querySelector('.PremiumLabelWithLine__body');
    let article_id = article_wrapper ? article_wrapper.innerText : '123';
    let article_body_done = document.querySelector('#articleBody' + article_id);
    if (premium && !article_body_done) {
        let article_body_old = document.querySelector('[id^="articleBody"]');
        removeDOMElement(article_body_old);
        let json = document.querySelector('script[type="application/ld+json"][data-react-helmet="true"]');
        if (json) {
            var json_text = JSON.parse(json.text).articleBody;
            let article_body = document.querySelector('section.TextArticlePage__bodyText');
            if (article_body) {
                let div_main = document.createElement("div");
                div_main.setAttribute('id', 'articleBody' + article_id);
                let div_elem = document.createElement("div");
                div_elem.setAttribute('data-element', 'articleBodyBlocks');
                let text_array = json_text.split('\n\n');
                text_array.forEach(p_text => {
                    let p_div = document.createElement("p");
                    p_div.setAttribute('class', 'ArticleBodyBlocks__paragraph ArticleBodyBlocks__paragraph--nieuws');
                    p_div.innerText = p_text;
                    div_elem.appendChild(p_div);
                });
                div_main.appendChild(div_elem);
                article_body.appendChild(div_main);
                csDone = true;
            }
        }
    }
}

else if (matchDomain(['ad.nl', 'bd.nl', 'ed.nl', 'tubantia.nl', 'bndestem.nl', 'pzc.nl', 'destentor.nl', 'gelderlander.nl'])) {
    let paywall = document.querySelector('.article__component.article__component--paywall-module-notification');
    let modal_login = document.querySelector('.modal--login');
    removeDOMElement(paywall, modal_login);
}

else if (matchDomain("washingtonpost.com")) {
    let leaderboard = document.querySelector('#leaderboard-wrapper');
    let adverts = document.querySelectorAll('div[data-qa="article-body-ad"]');
    removeDOMElement(leaderboard, ...adverts);
    if (location.href.includes('/gdpr-consent/')) {
        let free_button = document.querySelector('.gdpr-consent-container .continue-btn.button.free');
        if (free_button)
            free_button.click();
        window.setTimeout(function () {
            let gdprcheckbox = document.querySelector('.gdpr-consent-container .consent-page:not(.hide) #agree');
            if (gdprcheckbox) {
                gdprcheckbox.checked = true;
                gdprcheckbox.dispatchEvent(new Event('change'));
                document.querySelector('.gdpr-consent-container .consent-page:not(.hide) .continue-btn.button.accept-consent').click();
            }
        }, 300); // Delay (in milliseconds)
    }
    else if (adverts || leaderboard)
        csDone = true;
}

else if (matchDomain("wsj.com") && !matchDomain("cn.wsj.com")) {
    if (location.href.includes('/articles/')) {
        const close_button = document.querySelector('div.close-btn[role="button"]');
        if (close_button)
            close_button.click();
    }
    let wsj_ads = document.querySelectorAll('div.wsj-ad');
    removeDOMElement(...wsj_ads);
    document.addEventListener('DOMContentLoaded', () => {
        let url = window.location.href;
        let snippet = document.querySelector('.snippet-promotion');
        let wsj_pro = document.querySelector('meta[name="page.site"][content="wsjpro"]');
        if (snippet || wsj_pro) {
            window.location.href = window.location.href.replace('wsj.com', 'wsj.com/amp');
        }
    });
}

else if (matchDomain("mexiconewsdaily.com")) {
    window.setTimeout(function () {
        let cpro_overlay = document.querySelector('.cpro-overlay');
        removeDOMElement(cpro_overlay);
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("the-american-interest.com")) {
  const counter = document.getElementById('article-counter');
  removeDOMElement(counter);
}

else if (matchDomain("nzherald.co.nz")) {
    let article_content = document.querySelector('.article__content');
    if (article_content) {
        let article_offer = document.querySelector('.article-offer');
        if (article_offer) {
            let css_selector = article_content.querySelectorAll('p')[5].getAttribute('class');
            let hidden_not_pars = article_content.querySelectorAll('.' + css_selector + ':not(p)');
            for (let hidden_not_par of hidden_not_pars) {
                hidden_not_par.classList.remove(css_selector);
                hidden_not_par.removeAttribute('style');
            }
            let hidden_pars = article_content.querySelectorAll('p.' + css_selector);
            let par_html, par_dom;
            let parser = new DOMParser();
            for (let hidden_par of hidden_pars) {
                let par_html = parser.parseFromString('<div style="margin: 10px 0px; font-size: 17px">' + hidden_par.innerHTML + '</div>', 'text/html');
                let par_dom = par_html.querySelector('div');
                article_content.insertBefore(par_dom, hidden_par);
            }
            let first_span = document.querySelector('p > span');
            if (first_span)
                first_span.removeAttribute('class');
            removeDOMElement(article_offer);
            csDone = true;
        }
    }
    let premium_toaster = document.querySelector('#premium-toaster');
    removeDOMElement(premium_toaster);
}

else if (matchDomain(["parool.nl", "trouw.nl", "volkskrant.nl", "humo.be", "demorgen.be"])) {
    window.setTimeout(function () {
        let top_banner = document.querySelector('div[data-temptation-position="PAGE_TOP"]');
        let paywall = document.querySelector('[data-temptation-position="ARTICLE_BOTTOM"]');
        let hidden_section = document.querySelector('[data-temptation-position="ARTICLE_INLINE"]');
        let overlay = document.querySelector('div[data-temptation-position="PAGE_BOTTOM"]');
        removeDOMElement(top_banner, paywall, hidden_section, overlay);
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("firstthings.com")) {
    const paywall = document.querySelector('.paywall');
    removeDOMElement(paywall);
}

else if (matchDomain("bloomberg.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        let fence = document.querySelector('.fence-body');
        if (fence) {
            fence.classList.remove('fence-body');
        }
    });
    let body_overlay = document.querySelector('body[data-paywall-overlay-status="show"]');
    if (body_overlay)
        body_overlay.removeAttribute('data-paywall-overlay-status');
    let noscroll = document.querySelector('body[class*="noScroll"]');
    if (noscroll)
        removeClassesByPrefix(noscroll, 'noScroll');
    let paywall_overlay = document.querySelector('div#graphics-paywall-overlay');
    let banner = document.getElementById('paywall-banner');
    removeDOMElement(banner, paywall_overlay);
}

else if (matchDomain("bloombergquint.com")) {
    const articlesLeftModal = document.querySelector('.paywall-meter-module__story-paywall-container__1UgCE');
    const paywall = document.getElementById('paywallDmp');
    removeDOMElement(articlesLeftModal, paywall);
}

else if (matchDomain(["medium.com", "towardsdatascience.com"])) {
    window.setTimeout(function () {
        let meter = document.querySelector('[id^="lo-highlight-meter-"]');
        if (meter)
            meter.hidden = true;
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("ledevoir.com")) {
        const counter = document.querySelector('.popup-msg');
        removeDOMElement(counter);
}

else if (matchDomain('ft.com')) {
    let cookie_banner = document.querySelector('.o-banner__outer');
    let ribbon = document.querySelector('.js-article-ribbon');
    let ads = document.querySelector('.o-ads');
    removeDOMElement(cookie_banner, ribbon, ads);
}

else if (matchDomain(["thehindu.com", "thehindubusinessline.com"])) {
    if (!localStorage.geo) {
        localStorage.setItem("geo", '{"v":{"clientTcpRtt":20,"longitude":"'+ makeRandomNumber(2) + '.' + makeRandomNumber(5) + '","httpProtocol":"HTTP/2","tlsCipher":"AEAD-AES128-GCM-SHA256","continent":"EU","asn":1234,"clientAcceptEncoding":"gzip, deflate,br","country":"UK","isEUCountry":"1","tlsClientAuth":{"certIssuerDNLegacy":"","certIssuerDN":"","certIssuerDNRFC2253":"","certSubjectDNLegacy":"","certVerified":"NONE","certNotAfter":"","certSubjectDN":"","certFingerprintSHA1":"","certNotBefore":"","certSerial":"","certPresented":"0","certSubjectDNRFC2253":""},"tlsVersion":"TLSv1.3","colo":"DUS","timezone":"Europe/London","edgeRequestKeepAliveStatus":1,"requestPriority":"weight=220;exclusive=1","botManagement":{"staticResource":false,"verifiedBot":false,"score":99},"clientTrustScore":99,"postalCode":"' + makeRandomNumber(4) + '","regionCode":"QR","region":"County","city":"London","latitude":"' + makeRandomNumber(2) + '.' + makeRandomNumber(5) + '"},"e":' + makeRandomNumber(13) + '}');
    }
    let counter = document.querySelector('#test');
    removeDOMElement(counter);
    function hindu_main() {
        document.addEventListener('bpc_event', function (e) {
            if (window) {
                window.Adblock = false;
                window.isNonSubcribed = false;
            }
        })
    }
    insert_script(hindu_main);
    document.dispatchEvent(new CustomEvent('bpc_event', {}));
}

else if (matchDomain("nytimes.com")) {
    function nyt_main() {
        navigator.storage.estimate = undefined;
        webkitRequestFileSystem = function () {};
    }
    insert_script(nyt_main);
    let preview_button = document.querySelector('.css-3s1ce0');
    if (preview_button)
        preview_button.click();
    csDone = true;
}

else if (matchDomain("economist.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        const subscribe = document.querySelector('.subscription-proposition');
        const wrapper = document.getElementById('bottom-page-wrapper');
        removeDOMElement(subscribe, wrapper);
        const adverts = document.querySelectorAll('div.advert');
        for (let advert of adverts)
            advert.setAttribute('style', 'display:none');
        window.setTimeout(function () {
            const paywall = document.querySelector('.layout-article-regwall'); ;
            if (paywall) {
                window.location.reload(true);
            }
        }, 600); // Delay (in milliseconds)
        const p_articles = document.querySelectorAll('p.article__body-text');
        var href;
        for (let p_article of p_articles) {
            const e_anchors = document.querySelectorAll('a');
            href = '';
            for (let e_anchor of e_anchors) {
                if (e_anchor.href) {
                    href = e_anchor.href;
                } else {
                    e_anchor.href = href;
                }
            }
        }
    });
}

else if (matchDomain("the-tls.co.uk")) {
        const paywall = document.querySelector('.tls-subscriptions-banner__closed-skin');
        removeDOMElement(paywall);
}

else if (matchDomain("caixinglobal.com")) {
    window.setTimeout(function () {
        let pay_tips = document.querySelectorAll('.cons-pay-tip');
        for (let pay_tip of pay_tips)
            pay_tip.removeAttribute('style');
        let appContent = document.getElementById('appContent');
        if (appContent) {
            let hidden_pars = document.querySelectorAll('p:not([style="display:block;"])');
            for (let hidden_par of hidden_pars)
                hidden_par.setAttribute('style', 'display:block;');
        }
        let app_exclusive_tip = document.querySelector('.app-exclusive-tip');
        removeDOMElement(app_exclusive_tip);
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("nrc.nl")) {
    window.setTimeout(function () {
        let mijnnrc_overlay = document.querySelector('#mijnnrc__modal__overlay');
        let subscribe_bar = document.querySelector('.header__subscribe-bar');
        removeDOMElement(mijnnrc_overlay, subscribe_bar);
        let paywall = document.querySelector('.has-paywall');
        if (paywall)
            paywall.classList.remove("has-paywall");
        let paywall_overlay = document.querySelector('.has-paywall-overlay');
        if (paywall_overlay)
            paywall_overlay.classList.remove("has-paywall-overlay");
    }, 100);
}

else if (matchDomain("scribd.com")) {
    let blurred_pages = document.querySelectorAll('.blurred_page');
    for (let blurred_page of blurred_pages) {
        blurred_page.classList.remove('blurred_page');
    }
    let portal = document.querySelector('.between_page_portal_root');
    let page_module = document.querySelector('.between_page_module');
    let promo = document.querySelector('.auto__doc_page_webpack_doc_page_body_static_promo_study');
    let ad = document.querySelector('.auto__explain_scribd_v2_advertisement');
    removeDOMElement(portal, page_module, promo, ad);
}

else if (matchDomain("thetimes.co.uk")) {
    const block = document.querySelector('.subscription-block');
    const ad_block = document.getElementById('ad-article-inline')
    const ad_header = document.getElementById('sticky-ad-header')
    removeDOMElement(block, ad_block, ad_header);
}

else if (matchDomain("technologyreview.com")) {
    window.setTimeout(function () {
        let body_obscured = document.querySelector('body[class*="body__obscureContent"]');
        if (body_obscured)
            removeClassesByPrefix(body_obscured, 'body__obscureContent');
        let overlay = document.querySelector('div[class*="overlayFooter__wrapper"]');
        if (overlay)
            overlay.setAttribute('style', 'display:none');
        let content_body_hidden = document.querySelector('div[class*="contentBody__contentHidden"]');
        if (content_body_hidden)
            removeClassesByPrefix(content_body_hidden, 'contentBody__contentHidden');
        let content_body_overlay = document.querySelector('div[class*="contentBody__overlay"]');
        if (content_body_overlay)
            content_body_overlay.removeAttribute('class');
    }, 500);
}

else if (matchDomain("asia.nikkei.com")) {
    const popup = document.querySelector('.pw-widget--popup');
    removeDOMElement(popup);
}

else if (matchDomain("hbr.org")) {
    const popup = document.querySelector('.persistent-banner');
    removeDOMElement(popup);
}

else if (matchDomain("techinasia.com")) {
    let paywall = document.querySelector('.paywall-content');
    if (paywall)
        paywall.classList.remove('paywall-content');
    let splash_subscribe = document.querySelector('.splash-subscribe');
    let paywall_hard = document.querySelector('.paywall-hard');
    removeDOMElement(splash_subscribe, paywall_hard);
}

else if (matchDomain(ca_torstar_domains)) {
    window.setTimeout(function () {
    let meter_banner = document.querySelector('.c-article-meter-banner');
    let ads = document.querySelectorAll('.seo-media-query, .c-googleadslot');
    removeDOMElement(meter_banner, ...ads);
    let end_of_article = document.querySelector('#end-of-article');
    if (end_of_article)
        end_of_article.setAttribute('style', 'display:none;');
    let rightrail = document.querySelector('.c-article-body__rightrail');
    if (rightrail)
        rightrail.setAttribute('style', 'display:none;');
    }, 500);
}

else if (matchDomain("afr.com")) {
    let hidden_images = document.querySelectorAll('img[src*=".gif"]');
    for (let hidden_image of hidden_images) {
        var data_src = hidden_image.getAttribute("data-src");
        if (data_src)
            hidden_image.setAttribute('src', data_src);
    }
    let plista = document.querySelector('div[data-plista-placement="underArticle_Group"]');
    removeDOMElement(plista);
}

else if (matchDomain("theglobeandmail.com")) {
    let article_body_subscribed = document.querySelector('.c-article-body--subscribed');
    if (article_body_subscribed) {
        article_body_subscribed.removeAttribute('class');
        csDone = true;
    }
    function tgam_main() {
        document.addEventListener('bpc_event', function (e) {
            if (window.tgam)
                window.tgam.keytar.subscriberPaywallEnabled = false;
        })
    }
    insert_script(tgam_main);
    document.dispatchEvent(new CustomEvent('bpc_event', {}));
}

else if (matchDomain("sofrep.com")) {
    const banner = document.getElementById('scrollerCTA');
    removeDOMElement(banner);
}

else if (matchDomain("newstatesman.com")) {
    const tns_modal_wrapper = document.querySelector('.tns-modal-wrapper');
    removeDOMElement(tns_modal_wrapper);
}

else if (matchDomain("liberation.fr")) {
  const close_button = document.querySelector('.pw-action-close');
  if (close_button)
      close_button.click();
}

else if (matchDomain("estadao.com.br")) {
    const paywall = document.getElementById('paywall-wrapper-iframe-estadao');
    removeDOMElement(paywall);
}

else if (matchDomain("folha.uol.com.br")) {
    const signup = document.querySelector('.c-top-signup');
    removeDOMElement(signup);
}

else if (matchDomain("cen.acs.org")) {
    document.addEventListener('DOMContentLoaded', () => {
        const meteredBar = document.querySelector('.meteredBar');
        removeDOMElement(meteredBar);
    });
}

else if (matchDomain("lesechos.fr") && window.location.href.match(/-\d{6,}/)) {
    window.setTimeout(function () {
        let abo_banner = document.querySelector('[class^="pgxf3b"]');
        let ad_blocks = document.querySelectorAll('[class*="jzxvkd"');
        for (let ad_block of ad_blocks)
            ad_block.setAttribute('style', 'display:none');
        if (abo_banner) {
        removeDOMElement(abo_banner);
        let url = window.location.href;
        let html = document.documentElement.outerHTML;
        let state;
        let split1 = html.split('window.__PRELOADED_STATE__=')[1];
        let split2 = split1.split('</script>')[0].trim();
        if (split2.includes('; window.__DATA__='))
            state = split2.split('; window.__DATA__=')[0].trim();
        else
            state = split2.substr(0, split2.length - 1);
        try {
            let data = JSON.parse(state);
            let article = data.article.data.stripes[0].mainContent[0].data.description;
            let url_loaded = data.article.data.path;
            if (!url.includes(url_loaded))
                window.location.reload(true);
            let paywallNode = document.querySelector('.post-paywall');
            if (paywallNode) {
                let contentNode = document.createElement('div');
                let parser = new DOMParser();
                let article_html = parser.parseFromString('<div>' + article + '</div>', 'text/html');
                let article_par = article_html.querySelector('div');
                if (article_par) {
                    contentNode.appendChild(article_par);
                    contentNode.className = paywallNode.className;
                    paywallNode.parentNode.insertBefore(contentNode, paywallNode);
                    removeDOMElement(paywallNode);
                    let paywallLastChildNode = document.querySelector('.post-paywall  > :last-child');
                    if (paywallLastChildNode) {
                        paywallLastChildNode.setAttribute('style', 'height: auto !important; overflow: hidden !important; max-height: none !important;');
                    }
                }
            }
            let styleElem = document.head.appendChild(document.createElement("style"));
            styleElem.innerHTML = ".post-paywall::after {height: auto !important;}";
        } catch (err) {
            window.location.reload(true);
        }
        }
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain(["lc.nl", "dvhn.nl"])) {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.href.includes('?'))
            window.location.href = window.location.href.split('?')[0];
    });
    let top_ad = document.querySelector('.top__ad');
    let plus = document.querySelector('.plusJustRead');
    removeDOMElement(top_ad, plus);
}

else if (matchDomain("newyorker.com")) {
    let paywall_bar = document.querySelector('.paywall-bar');
    removeDOMElement(paywall_bar);
    let invisible_assets = document.querySelectorAll('.responsive-asset--invisible');
    for (let asset_invisible of invisible_assets)
        asset_invisible.classList.remove('responsive-asset--invisible');
    let overlays = document.querySelectorAll('.aspect-ratio--overlay-container, .asset-embed__asset-container');
    let noscript, html;
    let parser = new DOMParser();
    for (let overlay of overlays) {
        noscript = overlay.querySelector('noscript');
        if (noscript) {
            html = parser.parseFromString(noscript.innerHTML, 'text/html');
            overlay.appendChild(html.querySelector('img'));
            removeDOMElement(noscript);
        }
    }
}

else if (matchDomain("americanaffairsjournal.org")) {
    const paywall_bar = document.querySelector('.paywall-notification-bar-wrapper');
    removeDOMElement(paywall_bar);
}

else if (domain = matchDomain(fr_groupe_la_depeche_domains)) {
    let url = window.location.href;
    let url_new = url.replace(domain + '/', domain + '/amp/');
    if (url.includes(domain + '/amp/')) {
        let amp_access_hide = document.querySelector('[amp-access-hide]');
        if (amp_access_hide) {
            amp_access_hide.removeAttribute('amp-access-hide');
        }
        let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
        removeDOMElement(...amp_ads);
    } else {
        if (!['nrpyrenees.fr', 'petitbleu.fr'].includes(domain)) {
            window.setTimeout(function () {
                const hidden_section = document.querySelector('.article-full__body-content');
                if (hidden_section) {
                    hidden_section.classList.remove('article-full__body-content');
                    let pars = hidden_section.querySelectorAll("p, h2, div");
                    for (let par of pars) {
                        par.removeAttribute('style');
                    }
                }
                const abon = document.querySelector('#noscript-paywall-content, #noscript-paywall');
                removeDOMElement(abon);
            }, 500); // Delay (in milliseconds)
        } else {
            let paywall = document.querySelector('#noscript-paywall-content');
            if (paywall) {
                window.setTimeout(function () {
                    window.location.href = url_new;
                }, 500); // Delay (in milliseconds)
            }
        }
    }
}

else if (matchDomain('challenges.fr')) {
        const amorce = document.querySelector('.user-paying-amorce');
        if (amorce)
            amorce.setAttribute('style', 'display:none !important');
        const content = document.querySelector('.user-paying-content');
        if (content)
            content.setAttribute('style', 'display: block !important');
        const paywall = document.querySelector('.temp-paywall');
        removeDOMElement(paywall);
}

else if (matchDomain('barrons.com')) {
    document.addEventListener('DOMContentLoaded', () => {
        let body_continuous = document.querySelector('body.is-continuous');
        let snippet = document.querySelector('meta[content="snippet"]');
        if (body_continuous && snippet) {
            window.location.href = window.location.href.replace('barrons.com', 'barrons.com/amp');
        }
    });
    if (!window.location.href.includes('barrons.com/amp/')) {
        var href = '';
        let signin_links = document.querySelectorAll('a.primary-button--link');
        for (let signin_link of signin_links) {
            href = signin_link.href;
            if (href.includes('target=')) {
                href = href.split('target')[1].split('%3F')[0];
                href = href.replace('=', '').replace('%3A', ':').replace(/%2F/g, '/');
                signin_link.href = href;
                signin_link.text = 'Click';
            }
        }
    }
    else {
        let wsj_ads = document.querySelectorAll('.wsj-ad');
        removeDOMElement(...wsj_ads);
    }
}

else if (matchDomain('lescienze.it')) {
    window.setTimeout(function () {
        let paywall = document.querySelector('.paywall-adagio');
        let body_paywall = document.getElementById('detail-body-paywall');
        let shade = document.querySelector('.shade');
        removeDOMElement(paywall, body_paywall, shade);
        let hidden_bodies = document.querySelectorAll('.detail_body');
        for (let hidden_body of hidden_bodies) {
            hidden_body.removeAttribute('hidden');
            hidden_body.setAttribute('style', 'display:block; max-height:auto; overflow:visible');
        }
    }, 1000); // Delay (in milliseconds)
}

else if (matchDomain('faz.net')) {
    let paywall = document.querySelector('#paywall-form-container-outer,.atc-ContainerPaywall');
    if (paywall) {
        removeDOMElement(paywall);
        let url = new URL(window.location.href);
        let mUrl = new URL(url.pathname, "https://m.faz.net/");
        fetch(mUrl)
        .then(response => {
            if (response.ok) {
                response.text().then(html => {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                    let json = doc.querySelector('script[id="schemaOrgJson"]');
                    if (json) {
                        var json_text = json.text.replace(/(\r|\n)/g, '');
                        let split1 = json_text.split('"ArticleBody": "');
                        let split2 = split1[1].split('","author":');
                        if (split2[0].includes('"'))
                            json_text = split1[0] + '"ArticleBody": "' + split2[0].replace(/"/g, '“') + '","author":' + split2[1];
                        try {
                            json_text = JSON.parse(json_text).ArticleBody;
                        } catch (err) {
                            console.log(err);
                            return;
                        }
                        if (!json_text)
                            return;
                        let article_text = document.querySelector('.art_txt.paywall,.atc-Text.js-atc-Text');
                        article_text.innerText = '';

                        const breakText = (str) => {
                            str = str.replace(/(?:^|[\w\"\“])(\.|\?|!)(?=[A-ZÖÜ\„][A-Za-zÀ-ÿ\„]{1,})/gm, "$&\n\n");
                            str = str.replace(/([a-z\"\“])(?=[A-Z](?=[A-Za-zÀ-ÿ]+))/gm, "$&\n\n");
                            // exceptions: names with alternating lower/uppercase (no general fix)
                            let str_rep_arr = ["BaFin", "BerlHG", "BfArM", "BilMoG", "DiGA", "EuGH", "eWpG", "GlaxoSmithKline", "gGmbH", "IfSG", "iMessage", "iOS", "iPad", "iPhone", "medRxiv", "mRNA", "PlosOne", "StVO"];
                            let str_rep_split, str_rep_src;
                            for (let str_rep of str_rep_arr) {
                                str_rep_split = str_rep.split(/([a-z]+)(?=[A-Z](?=[A-Za-z]+))/);
                                str_rep_src = str_rep_split.reduce(function (accumulator, currentValue) {
                                        return accumulator + currentValue + ((currentValue !== currentValue.toUpperCase()) ? '\n\n' : '');
                                    });
                                if (str_rep_src.endsWith('\n\n'))
                                    str_rep_src = str_rep_src.slice(0, -2);
                                str = str.replace(new RegExp(str_rep_src, "g"), str_rep);
                            }
                            str = str.replace(/De\n\n([A-Z])/g, "De$1");
                            str = str.replace(/La\n\n([A-Z])/g, "La$1");
                            str = str.replace(/Le\n\n([A-Z])/g, "Le$1");
                            str = str.replace(/Mc\n\n([A-Z])/g, "Mc$1");
                            return str;
                        };

                        json_text = breakText(json_text);
                        json_text.split("\n\n").forEach(
                            (p_text) => {
                            let elem;
                            if (p_text.length < 80) {
                                elem = document.createElement("h2");
                                elem.setAttribute('class', 'atc-SubHeadline');
                            } else {
                                elem = document.createElement("p");
                                elem.setAttribute('class', 'atc-TextParagraph');
                            };
                            elem.innerText = p_text;
                            article_text.appendChild(elem);
                        });
                    }
                })
            }
        });
    }
}

else if (matchDomain(['elcomercio.pe', 'gestion.pe'])) {
    const paywall = document.querySelector('.story-content__nota-premium');
    if (paywall) {
        paywall.classList.remove('story-content__nota-premium');
        paywall.removeAttribute('style');
    }
}

else if (matchDomain('journaldunet.com')) {
    const reg_wall = document.querySelector('.reg_wall');
    removeDOMElement(reg_wall);
    const entry_reg_wall = document.querySelector('.entry_reg_wall');
    if (entry_reg_wall) {
        entry_reg_wall.removeAttribute('style');
    }
}

else if (matchDomain('nzz.ch')) {
    let regwall = document.querySelector('.dynamic-regwall');
    removeDOMElement(regwall);
}

else if (matchDomain(['lejdd.fr', 'parismatch.com'])) {
    let poool_banner = document.querySelector('#poool-container');
    let forbidden = document.querySelector('.forbidden');
    removeDOMElement(poool_banner, forbidden);
    let bottom_hide = document.querySelector('.cnt[data-poool-mode="hide"]');
    if (bottom_hide) {
        bottom_hide.removeAttribute('data-poool-mode');
        bottom_hide.removeAttribute('style');
    }
}

else if (domain = matchDomain(['elmundo.es', 'expansion.com'])) {
    let premium = document.querySelector('.ue-c-article__premium');
    if (premium && window.location.href.includes('/www.' + domain + '/')) {
        window.setTimeout(function () {
            window.location.href = window.location.href.replace('/www.', '/amp.');
        }, 500); // Delay (in milliseconds)
    } else if (window.location.href.includes('/amp.' + domain + '/')) {
        let paywall = document.querySelector('div[amp-access="authorized!=true"]');
        if (paywall) {
            removeDOMElement(paywall);
            let div_hidden = document.querySelector('div[amp-access="authorized=true"]');
            if (div_hidden) {
                div_hidden.removeAttribute('amp-access-hide');
            }
        }
        let adverts = document.querySelectorAll('.advertising, amp-embed');
        removeDOMElement(...adverts);
    }
}

else if (matchDomain('spectator.co.uk')) {
    let premium = document.querySelector('.HardPayWallContainer-module__overlay');
    window.setTimeout(function () {
        if (premium && window.location.href.includes('/www.spectator.co.uk/')) {
            window.location.href = window.location.href + '/amp';
        }
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain('historyextra.com')) {
    let article_masked = document.querySelector('.template-article__masked');
    if (article_masked) {
        let extra_pars = document.querySelectorAll('div.template-article__masked > p');
        removeDOMElement(...extra_pars);
        article_masked.classList.remove('template-article__masked');
    }
    let ad_banner = document.querySelector('.ad-banner-container');
    removeDOMElement(ad_banner);
    if (ad_banner)
        csDone = true;
}

else if (matchDomain('republic.ru')) {
    let paywall = document.querySelector('.paywall-section');
    removeDOMElement(paywall);
}

else if (matchDomain('ftm.nl')) {
    let banner_pp = document.querySelector('div.banner-pp');
    removeDOMElement(banner_pp);
}

else if (matchDomain('inkl.com')) {
    document.addEventListener('DOMContentLoaded', () => {
        let menu_btn = document.querySelector('div.left-buttons-container button.menu-btn');
        if (!menu_btn) {
            let article_container = document.querySelector('div.article-content-container');
            if (article_container)
                article_container.setAttribute("style", "overflow: visible; max-height: none;");
            let gradient_container = document.querySelector('div.gradient-container');
            if (gradient_container)
                gradient_container.setAttribute("style", "height:auto;");
        }
        let what_is_inkl = document.querySelector('.what-is-inkl-container');
        let signup = document.querySelector('.article-signup-container');
        removeDOMElement(what_is_inkl, signup);
    });
    let dismiss_button = document.querySelector('div.dismiss-button-container button.btn');
    if (dismiss_button)
        dismiss_button.click();
    let shared_banner = document.querySelector('div.shared-article-inline-banner');
    removeDOMElement(shared_banner);
    let dive_deeper_summary_bodies = document.querySelectorAll('div.dive-deeper-container div.summary-body');
    if (dive_deeper_summary_bodies) {
        for (let summary_body of dive_deeper_summary_bodies) {
            if (!summary_body.querySelector('a')) {
                var ng_click = summary_body.getAttribute('ng-click').replace("showArticle('", '').replace("')", '');
                var weblink = document.createElement('a');
                weblink.text = 'open';
                weblink.href = 'https://www.inkl.com/news/' + ng_click;
                summary_body.appendChild(weblink);
            }
        }
    }
}

else if (matchDomain('slader.com')) {
    window.setTimeout(function () {
        let paywall = document.querySelector('.Paywall');
        let paywall_footer = document.querySelector('.Paywall__footer-counter');
        removeDOMElement(paywall, paywall_footer);
        let blur = document.querySelector('section.Paywall__blur');
        if (blur)
            blur.classList.remove('Paywall__blur');
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain('knack.be')) {
    let paywall = document.querySelector('.rmgPaywall');
    removeDOMElement(paywall);
    let hidden_body = document.querySelector('div.rmgDetail-body div');
    if (hidden_body) {
        hidden_body.removeAttribute('class');
        let body_text = hidden_body.innerText.replace(/(?:^|[\w\"\'])(\.|\?|!)(?=[A-Za-zÀ-ÿ\"\']{2,})/gm, "$&\n\n");
        hidden_body.innerText = body_text;
        let intro_par = document.querySelector('div.rmgDetail-body p');
        if (intro_par && intro_par.innerText.length > 200)
            removeDOMElement(intro_par);
    }
}

else if (matchDomain('ilfattoquotidiano.it')) {
    window.setTimeout(function () {
        let subscribe = document.querySelector('.article-ifq-bottom-pro-sostenitore');
        removeDOMElement(subscribe);
        let paywall = document.querySelector('.read-more');
        if (paywall) {
            if (window.location.href.includes('?'))
                window.location.href = window.location.href.replace('?', 'amp/?');
            else
                window.location.href = window.location.href + 'amp';
        }
        if (window.location.href.includes('/amp/')) {
            let section_not_granted = document.querySelector('section[subscriptions-section="content-not-granted"]');
            let comments = document.querySelector('div.content.comments');
            removeDOMElement(section_not_granted, comments);
            let hidden_content = document.querySelector('section[subscriptions-section="content"]');
            if (hidden_content)
                hidden_content.setAttribute('style', 'display:block !important;');
        }
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain('qz.com')) {
    window.setTimeout(function () {
        let url = window.location.href;
        if (url.includes('utm_source='))
            window.location.href = url.split('?')[0];
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("magazine.atavist.com")) {
    let bottom_notification = document.querySelector('div.bottom-notification');
    let overlay = document.querySelector('div.notification-overlay');
    removeDOMElement(bottom_notification, overlay);
    let paywall = document.querySelector('body.paywall-notification-visible');
    if (paywall)
        paywall.classList.remove('paywall-notification-visible');
}

else if (matchDomain("business-standard.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        let skip_button = document.querySelector('a.btn_skip');
        if (skip_button)
            skip_button.click();
        let paywall = document.querySelector('div.sbc_panel');
        if (paywall) {
            removeDOMElement(paywall.parentElement);
            let scripts = document.querySelectorAll('script[type="application/ld+json"]');
            let json;
            for (let script of scripts) {
                if (script.innerText.includes('articleBody'))
                    json = script;
            }
            if (json) {
                let json_text = JSON.parse(json.text.replace(/(\r\n|\n|\r|\t)/gm, ''))[0].articleBody;
                json_text = parseHtmlEntities(json_text);
                json_text = json_text.replace(/(?:^|[\w\"\'\’])(\.|\?|!)(?=[A-Z\"\”\“\‘\’\'][A-Za-zÀ-ÿ\"\”\“\‘\’\']{1,})/gm, "$&</br></br>") + '</br></br>';
                let parser = new DOMParser();
                let html = parser.parseFromString('<div>' + json_text + '</div>', 'text/html');
                let article = html.querySelector('div');
                if (article) {
                    let p_content = document.querySelector('span.p-content.paywall');
                    if (p_content) {
                        let old_pars = p_content.querySelectorAll('p');
                        for (let old_par of old_pars) {
                            if (!old_par.querySelector('img'))
                                removeDOMElement(old_par);
                        }
                        p_content.appendChild(article);
                    }
                }
            }
        }
    });
}

else if (matchDomain("theatlantic.com")) {
    let banner = document.querySelector('.c-nudge__container,.c-non-metered-nudge');
    removeDOMElement(banner);
}

else if (matchDomain("harpers.org")) {
    let overlay = document.querySelector('div[id^="pum-"]');
    removeDOMElement(overlay);
    let entry_content = document.querySelectorAll('.entry-content');
    for (let elem of entry_content)
        elem.setAttribute('style', 'display: block !important');
}

else if (matchDomain("irishtimes.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        let stub_article_msg = document.querySelector('div.stub-article-msg');
        let url = window.location.href;
        if (url.includes('mode=sample') || stub_article_msg)
            window.location.href = new URL(url).pathname + '?mode=amp';
    });
}

else if (matchDomain("sueddeutsche.de")) {
    let url = window.location.href;
    document.addEventListener('DOMContentLoaded', () => {
        let offer_page = document.querySelector('div.offer-page');
        if (url.startsWith('https://www.sueddeutsche.de') && (url.includes('reduced=true') || offer_page))
            window.location.href = url.split('?')[0].replace('www.', 'amphtml.');
        else if (url.startsWith('https://sz-magazin.sueddeutsche.de')) {
            if (url.includes('reduced=true') || offer_page)
                window.location.href = new URL(url).pathname + '!amp';
        }
    });
    window.setTimeout(function () {
        if (url.includes('!amp')) {
            let paragraph_reduced = document.querySelector('.paragraph--reduced');
            if (paragraph_reduced)
                paragraph_reduced.classList.remove('paragraph--reduced');
            let paragraph_hidden = document.querySelectorAll('.paragraph--hidden');
            for (let par_hidden of paragraph_hidden)
                par_hidden.classList.remove('paragraph--hidden');
            let paragraph_dynamic = document.querySelector('.paragraph--dynamic');
            if (paragraph_dynamic)
                paragraph_dynamic.classList.remove('paragraph--dynamic');
            let amp_offerpage = document.querySelector('.amp-offerpage');
            removeDOMElement(amp_offerpage);
        }
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("charliehebdo.fr")) {
    window.setTimeout(function () {
        let paywalled_content = document.querySelector('div.ch-paywalled-content');
        if (paywalled_content)
            paywalled_content.removeAttribute('style');
        let poool_widget = document.querySelector('div#poool-widget');
        removeDOMElement(poool_widget);
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("fd.nl")) {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.href.includes('?'))
            window.location.href = window.location.href.split('?')[0];
        let reg_modal = document.querySelector('div.modal.upsell');
        if (reg_modal)
            window.location.reload(true);
    });
}

else if (matchDomain("noordhollandsdagblad.nl")) {
    window.setTimeout(function () {
        let close_button = document.querySelector('button[data-testid="button-close"]');
        if (close_button)
            close_button.click();
        let premium = document.querySelector('div.common-components-plus_pluslabel--container');
        if (premium) {
            let hidden_article = document.querySelector('div[data-auth-body="article"]');
            if (hidden_article)
                hidden_article.removeAttribute('style');
            let paywall = document.querySelector('div[data-auth-root="paywall"]');
            removeDOMElement(paywall);
            let auth_body = document.querySelector('div[data-auth-body="article"]');
            if (auth_body) {
                let auth_body_par_count = auth_body.querySelectorAll('p');
                if (auth_body_par_count.length < 2) {
                    let url = window.location.href;
                    let html = document.documentElement.outerHTML;
                    let split1 = html.split('window["__PRELOADED_STATE_GRAPH__')[1].split(/=(.+)/)[1];
                    let split2 = split1.split('</script>')[0].trim();
                    let split3 = split2.split('"body":')[1];
                    let state = split3.split('},"')[0] + '}';
                    try {
                        let data = JSON.parse(state);
                        let article = data.json;
                        auth_body.innerHTML = '';
                        let par_html, par_dom, par_elem, par_div, par_key;
                        let parser = new DOMParser();
                        for (let par of article) {
                            for (let key in par) {
                                par_dom = document.createElement("p");
                                par_elem = '';
                                par_key = par[key];
                                if (key === 'subhead') {
                                    par_elem = document.createElement("strong");
                                    par_elem.innerText = par_key;
                                } else if (key === 'twitter' || key === 'instagram') {
                                    par_elem = document.createElement("a");
                                    Object.assign(par_elem, {
                                        href: par_key,
                                        innerText: par_key,
                                        target: '_blank'
                                    });
                                } else if (key === 'youtube') {
                                    par_elem = document.createElement("iframe");
                                    Object.assign(par_elem, {
                                        src: 'https://www.youtube.com/embed/' + par_key.id,
                                        id: 'ytplayer',
                                        type: 'text/html',
                                        width: 640,
                                        height: 360,
                                        frameborder: 0
                                    });
                                } else if (key === 'streamone') {
                                    par_elem = document.createElement("iframe");
                                    Object.assign(par_elem, {
                                        src: 'https://content.tmgvideo.nl/embed/item=' + par_key.id,
                                        type: 'text/html',
                                        width: 640,
                                        height: 360,
                                        frameborder: 0
                                    });
                                } else if (key === 'image') {
                                    par_elem = document.createElement("div");
                                    let par_img = document.createElement("img");
                                    par_img.src = par_key.url;
                                    par_elem.appendChild(par_img)
                                    par_div = document.createElement("div");
                                    par_div.innerText = par[key].caption ? par[key].caption : '';
                                    par_div.innerText += par[key].credit ? '\n' + par[key].credit : '';
                                    par_elem.appendChild(par_div);
                                } else {
                                    par_html = parser.parseFromString('<div>' + par_key + '</div>', 'text/html');
                                    par_elem = par_html.querySelector('div');
                                }
                                if (par_elem)
                                    par_dom.appendChild(par_elem);
                                auth_body.appendChild(par_dom);
                            }
                        }
                    } catch (err) {
                        console.warn('unable to parse noordhollands dagblad text');
                        console.warn(err);
                    }
                }
            }
        }
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("limesonline.com")) {
    window.setTimeout(function () {
        let url = window.location.href;
        if (url.includes('prv=true'))
            window.location.href = new URL(url).pathname;
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain(["mercuriovalpo.cl", "estrellavalpo.cl"])) {
    let content = document.querySelector('div.content');
    if (content)
        content.setAttribute('id', 'content_new');
    let modal_wrapper = document.querySelector('div.modal-wrapper');
    removeDOMElement(modal_wrapper);
    let body_modal = document.querySelector('body.modal-open');
    if (body_modal)
        body_modal.classList.remove('modal-open');
}

else if (matchDomain("discovermagazine.com")) {
    window.setTimeout(function () {
        let mammoth = document.querySelector('.iXVGnF');
        if (mammoth)
            window.location.reload();
        let banner = document.querySelector('div.hWOjDZ, div.qa7yll-1');
        removeDOMElement(banner);
    }, 1000); // Delay (in milliseconds)
}

else if (domain = matchDomain(["fresnobee.com", "sacbee.com"])) {
    let url = window.location.href;
    if (url.includes('account.' + domain + '/paywall/')) {
        window.setTimeout(function () {
            window.location.href = 'https://amp.' + domain + '/article' + url.split('resume=')[1].split('#')[0] + '.html';
        }, 500); // Delay (in milliseconds)
    } else if (url.includes('amp.' + domain)) {
        let subscr_sections = document.querySelectorAll('div[subscriptions-section="content"]');
        for (let subscr_section of subscr_sections) {
            subscr_section.removeAttribute('subscriptions-section');
        }
        let subscr_tag = document.querySelector('div#subscriber-exclusive-tag');
        let amp_players = document.querySelectorAll('amp-connatix-player');
        removeDOMElement(subscr_tag, ...amp_players);
    }
    let premium_svgs = document.querySelectorAll('h3 > a > svg');
    let premium_link;
    for (let premium_svg of premium_svgs) {
        premium_link = premium_svg.parentElement;
        if (premium_link.href.includes('www.'))
            premium_link.href = premium_link.href.replace('www.', 'amp.');
    }
}

else if (matchDomain("startribune.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        let react_modal_portal = document.querySelectorAll('div.ReactModalPortal');
        removeDOMElement(...react_modal_portal);
        let body_modal = document.querySelector('body.ReactModal__Body--open');
        if (body_modal)
            body_modal.classList.remove('ReactModal__Body--open');
    });
}

else if (matchDomain("nationalreview.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        let url = window.location.href;
        let article_truncated = document.querySelector('div#article-content-truncate-wrap');
        window.setTimeout(function () {
            if (article_truncated && !url.includes('/amp/')) {
                if (url.includes('?'))
                    window.location.href = url.replace('?', 'amp/?')
                else
                    window.location.href = url + 'amp';
            }
        }, 500); // Delay (in milliseconds)
        let adverts = document.querySelectorAll('.ad-unit--center');
        removeDOMElement(...adverts);
    });
}

else if (matchDomain("timeshighereducation.com")) {
    let paywall_cta = document.querySelector('div.paywall-cta');
    if (paywall_cta) {
        paywall_cta.removeAttribute('style');
        let hidden_divs = document.querySelectorAll('div[style="display: none;"]');
        for (let hidden_div of hidden_divs)
            hidden_div.removeAttribute('style');
        let paywall_fade = document.querySelector('div.paywall-fade');
        if (paywall_fade)
            paywall_fade.classList.remove('paywall-fade');
    }
}

else if (matchDomain("stocknews.com")) {
    let hideme = document.querySelector('div#hideme');
    removeDOMElement(hideme);
    let blurmes = document.querySelectorAll('div[id^="blurme"]');
    for (let i = 0; i < blurmes.length; i++)
        blurmes[i].setAttribute('id', 'blurmenot' + i);
}

else if (matchDomain(de_madsack_domains)) {
    let paidcontent_intro = document.querySelector('div.pdb-article-body-paidcontentintro');
    if (paidcontent_intro) {
        paidcontent_intro.classList.remove('pdb-article-body-paidcontentintro');
        let json_script = document.querySelector('div.pdb-article > script[type="application/ld+json"]');
        let json_text = JSON.parse(json_script.text).articleBody;
        if (json_text) {
            let pdb_richtext_field = document.querySelectorAll('div.pdb-richtext-field');
            if (pdb_richtext_field[1])
                pdb_richtext_field[1].innerText = json_text;
        }
        let paidcontent_reg = document.querySelector('div.pdb-article-paidcontent-registration');
        removeDOMElement(paidcontent_reg);
    }
}

else if (matchDomain("elpais.com")) {
    let login_register = document.querySelector('.login_register');
    if (login_register) {
        let scripts = document.querySelectorAll('script');
        let json_script;
        for (let script of scripts) {
            if (script.innerText.includes('Fusion.globalContent'))
                json_script = script;
            continue;
        }
        if (json_script) {
            let json_text = json_script.innerHTML.split('Fusion.globalContent=')[1].split(';Fusion.globalContentConfig')[0];
            let json_article = JSON.parse(json_text).content_elements;
            let article_body_par = document.querySelector('div.article_body > p');
            if (article_body_par) {
                article_body_par.innerText = '';
                let parser = new DOMParser();
                let par_text, par_html;
                for (let par of json_article) {
                    par_html = parser.parseFromString('<div><p>' + par.content + '</p></br></div>', 'text/html');
                    par_text = par_html.querySelector('div');
                    if (par_text)
                        article_body_par.appendChild(par_text);
                }
            }
        }
        removeDOMElement(login_register);
    }
    let paywall_offer = document.querySelector('.paywallOffer');
    removeDOMElement(paywall_offer);
}

else if (matchDomain("slate.com")) {
    let slate_roadblock = document.querySelector('.slate-roadblock');
    let ads = document.querySelectorAll('section[class*="-ad"]');
    removeDOMElement(slate_roadblock, ...ads);
}

else if (matchDomain(["ilrestodelcarlino.it", "quotidiano.net"])) {
    let detail_text_truncated = document.querySelector('div.detail-text--truncated');
    let detail_page_paywall = document.querySelector('body.detail-page--paywall');
    if (detail_page_paywall) {
        removeDOMElement(detail_text_truncated);
        detail_page_paywall.classList.remove('detail-page--paywall');
    }
}

else if (matchDomain("nybooks.com")) {
    let paywall_article = document.querySelector('.paywall-article');
    if (paywall_article)
        paywall_article.classList.remove('paywall-article');
}

else if (matchDomain("thelogic.co")) {
    let article_subscribe = document.querySelector('.article-subscribe');
    removeDOMElement(article_subscribe);
}

else if (matchDomain("foreignaffairs.com")) {
    let paywall = document.querySelector('.paywall');
    let loading_indicator = document.querySelector('.loading-indicator');
    removeDOMElement(paywall, loading_indicator);
    let article_dropcap = document.querySelectorAll('.article-dropcap');
    for (let elem of article_dropcap)
        elem.classList.add('loaded');
    let hidden_images = document.querySelectorAll('img[src^="data:image/"]');
    for (let hidden_image of hidden_images) {
        var data_src = hidden_image.getAttribute("data-src");
        if (data_src) {
            hidden_image.setAttribute('src', data_src);
            hidden_image.removeAttribute('class');
        }
    }
    let img_list = document.querySelectorAll('.magazine-list-article img');
    for (let img_elem of img_list)
        img_elem.setAttribute('class', 'mb-4');
    if (window.location.href.includes('/interviews/')) {
        let img_header = document.querySelector('.interview-header > div');
        if (img_header) {
            let img_src = img_header.getAttribute("data-src");
            let img_elem = document.createElement('img');
            img_elem.src = img_src;
            img_header.appendChild(img_elem);
        }
    }
}

else if (matchDomain("kurier.at")) {
    let view_offer = document.querySelector('.view-offer');
    removeDOMElement(view_offer);
    let plus_content = document.querySelector('.plusContent');
    if (plus_content)
        plus_content.classList.remove('plusContent');
}

else if (matchDomain('gelocal.it')) {
    let premium = document.querySelector('.paywall-adagio');
    let url = window.location.href;
    window.setTimeout(function () {
        if (premium && !url.includes('/amp/')) {
            if (url.includes('?'))
                window.location.href = url.replace('?', '/amp/?');
            else
                window.location.href = url + '/amp/';
        }
    }, 500); // Delay (in milliseconds)
    if (url.includes('/amp/')) {
        let paywall = document.querySelector('div[amp-access="showContent"]');
        if (paywall)
           paywall.removeAttribute('amp-access-hide');
    }
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(...amp_ads);
}

else if (matchDomain("gva.be")) {
    document.addEventListener('DOMContentLoaded', () => {
        let paywall = document.querySelector('div[data-cj-root="subscription-wall"]');
        removeDOMElement(paywall);
        if (paywall) {
            let main_content = document.querySelector('div[data-mht-block="article-detail__article-main"]');
            let json_script = main_content.querySelector('script');
            let json_str = json_script.text.substring(json_script.textContent.indexOf('{'));
            let json = JSON.parse(json_str);
            let premium = Object.values(json)[0]['premium'];
            if (json) {
                let json_text = Object.values(json)[0]['body']['json'];
                let parser = new DOMParser();
                let div_content = main_content.querySelector('div');
                div_content.setAttribute('class', 'gva-6c6ea21_marginbottom5 gva-28c280e9_contentwrapper');
                let par_elem, par_key, par_li, par_html;
                let head = document.querySelector('head');
                let streamone = false;
                let flourish = false;
                for (let par of json_text) {
                    for (let key in par) {
                        par_elem = document.createElement('p');
                        par_key = par[key];
                        if (['p', 'subhead'].includes(key)) {
                            if (par_key.includes('<')) {
                                par_html = parser.parseFromString('<p>' + par_key + '</p>', 'text/html');
                                par_elem = par_html.querySelector('p');
                            } else
                                par_elem.innerText = par_key;
                            if (key === 'subhead')
                                par_elem.setAttribute('style', 'font-weight: bold;');
                        } else if (key === 'image') {
                            par_elem = document.createElement("img");
                            par_elem.src = par_key.url;
                        } else if (key === 'bullet_list') {
                            par_elem = document.createElement('ul');
                            for (let bullet of par_key) {
                                par_html = parser.parseFromString('<li>' + bullet + '</li>', 'text/html');
                                par_li = par_html.querySelector('li');
                                let bullet_link = par_li.querySelector('a');
                                if (bullet_link && bullet_link.href && !bullet_link.innerText)
                                    bullet_link.innerText = bullet_link.href;
                                par_elem.appendChild(par_li);
                            }
                        }
                        else if (key === 'streamone') {
                            if (!streamone) {
                                let streamone_script = document.createElement('script');
                                streamone_script.setAttribute('src', "https://shared.mediahuis.be/videoplayers/mediahuis/video-theoplayer.js?v=20201111T131002");
                                streamone_script.setAttribute('defer', true);
                                streamone_script.setAttribute('crossorigin', 'anonymous');
                                if (head)
                                    head.appendChild(streamone_script);
                                streamone = true;
                            }
                            par_html = parser.parseFromString('<div id="json_id"><div class="gva-6c6ea21_marginbottom5 gva-28c280e9_contentwrapper"><div class="gva-6c6ea21_marginbottom4"><div class="gva-6c6ea21_marginbottom0"><div class="gva-e5b9f66a_root" data-testid="embed-video"><svg class="gva-e5b9f66a_placeholder" viewBox="0 0 16 9" aria-hidden="true"></svg><div><div id="video-player-' + par_key.id + '" style="width:100%;" data-video-embed-id="' + par_key.id + '" data-video-target-id="video-player-' + par_key.id + '" data-video-brand="gva" class="js-theoplayer-placeholder"></div></div></div></div></div>', 'text/html');
                            par_elem = par_html.querySelector('div');
                        } else if (key === 'legacy-ml') {
                            par_html = parser.parseFromString(par_key, 'text/html');
                            par_elem = par_html.querySelector('div');
                            if (!flourish && par_key.includes('flourish.studio')) {
                                let flourish_script = document.createElement('script');
                                flourish_script.setAttribute('src', "https://public.flourish.studio/resources/embed.js");
                                if (head)
                                    head.appendChild(flourish_script);
                                flourish = true;
                            }
                        } else {
                            console.log(key + ': ' + par_key);
                            par_html = parser.parseFromString('<p>' + par_key + '</p>', 'text/html');
                            par_elem = par_html.querySelector('p');
                        }
                        if (!['streamone', 'legacy-ml'].includes(key))
                            par_elem.setAttribute('class', 'gva-3ee037ad_root gva-3ee037ad_paragraph gva-68d24f7d_none gva-ef7ba41a_system gva-6c6ea21_marginbottom5 gva-6c6ea21_margintop0 gva-21a3e72f_inherit');
                        div_content.appendChild(par_elem);
                    }
                }
            }
        }
    });
    window.setTimeout(function () {
        let overlay = document.querySelector('div.cj-root');
        removeDOMElement(overlay);
        let noscroll = document.querySelector('html.is-dialog-active');
        if (noscroll)
            noscroll.classList.remove('is-dialog-active');
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain('deutsche-wirtschafts-nachrichten.de')) {
    window.setTimeout(function () {
        let hardpay = document.querySelector('.hardpay');
        if (hardpay) {
            window.location.reload(true);
        }
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("alternatives-economiques.fr")) {
    window.setTimeout(function () {
        let paywall = document.querySelector('#temp-paywall');
        removeDOMElement(paywall);
        let data_ae_poool = document.querySelector('div[data-ae-poool]');
        if (data_ae_poool)
            data_ae_poool.removeAttribute('style');
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain("hs.fi")) {
    let url = window.location.href;
    if (!url.includes('https://dynamic.hs.fi')) {
        let iframe = document.querySelector('iframe[src^="https://dynamic.hs.fi/a/"]');
        if (iframe && url.includes('.html')) {
            window.setTimeout(function () {
                window.location.href = iframe.src;
            }, 500); // Delay (in milliseconds)
        }
        csDone = true;
    } else {
        let paywall = document.querySelector('.paywall-container');
        if (paywall) {
            let scripts = document.querySelectorAll('script');
            let json_script;
            for (let script of scripts) {
                if (script.innerText.includes('window.__NUXT__='))
                    json_script = script;
                continue;
            }
            let json_text = json_script.innerHTML.replace(/\r\n/g, '').split('amlData:[')[1].split('metaData')[0].split('paywallComponents:[')[1].slice(0, -4);
            let main = document.querySelector('main');
            if (main) {
                let pars = json_text.split('{type:');
                let type, value, slides, src, elem, img, caption, caption_text, par_html, par_text;
                let parser = new DOMParser();
                for (let par of pars) {
                    type = par.split(',')[0];
                    if (type === 'i') { // text
                        value = par.split('value:')[1].split('}')[0];
                        par_html = parser.parseFromString('<p>' + value + '</p>', 'text/html');
                        elem = par_html.querySelector('p');
                        elem.setAttribute('class', 'article-body px-16 mb-24');
                        main.appendChild(elem);
                    } else if (type === 'j') { // quote
                        value = par.split('text:')[1].split(',position:')[0];
                        par_html = parser.parseFromString('<p>' + value + '</p>', 'text/html');
                        elem = par_html.querySelector('p');
                        elem.setAttribute('class', 'article-body px-16 mb-24');
                        elem.setAttribute('style', 'font-style: italic;');
                        main.appendChild(elem);
                    } else if (type === 'h') { // image
                        src = par.split('src:"')[1].split('",')[0];
                        elem = document.createElement('p');
                        elem.setAttribute('class', 'article-body px-16 mb-24');
                        img = document.createElement('img');
                        img.setAttribute('src', 'https://arkku.mediadelivery.fi/img/468/' + src);
                        img.setAttribute('style', 'width:468px !important');
                        elem.appendChild(img);
                        caption = document.createElement('figcaption');
                        caption_text = par.split('caption:')[1].split(',credits:')[0];
                        if (caption_text.length)
                            caption_text = caption_text.slice(1, caption_text.length - 1);
                        caption.innerText = caption_text;
                        elem.appendChild(caption);
                        main.appendChild(elem);
                    } else if (type === 'r') { // slides
                        slides = par.split('src:');
                        for (let slide of slides) {
                            if (slide.includes('.jpg')) {
                                src = slide.split(',')[0].replace(/"/g, '');
                                elem = document.createElement('p');
                                elem.setAttribute('class', 'article-body px-16 mb-24');
                                img = document.createElement('img');
                                img.setAttribute('src', 'https://arkku.mediadelivery.fi/img/468/' + src);
                                img.setAttribute('style', 'width:468px !important');
                                elem.appendChild(img);
                                caption = document.createElement('figcaption');
                                caption_text = slide.split('text:')[1].split(',"text-style"')[0];
                                if (caption_text.length)
                                    caption_text = caption_text.slice(1, caption_text.length - 1);
                                caption.innerText = caption_text;
                                elem.appendChild(caption);
                                main.appendChild(elem);
                            }
                        }
                    } else
                        false; //console.log('type: ' + type + ' par: ' + par);
                }
                main.appendChild(document.createElement('br'));
            }
            removeDOMElement(paywall);
            csDone = true;
        }
    }
}

else if (matchDomain("latercera.com")) {
    let subscr_banner = document.querySelector('.empty');
    removeDOMElement(subscr_banner);
}

else if (matchDomain(es_grupo_vocento_domains)) {
    let url = window.location.href;
    let content_exclusive_bg = document.querySelector('.content-exclusive-bg, #cierre_suscripcion');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (content_exclusive_bg && amphtml) {
        window.setTimeout(function () {
            window.location.href = url.replace('.html', '_amp.html');
        }, 500); // Delay (in milliseconds)
    } else if (url.includes('_amp.html')) {
        let voc_advers = document.querySelectorAll('.voc-adver, amp-embed');
        removeDOMElement(...voc_advers);
        let container_wall_exclusive = document.querySelector('.container-wall-exclusive');
        if (container_wall_exclusive) {
            let non_subscr_section = document.querySelector('[amp-access="result!=\'ALLOW_ACCESS\'"]');
            removeDOMElement(container_wall_exclusive, non_subscr_section);
            let subscr_section = document.querySelector('[amp-access="result=\'ALLOW_ACCESS\'"]');
            if (subscr_section)
                subscr_section.removeAttribute('amp-access-hide');
        }
        //lavozdigital.es
        let paywall = document.querySelector('span[subscriptions-section="content"]');
        if (paywall) {
            paywall.classList.remove('paywall');
            paywall.removeAttribute('subscriptions-section');
        }
    }
}

else if (matchDomain("corriere.it")) {
    let url = window.location.href;
    if (url.includes('_preview.shtml')) {
        window.setTimeout(function () {
            window.location.href = url.replace('_preview.shtml', '.shtml').split('?')[0];
        }, 500); // Delay (in milliseconds)
    }
}

else if (matchDomain("elperiodico.com")) {
    let url = window.location.href;
    if (!url.includes('amp.elperiodico.com')) {
        let paywall = document.querySelector('.ep-masPeriodico-info-login');
        if (paywall) {
            window.setTimeout(function () {
                window.location.href = url.replace('www.', 'amp.');
            }, 500); // Delay (in milliseconds)
        }
    } else {
        let not_logged = document.querySelector('.ep-masPeriodico-info-login');
        if (not_logged) {
            let non_subscr_section = document.querySelector('div[amp-access="NOT logged"]');
            removeDOMElement(not_logged, non_subscr_section);
            let subscr_section = document.querySelector('div[amp-access="logged"]');
            if (subscr_section)
                subscr_section.removeAttribute('amp-access-hide');
            csDone = true;
        }
    }
}

else if (matchDomain('la-croix.com')) {
    let url = window.location.href;
    if (!url.includes('la-croix.com/amp/')) {
        let paywall_host_param = document.querySelector('#paywall-host-param');
        removeDOMElement(paywall_host_param);
        if (paywall_host_param)
            csDone = true;
    } else {
        let paywall_block = document.querySelector('#paywall_block');
        let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
        removeDOMElement(paywall_block, ...amp_ads);
    }
}

else if (matchDomain('lasegunda.com')) {
    let url = window.location.href;
    if (url.includes('digital.lasegunda.com/mobile')) {
        let lessreadmore = document.querySelectorAll('article.lessreadmore');
        for (let article of lessreadmore)
            article.classList.remove('lessreadmore');
        let bt_readmore = document.querySelectorAll('div[id*="bt_readmore_"]');
        removeDOMElement(...bt_readmore);
    }
}

else if (matchDomain("telegraph.co.uk")) {
    let url = window.location.href;
    if (new URL(url).pathname.endsWith('/amp/')) {
        let paywall = document.querySelector('.premium-paywall');
        if (paywall) {
            let truncated_content = document.querySelector('.truncated-content');
            removeDOMElement(paywall, truncated_content);
            let subscr_section = document.querySelector('.notAccessibleForFree');
            if (subscr_section)
                subscr_section.removeAttribute('amp-access-hide');
        }
    }
}

else if (matchDomain('esprit.presse.fr')) {
    let paywall = document.querySelector('.panel-popup-paywall');
    removeDOMElement(paywall);
}

else if ((domain = matchDomain(fr_groupe_ebra_domains)) && window.location.href.match(/\/\d{4}\/\d{2}\/\d{2}\//)) {
    let url = window.location.href;
    let url_new = url.replace(domain + '/', domain + '/amp/');
    if (!url.includes(domain + '/amp/')) {
        let free = document.querySelector('[class^="paywall"]');
        if (!free) {
            window.setTimeout(function () {
                window.location.href = url_new;
            }, 500); // Delay (in milliseconds)
        }
    } else {
        let amp_access_hide = document.querySelector('[amp-access-hide]');
        if (amp_access_hide) {
            let not_access_section = document.querySelector('section[amp-access="NOT access"]');
            removeDOMElement(not_access_section);
            amp_access_hide.removeAttribute('amp-access-hide');
        }
        let amp_ads = document.querySelectorAll('amp-ad');
        removeDOMElement(...amp_ads);
    }
}

else if (matchDomain(de_funke_media_domains)) {
    let obfuscated_elems = document.querySelectorAll('.obfuscated');
    let parser = new DOMParser();
    for (let obfuscated_elem of obfuscated_elems) {
        let html = parser.parseFromString('<div>' + deobfuscateFUNKE(obfuscated_elem.innerText) + '</div>', 'text/html');
        let par = html.querySelector('div');
        obfuscated_elem.classList.remove('obfuscated');
        obfuscated_elem.innerHTML = '';
        obfuscated_elem.appendChild(par);
    }
}

else if (matchDomain('krautreporter.de')) {
    let paywall = document.querySelector('.article-paywall');
    if (paywall) {
        let paywall_divider = document.querySelector('.js-paywall-divider');
        let steady_checkout = document.querySelector('#steady-checkout');
        removeDOMElement(paywall, paywall_divider, steady_checkout);
        let blurred = document.querySelectorAll('.blurred');
        for (let elem of blurred)
            elem.classList.remove('blurred', 'json-ld-paywall-marker', 'hidden@print');
    }
}

else if (matchDomain('nouvelobs.com')) {
    let paywall = document.querySelector('.paywall');
    removeDOMElement(paywall);
}

else if (matchDomain('freiepresse.de')) {
    let url = window.location.href;
    let article_teaser = document.querySelector('div.article-teaser');
    if (article_teaser && url.match(/(\-artikel)(\d){6,}/)) {
        window.setTimeout(function () {
            window.location.href = url.replace('-artikel', '-amp');
        }, 500); // Delay (in milliseconds)
    } else if (url.match(/(\-amp)(\d){6,}/)) {
        let amp_ads = document.querySelectorAll('amp-fx-flying-carpet, amp-ad, amp-embed');
        let pw_layer = document.querySelector('.pw-layer');
        removeDOMElement(...amp_ads, pw_layer);
    }
}

else if (matchDomain('seekingalpha.com')) {
    let url = window.location.href;
    let locked = document.querySelector('div[data-test-id="post-locked-banner"]');
    if (locked && !url.includes('/amp/')) {
        window.setTimeout(function () {
            window.location.href = url.replace('seekingalpha.com/', 'seekingalpha.com/amp/');
        }, 500); // Delay (in milliseconds)
    } else if (url.includes('/amp/')) {
        let div_hidden_all = document.querySelectorAll('div[amp-access="premium OR proplus"]');
        for (let div_hidden of div_hidden_all)
            div_hidden.removeAttribute('amp-access-hide');
        let adverts = document.querySelectorAll('.ad-wrap');
        removeDOMElement(...adverts);
    }
}

else if (matchDomain('newleftreview.org')) {
    let url = window.location.href;
    let paywall = document.querySelector('div.promo-wrapper');
    if (paywall) {
        let proxyurl = 'https://cors-anywhere.herokuapp.com/';
        let nlr_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url.split('//')[1];
        fetch(proxyurl + nlr_cache, { headers: {"Content-Type": "text/plain", "X-Requested-With": "XMLHttpRequest" } })
        .then(response => {
            let article_old = document.querySelector('div.article-page');
            let footer = document.querySelector('div.article-footer');
            if (response.ok) {
                response.text().then(html => {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');
                    let json = doc.querySelector('div.article-page');
                    if (json) {
                        if (article_old && footer) {
                            removeDOMElement(article_old);
                            footer.parentElement.insertBefore(json, footer);
                        }
                    }
                });
            } else {
                if (article_old && footer)
                    article_old.appendChild(document.createTextNode('Article not yet in Google webcache ...'));
            }
        });
        removeDOMElement(paywall);
    }
}

else if (matchDomain('lavanguardia.com')) {
    let paywall = document.querySelector('[class*="ev-open-modal-paywall"]');
    let infinite_loading = document.querySelector('#infinite-loading');
    removeDOMElement(paywall, infinite_loading);
}

else if (!matchDomain(['belfasttelegraph.co.uk', 'independent.ie']))
    csDone = true;

if (csDone)
    ext_api.runtime.sendMessage({csDone: true});

// General Functions
function removeDOMElement(...elements) {
    for (let element of elements) {
        if (element)
            element.remove();
    }
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

function removeClassesByPrefix(el, prefix) {
    let el_classes = el.classList;
    for (let el_class of el_classes) {
        if (el_class.startsWith(prefix)) {
            el_classes.remove(el_class);
        }
    }
}

function cookieExists(name) {
    return document.cookie.split(';').some(function(item) { return item.trim().indexOf(name + '=') === 0 })
}

function setCookie(name, value, domain, path, days) {
    var max_age = days * 24 * 60 * 60;
    document.cookie = name + "=" + (value || "") + "; domain=" + domain + "; path=" + path + "; max-age=" + max_age;
}

function insert_script(func, insertAfterDom) {
    let bpc_script = document.querySelector('script#bpc_script');
    if (!bpc_script) {
        let script = document.createElement('script');
        script.setAttribute('id', 'bpc_script');
        script.appendChild(document.createTextNode('(' + func + ')();'));
        let insertAfter = insertAfterDom ? insertAfterDom : (document.body || document.head || document.documentElement);
        insertAfter.appendChild(script);
    }
}

function genHexString(len) {
    let output = '';
    for (let i = 0; i < len; i++) {
        output += (Math.floor(Math.random() * 16)).toString(16);
    }
    return output;
}

function makeRandomNumber(len) {
    let result = '';
    var characters = '123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < len; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function pageContains(selector, text) {
    let elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function(element){
        return RegExp(text).test(element.textContent);
    });
}

function parseHtmlEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt|deg|hellip|laquo|raquo|ldquo|rdquo|lsquo|rsquo|mdash);/g;
    var translate = {"nbsp": " ", "amp": "&", "quot": "\"", "lt": "<", "gt": ">", "deg": "°", "hellip": "…",
        "laquo": "«", "raquo": "»", "ldquo": "“", "rdquo": "”", "lsquo": "‘", "rsquo": "’", "mdash": "—"};
    return encodedString.replace(translate_re, function (match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function (match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}

function deobfuscateFUNKE(str) {
    return str.replace(/[0-9A-ZÅÝÀµ×#@$²±:`^'´\\,{[/.÷;=?)*\-]/gi, c =>
        '012345678@ABCDEFGHIJKLMNOPQRSTUVWXYÄöÜẞZzabcdefghijklmnopqrstuvwxyäüößz,+.-:<>/()!"=[;9]&_?%#\''['123456789ABCDEFGHIJKLMNOPQRSTUVWXYZÅ×ÝÀ[abcdefghijklmnopqrstuvwxyzåý÷à{-,/.;=?0)*²#µ\\´:^\'`@±$'.indexOf(c)])
}
