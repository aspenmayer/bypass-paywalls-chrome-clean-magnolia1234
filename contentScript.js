// clean local storage of sites (with an exemption for hold-list)
var arr_localstorage_hold = ['sfchronicle.com'];
var localstorage_hold = arr_localstorage_hold.some(function(url) {
    return matchDomain(url);
});

if (!localstorage_hold){
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
    setTimeout(function () {
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
    setTimeout(function () {
        const paywall = document.getElementById('TEMPRORARY_METERING_ID');
        if (paywall) {
            window.location.reload(true);
        }
    }, 1000); // Delay (in milliseconds)
}

else if (matchDomain('ad.nl')) {
    let paywall = document.querySelector('.article__component.article__component--paywall-module-notification');
    removeDOMElement(paywall);
}

else if (matchDomain("washingtonpost.com")) {
    if (location.href.includes('/gdpr-consent/')) {
        const free_button = document.querySelector('.gdpr-consent-container .continue-btn.button.free');
        if (free_button)
            free_button.click();
        setTimeout(function () {
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

else if (matchDomain('lemonde.fr')) {
    document.addEventListener('DOMContentLoaded', () => {
        const hidden_section = document.querySelector('.article__content--restricted-media');
        if (hidden_section)
            hidden_section.classList.remove('article__content--restricted-media');
        const longform_article_restricted = document.querySelector('.article__content--restricted');
        if (longform_article_restricted)
            longform_article_restricted.classList.remove('article__content--restricted');
        const longform_paywall = document.querySelector('.paywall--longform');
        if (longform_paywall)
            longform_paywall.classList.remove('paywall--longform');
        const paywall = document.getElementById('js-paywall-content');
        const friend_paywall = document.querySelector('.friend--paywall');
        const cookie_banner = document.getElementById('cookie-banner');
        removeDOMElement(paywall, friend_paywall, cookie_banner);
    });
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
        const paywall = document.getElementById('test');
        removeDOMElement(paywall);
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
        setTimeout(function () {
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
        const p_hidden = document.querySelectorAll('p:not([style="display:block;"]');
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
    const ad_block = document.querySelectorAll('.jzxvkd-1');
    for (let i = 0; i < ad_block.length; i++) {
        ad_block[i].setAttribute('style', 'display:none');
    }
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
    document.addEventListener('DOMContentLoaded', () => {
        const hidden_section = document.querySelector('.article-full__body-content');
        if (hidden_section)
            hidden_section.classList.remove('article-full__body-content');
    });
}

// General Functions
function removeDOMElement(...elements) {
    for (let element of elements) {
        if (element)
            element.remove();
    }
}

function matchDomain(domains) {
    var hostname = window.location.hostname;
    if (typeof domains === 'string')
        domains = [domains];
    return domains.some(domain => hostname === domain || hostname.endsWith('.' + domain));
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
