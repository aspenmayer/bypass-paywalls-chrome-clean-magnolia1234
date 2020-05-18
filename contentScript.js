// clean local storage of sites (with an exemption for hold-list)
var arr_localstorage_hold = ['sfchronicle.com'];
if (!matchDomain(arr_localstorage_hold)){
    window.localStorage.clear();
}

// Content workarounds/domain

// Australian Community Media newspapers
if (window.location.hostname.endsWith(".com.au") || window.location.hostname.endsWith(".net.au")) {
    let au_sites = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au'];
    let au_piano_script = document.querySelector('script[src="https://cdn-au.piano.io/api/tinypass.min.js"]');
    if (matchDomain(au_sites) || au_piano_script) {
        const subscribe_truncate = document.querySelector('.subscribe-truncate');
        if (subscribe_truncate)
            subscribe_truncate.classList.remove('subscribe-truncate');
        const subscriber_hider = document.querySelectorAll('.subscriber-hider');
        for (let i = 0; i < subscriber_hider.length; i++) {
            subscriber_hider[i].classList.remove('subscriber-hider');
        }
    }
}

else if (matchDomain("thesaturdaypaper.com.au")) {
    const expand_button = document.querySelector('.continue-reading-button');
    if (expand_button)
        expand_button.click();
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
        let article_body_old = document.querySelector('[id^=articleBody]');
        removeDOMElement(article_body_old);
        let json = document.querySelector('script[type="application/ld+json"][data-react-helmet="true"]');
        if (json) {
            json_text = JSON.parse(json.text).articleBody;
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
    if (location.href.includes('/gdpr-consent/')) {
        const free_button = document.querySelector('.gdpr-consent-container .continue-btn.button.free');
        if (free_button)
            free_button.click();
        window.setTimeout(function () {
            const gdprcheckbox = document.querySelector('.gdpr-consent-container .consent-page:not(.hide) #agree');
            if (gdprcheckbox) {
                gdprcheckbox.checked = true;
                gdprcheckbox.dispatchEvent(new Event('change'));
                document.querySelector('.gdpr-consent-container .consent-page:not(.hide) .continue-btn.button.accept-consent').click();
            }
        }, 300); // Delay (in milliseconds)
    }
}

else if (matchDomain("wsj.com")) {
    if (location.href.includes('/articles/')) {
        const close_button = document.querySelector('.close-btn');
        if (close_button)
            close_button.click();
    }
    document.addEventListener('DOMContentLoaded', () => {
        let wsj_login = document.querySelector('.wsj-snippet-login');
        if (wsj_login && !window.location.hash) {
            let url = window.location.href;
            if (url.includes('?')) {
                window.location.href = url.replace('?', '#refreshed?');
            } else {
                window.location.href = url + '#refreshed';
            }
        }
    });
}

else if (matchDomain("sloanreview.mit.edu")) {
    const read_more = document.querySelector('.btn-read-more');
        if(read_more)
            read_more.click();
}

else if (matchDomain("mexiconewsdaily.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        const sideNotification = document.querySelector('.pigeon-widget-prompt');
        const subMessage = document.querySelector('.sub_message_container');
        const popup = document.querySelector('.popupally-pro-outer-full-width-7-fluid_qemskqa');
        const bgFocusRemoverId = document.getElementById('popup-box-pro-gfcr-7');
        removeDOMElement(sideNotification, subMessage, popup, bgFocusRemoverId);
    });
}

else if (matchDomain("the-american-interest.com")) {
  const counter = document.getElementById('article-counter');
  removeDOMElement(counter);
}

else if (matchDomain("nzherald.co.nz")) {
    const paywall = document.getElementById('article-content');
    if (paywall) {
        const premium = document.querySelector('.premium-sub');
        removeDOMElement(premium);
        paywall.classList.remove('premium-content');
        paywall.classList.add('full-content');
        removeClassesByPrefix(paywall, 'QUnW');
        let paras = paywall.querySelectorAll("p, span, h2, div");
        for (let i = 0; i < paras.length; i++){
            removeClassesByPrefix(paras[i], 'QUnW');
            paras[i].classList.remove("ellipsis");
            paras[i].removeAttribute('style');
        }
    }
}

else if (matchDomain(["parool.nl", "trouw.nl", "volkskrant.nl", "humo.be", "demorgen.be"])) {
    document.addEventListener('DOMContentLoaded', () => {
        const paywall = document.querySelector('div[data-temptation-position="ARTICLE_BOTTOM"]');
        const hidden_section = document.querySelector('div[data-temptation-position="ARTICLE_INLINE"]');
        removeDOMElement(paywall, hidden_section);
    });
}

else if (matchDomain("firstthings.com")) {
    const paywall = document.querySelector('.paywall');
    removeDOMElement(paywall);
}

else if (matchDomain("bloomberg.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        const fence = document.querySelector('.fence-body');
        if (fence){
            fence.classList.remove('fence-body');
        }
    });
    const banner = document.getElementById('paywall-banner');
    removeDOMElement(banner);
}

else if (matchDomain("bloombergquint.com")) {
    const articlesLeftModal = document.querySelector('.paywall-meter-module__story-paywall-container__1UgCE');
    const paywall = document.getElementById('paywallDmp');
    removeDOMElement(articlesLeftModal, paywall);
}

else if (matchDomain("medium.com")) {
    const bottomMessageText = 'Get one more story in your member preview when you sign up. It’s free.';
    const DOMElementsToTextDiv = pageContains('div', bottomMessageText);
    if (DOMElementsToTextDiv[2]) removeDOMElement(DOMElementsToTextDiv[2]);
}

else if (matchDomain("ledevoir.com")) {
        const counter = document.querySelector('.popup-msg');
        removeDOMElement(counter);
}

else if (matchDomain('ft.com')) {
    const cookie_banner = document.querySelector('.n-messaging-banner__outer');
    removeDOMElement(cookie_banner);
}

else if (matchDomain("thehindu.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        let paywall = document.querySelector('body.articlepaywall');
        if (paywall)
            window.location.reload(true);
        let banner = document.querySelector('.co-bannerparent');
        removeDOMElement(banner);
    });
}

else if (matchDomain("nytimes.com")) {
    const preview_button = document.querySelector('.css-3s1ce0');
    if (preview_button)
        preview_button.click();
}

else if (matchDomain("economist.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        const subscribe = document.querySelector('.subscription-proposition');
        const advert = document.querySelector('.advert');
        const wrapper = document.getElementById('bottom-page-wrapper');
        removeDOMElement(subscribe, advert, wrapper);
        window.setTimeout(function () {
            const paywall = document.querySelector('.layout-article-regwall'); ;
            if (paywall) {
                window.location.reload(true);
            }
        }, 600); // Delay (in milliseconds)
        const p_article = document.querySelectorAll('p.article__body-text');
        var href;
        for (let i = 0; i < p_article.length; i++) {
            const anchor = document.querySelectorAll('a');
            href = '';
            for (let j = 0; j < anchor.length; j++) {
                if (anchor[j].href) {
                    href = anchor[j].href;
                } else {
                    anchor[j].href = href;
                }
            }
        }
    });
}

else if (matchDomain("bizjournals.com")) {
        const sheet_overlay = document.querySelector('.sheet-overlay');
        const chunk_paywall = document.querySelector('.chunk--paywall');
        removeDOMElement(sheet_overlay, chunk_paywall);
        const overlaid = document.querySelectorAll('.is-overlaid');
        for (let i = 0; i < overlaid.length; i++) {
            overlaid[i].classList.remove('is-overlaid');
        }
        const body_hidden = document.querySelector('.js-pre-chunks__story-body');
        body_hidden.removeAttribute('style');
}

else if (matchDomain("the-tls.co.uk")) {
        const paywall = document.querySelector('.tls-subscriptions-banner__closed-skin');
        removeDOMElement(paywall);
}

else if (matchDomain("caixinglobal.com")) {
    const pay_tip = document.querySelectorAll('.cons-pay-tip');
    for (let i = 0; i < pay_tip.length; i++) {
        pay_tip[i].removeAttribute('style');
    }
    const appContent = document.getElementById('appContent');
    if (appContent) {
        const p_hidden = document.querySelectorAll('p:not([style="display:block;"])');
        for (let i = 0; i < p_hidden.length; i++) {
            p_hidden[i].setAttribute('style', 'display:block;');
        }
    }
}

else if (matchDomain("nrc.nl")) {
    const paywall = document.querySelector('.has-paywall');
    if (paywall)
        paywall.classList.remove("has-paywall");
    const paywall_overlay = document.querySelector('.has-paywall-overlay');
    if (paywall_overlay)
        paywall_overlay.classList.remove("has-paywall-overlay");
}

else if (matchDomain("scribd.com")) {
    const blur = document.querySelectorAll('.blurred_page');
    for (let i = 0; i < blur.length; i++) {
        blur[i].classList.remove('blurred_page');
    }
    const portal = document.querySelector('.between_page_portal_root');
    const page_module = document.querySelector('.between_page_module');
    const promo = document.querySelector('.auto__doc_page_webpack_doc_page_body_static_promo_study');
    const ad = document.querySelector('.auto__explain_scribd_v2_advertisement');
    removeDOMElement(portal, page_module, promo, ad);
}

else if (matchDomain("thetimes.co.uk")) {
    const block = document.querySelector('.subscription-block');
    const ad_block = document.getElementById('ad-article-inline')
    const ad_header = document.getElementById('sticky-ad-header')
    removeDOMElement(block, ad_block, ad_header);
}

else if (matchDomain("technologyreview.com")) {
    const read_story = document.querySelector('.storyExpanderButton');
    if (read_story)
        read_story.click();
    const meter = document.querySelector('.meter');
    removeDOMElement(meter);
}

else if (matchDomain("haaretz.com")) {
    const popup = document.querySelector('.footer-ruler');
    removeDOMElement(popup);
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
    const paywall = document.querySelector('.paywall-content');
    if (paywall){
        paywall.classList.remove('paywall-content');
    }
    const splash_subscribe = document.querySelector('.splash-subscribe');
    const paywall_hard = document.querySelector('.paywall-hard');
    removeDOMElement(splash_subscribe, paywall_hard);
}

else if (matchDomain("thestar.com")) {
    const paywall = document.querySelector('.basic-paywall-new');
    removeDOMElement(paywall);
    const tbc = document.querySelectorAll('.text-block-container');
    for (let i = 0; i < tbc.length; i++) {
        tbc[i].removeAttribute('style');
    }
}

else if (matchDomain("afr.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        const hidden_image = document.querySelectorAll('img');
        for (let i = 0; i < hidden_image.length; i++) {
            var src = hidden_image[i].src;
            if (src.includes(".gif")) {
                var data_src = hidden_image[i].getAttribute("data-src");
                if (data_src)
                    hidden_image[i].setAttribute('src', data_src);
            }
        }
        const plista = document.querySelector('div[data-plista-placement="underArticle_Group"]');
        removeDOMElement(plista);
    });
}

else if (matchDomain("theglobeandmail.com")) {
  document.addEventListener('DOMContentLoaded', () => {
        const lazy_image = document.querySelectorAll('.js-lazyimage');
        for (let i = 0; i < lazy_image.length; i++) {
            lazy_image[i].classList.remove('js-lazyimage');
        }
        const hidden_image = document.querySelectorAll('img');
        for (let i = 0; i < hidden_image.length; i++) {
            var src = hidden_image[i].src;
            if (src.includes("data:image/gif")) {
                var data_src = hidden_image[i].getAttribute("data-src");
                if (data_src)
                    hidden_image[i].setAttribute('src', data_src);
                var data_bg = hidden_image[i].getAttribute("data-bg");
                if (data_bg)
                    hidden_image[i].setAttribute('src', data_bg);
            }
        }
    });
}

else if (matchDomain("sofrep.com")) {
    const banner = document.getElementById('scrollerCTA');
    removeDOMElement(banner);
}

else if (matchDomain(["theathletic.com", "theathletic.co.uk"])) {
    const landing_banner = document.querySelector('.logged-out-landing-banner');
    const sample_banner = document.querySelector('.main-sample-banner');
    const bottom_banner = document.querySelector('.border-bottom-cc');
    const subscribe = document.querySelector('.subscribe-ad-text');
    removeDOMElement(landing_banner, sample_banner, bottom_banner, subscribe);
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

else if (matchDomain("lesechos.fr")) {
    window.setTimeout(function () {
        const url = window.location.href;
        const html = document.documentElement.outerHTML;
        // refresh cache
        if (!window.location.hash) {
            window.location.href = url + '#loaded'
        }
        const split1 = html.split('window.__PRELOADED_STATE__')[1];
        const split2 = split1.split('</script>')[0].trim();
        const state = split2.substr(1, split2.length - 2);
        try {
            const data = JSON.parse(state);
            const article = data.article.data.stripes[0].mainContent[0].data.description;
            const paywallNode = document.querySelector('.post-paywall');
            if (paywallNode) {
                const contentNode = document.createElement('div');
                contentNode.innerHTML = article;
                contentNode.className = paywallNode.className;
                paywallNode.parentNode.insertBefore(contentNode, paywallNode);
                removeDOMElement(paywallNode);
                const paywallLastChildNode = document.querySelector('.post-paywall  > :last-child');
                if (paywallLastChildNode) {
                    paywallLastChildNode.setAttribute('style', 'height: auto !important; overflow: hidden !important; max-height: none !important;');
                }
            }
        } catch (err) {
            console.warn('unable to parse lesechos text');
            console.warn(err);
        }
        const ad_block = document.querySelectorAll('.jzxvkd-1');
        for (let i = 0; i < ad_block.length; i++) {
            ad_block[i].setAttribute('style', 'display:none');
        }
        const abo_banner = document.querySelector('[class^=pgxf3b]');
        removeDOMElement(abo_banner);
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain(["lc.nl", "dvhn.nl"])) {
    document.addEventListener('DOMContentLoaded', () => {
        var new_location = window.location.href;
        if (new_location.includes("utm_source="))
            var new_location = new_location.split('?')[0];
        const preview = document.querySelector('.preview');
        if (preview && new_location.indexOf("harvest_referrer=") === -1)
            window.location.href = new_location + '?harvest_referrer=https%3A%2F%2Fnos.nl%2Fplus.html';
    });
}

else if (matchDomain("newyorker.com")) {
    const paywall_bar = document.querySelector('.paywall-bar');
    removeDOMElement(paywall_bar);
}

else if (matchDomain("americanaffairsjournal.org")) {
    const paywall_bar = document.querySelector('.paywall-notification-bar-wrapper');
    removeDOMElement(paywall_bar);
}

else if (matchDomain('ladepeche.fr')) {
    window.setTimeout(function () {
        const hidden_section = document.querySelector('.article-full__body-content');
        if (hidden_section) {
            hidden_section.classList.remove('article-full__body-content');
            let paras = hidden_section.querySelectorAll("p, h2, div");
            for (let i = 0; i < paras.length; i++) {
                paras[i].removeAttribute('style');
            }
        }
        const abon = document.querySelector('#noscript-paywall-content, #noscript-paywall');
        removeDOMElement(abon);
    }, 500); // Delay (in milliseconds)
}

else if (matchDomain('challenges.fr')) {
    document.addEventListener('DOMContentLoaded', () => {
        const amorce = document.querySelector('.user-paying-amorce');
        if (amorce)
            amorce.setAttribute('style', 'display:none !important');
        const content = document.querySelector('.user-paying-content');
        if (content)
            content.setAttribute('style', 'display: block !important');
        const paywall = document.querySelector('.temp-paywall');
        removeDOMElement(paywall);
    });
}

else if (matchDomain('barrons.com')) {
    var href = '';
    const signin_links = document.querySelectorAll('a.primary-button--link');
    for (let i = 0; i < signin_links.length; i++) {
        href = signin_links[i].href;
        if (href.includes('target=')) {
            href = href.split('target')[1].split('%3F')[0];
            href = href.replace('=', '').replace('%3A', ':');
            href = href.replace('%2F', '/').replace('%2F', '/').replace('%2F', '/').replace('%2F', '/');
            signin_links[i].href = href;
            signin_links[i].text = 'Click';
        }
    }
}

else if (matchDomain('lescienze.it')) {
    const paywall = document.querySelector('.paywall-adagio');
    const body_paywall = document.getElementById('detail-body-paywall');
    const shade = document.querySelector('.shade');
    removeDOMElement(paywall, body_paywall, shade);
    const hidden_body = document.querySelectorAll('.detail_body');
    for (let i = 0; i < hidden_body.length; i++) {
        hidden_body[i].removeAttribute('hidden');
        hidden_body[i].setAttribute('style', 'display:block; max-height:auto; overflow:visible');
    }
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
                        var json_text = JSON.parse(json.text).ArticleBody;
                        let article_text = document.querySelector('.art_txt.paywall,.atc-Text.js-atc-Text');
                        article_text.innerText = '';

                        const breakText = (str) => {
                            str = str.replace(/(?:^|[\w\"\“])(\.|\?|!)(?=[A-Za-zÀ-ÿ\„]{2,})/gm, "$&\n\n");
                            str = str.replace(/([a-z\"\“])(?=[A-Z](?=[A-Za-zÀ-ÿ]+))/gm, "$&\n\n");
                            // exceptions: names with alternating lower/uppercase (no general fix)
                            str = str.replace(/Glaxo\n\nSmith\n\nKline/g, "GlaxoSmithKline");
                            str = str.replace(/Eu\n\nGH/g, "EuGH");
                            str = str.replace(/If\n\nSG/g, "IfSG");
                            str = str.replace(/La\n\nPierre/g, "LaPierre");
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
    let messagebox = document.querySelector('.messagebox');
    removeDOMElement(messagebox);
    let overlay = document.querySelector('.semi-disruptive-overlay__closebtn');
    if (overlay) {
        overlay.click();
    }
}

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
    for (let i = 0; i < el.classList.length; i++){
        if (el.classList[i].startsWith(prefix)) {
            el.classList.remove(el.classList[i]);
        }
    }
}

function pageContains(selector, text) {
    let elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function(element){
        return RegExp(text).test(element.textContent);
    });
}
