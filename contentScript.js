// clean local storage of sites (with an exemption for hold-list)
var arr_localstorage_hold = ['inkl.com', 'seekingalpha.com', 'sfchronicle.com'];
if (!matchDomain(arr_localstorage_hold)){
    window.localStorage.clear();
}

// Content workarounds/domain

// Australian Community Media newspapers
if (window.location.hostname.endsWith(".com.au") || window.location.hostname.endsWith(".net.au")) {
    let au_sites = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
    let au_piano_script = document.querySelector('script[src="https://cdn-au.piano.io/api/tinypass.min.js"]');
    if (matchDomain(au_sites) || au_piano_script) {
        const subscribe_truncate = document.querySelector('.subscribe-truncate');
        if (subscribe_truncate)
            subscribe_truncate.classList.remove('subscribe-truncate');
        const subscriber_hiders = document.querySelectorAll('.subscriber-hider');
        for (let subscriber_hider of subscriber_hiders) {
            subscriber_hider.classList.remove('subscriber-hider');
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
    removeDOMElement(leaderboard);
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
}

else if (matchDomain("wsj.com")) {
    if (location.href.includes('/articles/')) {
        const close_button = document.querySelector('div.close-btn[role="button"]');
        if (close_button)
            close_button.click();
    }
    document.addEventListener('DOMContentLoaded', () => {
        let url = window.location.href;
        let snippet = document.querySelector('.snippet-promotion');
        let wsj_pro = document.querySelector('meta[name="page.site"][content="wsjpro"]');
        if (snippet || wsj_pro) {
            if (!window.location.hash) {
                if (url.includes('?')) {
                    window.location.href = url.replace('?', '#refreshed?');
                } else
                    window.location.href = url + '#refreshed';
            } else
                window.location.href = window.location.href.replace('wsj.com', 'wsj.com/amp').replace('#refreshed', '');
        }
    });
}

else if (matchDomain("sloanreview.mit.edu")) {
    const read_more = document.querySelector('.btn-read-more');
    if (read_more)
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
    let article_content = document.getElementById('article-content');
    if (article_content) {
        let premium = document.querySelector('.premium-sub');
        removeDOMElement(premium);
        article_content.classList.remove('premium-content');
        article_content.classList.add('full-content');
        removeClassesByPrefix(article_content, 'QUnW');
        let elems = article_content.querySelectorAll("p, span, h2, div");
        for (let elem of elems){
            removeClassesByPrefix(elem, 'QUnW');
            elem.classList.remove("ellipsis");
            elem.removeAttribute('style');
        }
    }
}

else if (matchDomain(["parool.nl", "trouw.nl", "volkskrant.nl", "humo.be", "demorgen.be"])) {
    document.addEventListener('DOMContentLoaded', () => {
        let top_banner = document.querySelector('div[data-temptation-position="PAGE_TOP"]');
        let paywall = document.querySelector('div[data-temptation-position="ARTICLE_BOTTOM"]');
        let hidden_section = document.querySelector('div[data-temptation-position="ARTICLE_INLINE"]');
        let overlay = document.querySelector('div[data-temptation-position="PAGE_BOTTOM"]');
        removeDOMElement(top_banner, paywall, hidden_section, overlay);
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

else if (matchDomain(["medium.com", "towardsdatascience.com"])) {
    let meter = document.querySelector('#lo-highlight-meter-1-highlight-box');
    removeDOMElement(meter);
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

else if (matchDomain("thehindu.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        let counter = document.querySelector('#test');
        let co_banner = document.querySelector('.co-banner');
        let support = document.querySelector('div.support-jlm');
        removeDOMElement(counter, co_banner, support);
    });
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
}

else if (matchDomain("economist.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        const subscribe = document.querySelector('.subscription-proposition');
        const wrapper = document.getElementById('bottom-page-wrapper');
        removeDOMElement(subscribe, wrapper);
        const adverts = document.querySelectorAll('.advert');
        for (let advert of adverts)
            removeDOMElement(advert);
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

else if (matchDomain("bizjournals.com")) {
        const sheet_overlay = document.querySelector('.sheet-overlay');
        const chunk_paywall = document.querySelector('.chunk--paywall');
        removeDOMElement(sheet_overlay, chunk_paywall);
        const overlaids = document.querySelectorAll('.is-overlaid');
        for (let overlaid of overlaids) {
            overlaid.classList.remove('is-overlaid');
        }
        const body_hidden = document.querySelector('.js-pre-chunks__story-body');
        body_hidden.removeAttribute('style');
}

else if (matchDomain("the-tls.co.uk")) {
        const paywall = document.querySelector('.tls-subscriptions-banner__closed-skin');
        removeDOMElement(paywall);
}

else if (matchDomain("caixinglobal.com")) {
    let pay_tips = document.querySelectorAll('.cons-pay-tip');
    for (let pay_tip of pay_tips) {
        pay_tip.removeAttribute('style');
    }
    let appContent = document.getElementById('appContent');
    if (appContent) {
        let hidden_pars = document.querySelectorAll('p:not([style="display:block;"])');
        for (let hidden_par of hidden_pars) {
            hidden_par.setAttribute('style', 'display:block;');
        }
    }
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
    const read_story = document.querySelector('.storyExpanderButton');
    if (read_story)
        read_story.click();
    const meter = document.querySelector('.meter');
    removeDOMElement(meter);
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
    let paywall = document.querySelector('.basic-paywall-new');
    removeDOMElement(paywall);
    let tbcs = document.querySelectorAll('.text-block-container');
    for (let tbc of tbcs) {
        tbc.removeAttribute('style');
    }
}

else if (matchDomain("afr.com")) {
    document.addEventListener('DOMContentLoaded', () => {
        let hidden_images = document.querySelectorAll('img');
        for (let hidden_image of hidden_images) {
            var src = hidden_image.src;
            if (src.includes(".gif")) {
                var data_src = hidden_image.getAttribute("data-src");
                if (data_src)
                    hidden_image.setAttribute('src', data_src);
            }
        }
        let plista = document.querySelector('div[data-plista-placement="underArticle_Group"]');
        removeDOMElement(plista);
    });
}

else if (matchDomain("theglobeandmail.com")) {
    document.addEventListener('DOMContentLoaded', () => {
    let subscribed = document.querySelector('html.story-subscribed');
    if (subscribed && !window.location.href.includes('?ref=premium')) {
        window.setTimeout(function () {
            window.location.href = new URL(window.location.href).pathname + '?ref=premium';
        }, 100);
    }
    });
    let c_cards = document.querySelectorAll('div.c-card');
    for (c_card of c_cards) {
        var a_link = c_card.querySelector('a');
		var subscr_key = c_card.querySelector('span.c-indicator-icon--key');
        if (subscr_key && a_link && !a_link.href.includes('?ref=premium')) {
            a_link.href = a_link.href + '?ref=premium';
        }
    }
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
        const ad_blocks = document.querySelectorAll('.jzxvkd-1');
        for (let ad_block of ad_blocks) {
            ad_block.setAttribute('style', 'display:none');
        }
        const abo_banner = document.querySelector('[class^="pgxf3b"]');
        removeDOMElement(abo_banner);
    }, 1000); // Delay (in milliseconds)
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
            let pars = hidden_section.querySelectorAll("p, h2, div");
            for (let par of pars) {
                par.removeAttribute('style');
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
}

else if (matchDomain('lescienze.it')) {
    const paywall = document.querySelector('.paywall-adagio');
    const body_paywall = document.getElementById('detail-body-paywall');
    const shade = document.querySelector('.shade');
    removeDOMElement(paywall, body_paywall, shade);
    const hidden_bodies = document.querySelectorAll('.detail_body');
    for (let hidden_body of hidden_bodies) {
        hidden_body.removeAttribute('hidden');
        hidden_body.setAttribute('style', 'display:block; max-height:auto; overflow:visible');
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
    let regwall = document.querySelector('.dynamic-regwall');
    removeDOMElement(regwall);
}

else if (matchDomain('lejdd.fr')) {
    let poool_banner = document.querySelector('#poool-container');
    removeDOMElement(poool_banner);
    let bottom_hide = document.querySelector('.cnt[data-poool-mode="hide"]');
    if (bottom_hide) {
        bottom_hide.removeAttribute('data-poool-mode');
        bottom_hide.removeAttribute('style');
    }
}

else if (matchDomain('elmundo.es')) {
    let premium = document.querySelector('.ue-c-article__premium');
    window.setTimeout(function () {
        if (premium && window.location.href.includes('/www.elmundo.es/')) {
            window.location.href = window.location.href.replace('/www.', '/amp.');
        }
    }, 500); // Delay (in milliseconds)
    if (window.location.href.includes('/amp.elmundo.es/')) {
        let paywall = document.querySelector('div[amp-access="authorized!=true"]');
        if (paywall) {
            removeDOMElement(paywall);
            let div_hidden = document.querySelector('div[amp-access="authorized=true"]');
            if (div_hidden) {
                div_hidden.removeAttribute('amp-access-hide');
            }
        }
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

else if (matchDomain('bostonglobe.com')) {
    if (!cookieExists('s_fid')) {
        let s_fid = genHexString(16) + '-' + genHexString(16);
        setCookie('s_fid', s_fid, 'bostonglobe.com', '/', 14);
    }
}

else if (matchDomain('historyextra.com')) {
    let article_masked = document.querySelector('.template-article__masked');
    if (article_masked) {
        let extra_pars = document.querySelectorAll('div.template-article__masked > p');
        for (let extra_par of extra_pars) {
            removeDOMElement(extra_par);
        }
        article_masked.classList.remove('template-article__masked');
    }
    let ad_banner = document.querySelector('.ad-banner-container');
    removeDOMElement(ad_banner);
}

else if (matchDomain(['independent.ie', 'belfasttelegraph.co.uk'])) {
	let domain = matchDomain(['independent.ie', 'belfasttelegraph.co.uk']);
    if (!cookieExists('subscriber')) {
        setCookie('subscriber', '{"subscriptionStatus": true}', domain, '/', 14);
    }
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
        for (summary_body of dive_deeper_summary_bodies) {
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
        if (pageContains('._33dc2 h2', 'Become a member, and we promise').length)
            document.location.reload(true);
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
                var json_text = JSON.parse(json.text.replace(/(\r\n|\n|\r|\t)/gm, ''))[0].articleBody;
                json_text = parseHtmlEntities(json_text.replace(/(?:^|[\w\"\'\’])(\.|\?|!)(?=[A-Za-zÀ-ÿ\"\”\']{2,})/gm, "$&\n\n") + '\n\n');
                let p_content = document.querySelector('span.p-content.paywall');
                if (p_content) {
                    let old_pars = p_content.querySelectorAll('p');
                    for (let old_par of old_pars) {
                        if (!old_par.querySelector('img'))
                            removeDOMElement(old_par);
                    }
                    let new_par = document.createElement("p");
                    new_par.innerText = json_text;
                    p_content.appendChild(new_par);
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
    document.addEventListener('DOMContentLoaded', () => {
        let reduced_par = document.querySelector('div.sz-article-body__paragraph--reduced');
        let url = window.location.href;
        if (url.includes('reduced=true') || reduced_par)
            window.location.href = url.split('?')[0].replace('www.', 'amphtml.');
    });
}

else if (matchDomain("charliehebdo.fr")) {
    let paywalled_content = document.querySelector('div.ch-paywalled-content');
    if (paywalled_content)
        paywalled_content.removeAttribute('style');
    let poool_widget = document.querySelector('div#poool-widget');
    removeDOMElement(poool_widget);
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

function insert_script(func) {
    let bpc_script = document.querySelector('script#bpc_script');
    if (!bpc_script) {
        let script = document.createElement('script');
        script.setAttribute('id', 'bpc_script');
        script.appendChild(document.createTextNode('(' + func + ')();'));
        (document.body || document.head || document.documentElement).appendChild(script);
    }
}

function genHexString(len) {
    let output = '';
    for (let i = 0; i < len; i++) {
        output += (Math.floor(Math.random() * 16)).toString(16);
    }
    return output;
}

function pageContains(selector, text) {
    let elements = document.querySelectorAll(selector);
    return Array.prototype.filter.call(elements, function(element){
        return RegExp(text).test(element.textContent);
    });
}

function parseHtmlEntities(str) {
    var elem = document.createElement('textarea');
    elem.innerHTML = str;
    return elem.value;
}
