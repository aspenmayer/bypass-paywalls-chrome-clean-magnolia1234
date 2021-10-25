//"use strict";
var ext_api = (typeof browser === 'object') ? browser : chrome;
var domain;
var csDone = false;
var csDoneOnce = false;
var dompurify_loaded = (typeof DOMPurify === 'function');

var ca_torstar_domains = ['niagarafallsreview.ca', 'stcatharinesstandard.ca', 'thepeterboroughexaminer.com', 'therecord.com', 'thespec.com', 'thestar.com', 'wellandtribune.ca'];
var de_funke_media_domains = ['abendblatt.de', 'braunschweiger-zeitung.de', 'morgenpost.de', 'nrz.de', 'otz.de', 'thueringer-allgemeine.de', 'tlz.de', 'waz.de', 'wp.de', 'wr.de'];
var de_madsack_domains = ['haz.de', 'kn-online.de', 'ln-online.de', 'lvz.de', 'maz-online.de', 'neuepresse.de', 'ostsee-zeitung.de'];
var es_epiberica_domains = ['diariodeibiza.es', 'diariodemallorca.es', 'eldia.es', 'elperiodicomediterraneo.com', 'farodevigo.es', 'informacion.es', 'laprovincia.es', 'levante-emv.com', 'lne.es'];
var es_grupo_vocento_domains = ['diariosur.es', 'diariovasco.com', 'elcomercio.es', 'elcorreo.com', 'eldiariomontanes.es', 'elnortedecastilla.es', 'hoy.es', 'ideal.es', 'larioja.com', 'lasprovincias.es', 'laverdad.es', 'lavozdigital.es'];
var es_unidad_domains = ['elmundo.es', 'expansion.com', 'marca.com'];
var fi_alma_talent_domains = ['arvopaperi.fi', 'iltalehti.fi', 'kauppalehti.fi', 'marmai.fi', 'mediuutiset.fi', 'mikrobitti.fi', 'talouselama.fi', 'tekniikkatalous.fi', 'tivi.fi', 'uusisuomi.fi'];
var fr_groupe_ebra_domains = ['bienpublic.com', 'dna.fr', 'estrepublicain.fr', 'lalsace.fr', 'ledauphine.com', 'lejsl.com', 'leprogres.fr', 'republicain-lorrain.fr', 'vosgesmatin.fr'];
var fr_groupe_la_depeche_domains = ['centrepresseaveyron.fr', 'ladepeche.fr', 'lindependant.fr', 'midi-olympique.fr', 'midilibre.fr', 'nrpyrenees.fr', 'petitbleu.fr'];
var it_repubblica_domains = ['gelocal.it', 'ilsecoloxix.it', 'lanuovasardegna.it', 'lastampa.it', 'limesonline.com', 'repubblica.it'];
var it_quotidiano_domains = ['ilgiorno.it', 'ilrestodelcarlino.it', 'iltelegrafolivorno.it', 'lanazione.it', 'quotidiano.net'];
var nl_mediahuis_region_domains = ['gooieneemlander.nl', 'haarlemsdagblad.nl', 'ijmuidercourant.nl', 'leidschdagblad.nl', 'noordhollandsdagblad.nl'];
var no_nhst_media_domains = ['intrafish.com', 'rechargenews.com', 'tradewindsnews.com', 'upstreamonline.com'];
var timesofindia_domains = ['timesofindia.com', 'timesofindia.indiatimes.com'];
var usa_craincomm_domains = ['adage.com', 'autonews.com', 'chicagobusiness.com', 'crainscleveland.com', 'crainsdetroit.com', 'crainsnewyork.com', 'modernhealthcare.com'];
var usa_mcc_domains = ['bnd.com', 'charlotteobserver.com', 'fresnobee.com', 'kansas.com', 'kansascity.com', 'kentucky.com', 'miamiherald.com', 'newsobserver.com', 'sacbee.com', 'star-telegram.com', 'thestate.com', 'tri-cityherald.com'];
var usa_mng_domains =   ['denverpost.com', 'eastbaytimes.com', 'mercurynews.com', 'ocregister.com', 'pe.com', 'twincities.com'];
var usa_tribune_domains = ['baltimoresun.com', 'chicagotribune.com', 'courant.com', 'dailypress.com', 'mcall.com', 'nydailynews.com', 'orlandosentinel.com', 'pilotonline.com', 'sun-sentinel.com'];

// clean local storage of sites (with an exemption for hold-list)
var arr_localstorage_hold = ['augsburger-allgemeine.de', 'charliehebdo.fr', 'cmjornal.pt', 'houstonchronicle.com', 'inc42.com', 'kurier.at', 'nknews.org', 'seekingalpha.com', 'sfchronicle.com', 'thehindu.com', 'thetimes.co.uk'].concat(de_funke_media_domains, es_grupo_vocento_domains, es_unidad_domains, no_nhst_media_domains);
if (!matchDomain(arr_localstorage_hold)) {
  window.localStorage.clear();
}

var div_bpc_done = document.querySelector('div#bpc_done');
if (!div_bpc_done) {

var bg2csData;
// check for opt-in confirmation (from background.js)
if ((bg2csData !== undefined) && bg2csData.optin_setcookie) {
  if (domain = matchDomain(['belfasttelegraph.co.uk', 'independent.ie'])) {
    if (!cookieExists('subscriber'))
      setCookie('subscriber', '{"subscriptionStatus": true}', domain, '/', 14);
  }
}

// custom sites: try to unhide text on amp-page
if ((bg2csData !== undefined) && bg2csData.amp_unhide) {
  window.setTimeout(function () {
    let amp_page = document.querySelector('script[src^="https://cdn.ampproject.org/"]');
    if (amp_page) {
      let preview = document.querySelector('[subscriptions-section="content-not-granted"]');
      removeDOMElement(preview);
      let subscr_section = document.querySelectorAll('[subscriptions-section="content"]');
      for (let elem of subscr_section)
        elem.removeAttribute('subscriptions-section');
    }
    let content_hidden = document.querySelectorAll('[amp-access][amp-access-hide]');
    for (elem of content_hidden)
      elem.removeAttribute('amp-access-hide');
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(...amp_ads);
  }, 500); // Delay (in milliseconds)
}

// Content workarounds/domain

if (matchDomain(['medium.com', 'towardsdatascience.com']) || document.querySelector('script[src^="https://cdn-client.medium.com/"]')) {
  let paywall = document.querySelector('div#paywall-background-color');
  removeDOMElement(paywall);
  if (paywall) {
    ext_api.runtime.sendMessage({request: 'refreshCurrentTab'});
    csDoneOnce = true;
  }
  window.setTimeout(function () {
    let meter = document.querySelector('[id*="highlight-meter-"]');
    if (meter)
      meter.hidden = true;
  }, 500); // Delay (in milliseconds)
}

else if (window.location.hostname.match(/\.(com|net)\.au$/)) {//australia

if (matchDomain('thesaturdaypaper.com.au')) {
  let paywall = document.querySelector('div.paywall-hard-always-show');
  removeDOMElement(paywall);
}

else if (domain = matchDomain(["brisbanetimes.com.au", "smh.com.au", "theage.com.au", "watoday.com.au"])) {
  let url = window.location.href;
  let for_subscribers = document.querySelector('meta[content^="FOR SUBSCRIBERS"], #paywall_prompt');
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

else {
  // Australian Community Media newspapers
  let au_cm_sites = ['bendigoadvertiser.com.au', 'bordermail.com.au', 'canberratimes.com.au', 'centralwesterndaily.com.au', 'dailyadvertiser.com.au', 'dailyliberal.com.au', 'examiner.com.au', 'illawarramercury.com.au', 'newcastleherald.com.au', 'northerndailyleader.com.au', 'portnews.com.au', 'standard.net.au', 'theadvocate.com.au', 'thecourier.com.au', 'westernadvocate.com.au'];
  let au_piano_script = document.querySelector('script[src="https://cdn-au.piano.io/api/tinypass.min.js"]');
  if (matchDomain(au_cm_sites) || au_piano_script) {
    let subscribe_truncate = document.querySelector('.subscribe-truncate');
    if (subscribe_truncate)
      subscribe_truncate.classList.remove('subscribe-truncate');
    let subscriber_hiders = document.querySelectorAll('.subscriber-hider');
    for (let subscriber_hider of subscriber_hiders)
      subscriber_hider.classList.remove('subscriber-hider');
    let blocker = document.querySelector('div.blocker');
    let noscroll = document.querySelector('body[style]');
    if (noscroll)
      noscroll.removeAttribute('style');
    let story_generic_iframe = document.querySelector('.story-generic__iframe');
    removeDOMElement(story_generic_iframe, blocker);
  } else if (window.location.hostname.endsWith('.com.au')) {
    // Australia News Corp
    let au_nc_sites = ['adelaidenow.com.au', 'cairnspost.com.au', 'couriermail.com.au', 'dailytelegraph.com.au', 'geelongadvertiser.com.au', 'goldcoastbulletin.com.au', 'heraldsun.com.au', 'ntnews.com.au', 'theaustralian.com.au', 'thechronicle.com.au', 'themercury.com.au', 'townsvillebulletin.com.au', 'weeklytimesnow.com.au'];
    if (domain = matchDomain(au_nc_sites)) {
      let header_ads = document.querySelector('.header_ads-container');
      removeDOMElement(header_ads);
      if (window.location.hostname.startsWith('amp.')) {
        let div_hidden = document.querySelectorAll('div[amp-access="access AND subscriber"][amp-access-hide]');
        for (let elem of div_hidden)
          elem.removeAttribute('amp-access-hide');
      } else if (window.location.href.includes('?amp')) {
        let div_hidden = document.querySelector('div[amp-access="subscriber AND status=\'logged-in\'"][amp-access-hide]');
        if (div_hidden)
          div_hidden.removeAttribute('amp-access-hide');
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
      let amp_ads = document.querySelectorAll('[id^="ad-mrec-"], amp-ad, amp-embed');
      removeDOMElement(...amp_ads);
    } else {
      // Australian Seven West Media
      let swm_script = document.querySelector('script[src^="https://s.thewest.com.au"]');
      if (matchDomain('thewest.com.au') || swm_script) {
        window.setTimeout(function () {
          let breach_screen = document.querySelector('div[data-testid*="BreachScreen"]');
          if (breach_screen) {
            let scripts = document.querySelectorAll('script:not([src], [type])');
            let json_script;
            for (let script of scripts) {
              if (script.innerText.includes('window.PAGE_DATA =')) {
                json_script = script;
                break;
              }
            }
            if (json_script) {
              let json_text = json_script.innerHTML.split('window.PAGE_DATA =')[1].split('</script')[0];
              json_text = json_text.replace(/undefined/g, '"undefined"');
              let json_article = JSON.parse(json_text);
              let json_pub;
              for (let key in json_article)
                if (json_article[key].data.result.resolution && json_article[key].data.result.resolution.publication) {
                  json_pub = json_article[key].data.result.resolution.publication;
                  break;
                }
              let json_content = [];
              let url_loaded;
              if (json_pub) {
                json_content = json_pub.content.blocks;
                url_loaded = json_pub._self;
              } else
                window.location.reload(true);
              //let json_video = json_pub.mainVideo;
              let url = window.location.href;
              if (!url_loaded || !url.includes(url_loaded.slice(-10)))
                window.location.reload(true);
              let par_elem, par_sub1, par_sub2;
              let par_dom = document.createElement('div');
              let tweet_id = 1;
              for (let par of json_content) {
                par_elem = '';
                if (par.kind === 'text') {
                  par_elem = document.createElement('p');
                  par_elem.innerText = par.text;
                } else if (par.kind === 'subhead') {
                  par_elem = document.createElement('h2');
                  par_elem.innerText = par.text;
                } else if (par.kind === 'pull-quote') {
                  par_elem = document.createElement('i');
                  par_elem.innerText = (par.attribution ? par.attribution + ': ' : '') + par.text;
                } else if (par.kind === 'embed') {
                  if (par.reference.includes('https://omny.fm/') || par.reference.includes('https://docdro.id/')) {
                    par_elem = document.createElement('embed');
                    par_elem.src = par.reference;
                    par_elem.style = 'height:500px; width:100%';
                    par_elem.frameborder = '0';
                  } else {
                    par_elem = document.createElement('a');
                    par_elem.href = par.reference;
                    par_elem.innerText = par.reference.split('?')[0];
                    console.log('embed: ' + par.reference);
                  }
                } else if (par.kind === 'unordered-list') {
                  if (par.items) {
                    par_elem = document.createElement('ul');
                    for (let item of par.items)
                      if (item.text) {
                        par_sub1 = document.createElement('li');
                        if (item.intentions[0] && item.intentions[0].href) {
                          par_sub2 = document.createElement('a');
                          par_sub2.href = item.intentions[0].href;
                        } else {
                          par_sub2 = document.createElement('span');
                        }
                        par_sub2.innerText = item.text;
                        par_sub1.appendChild(par_sub2);
                        par_elem.appendChild(par_sub1);
                      }
                  }
                } else if (par.kind === 'inline') {
                  if (par.asset.kind === 'image') {
                    par_elem = document.createElement('figure');
                    par_sub1 = document.createElement('img');
                    par_sub1.src = par.asset.original.reference;
                    par_sub1.style = 'width:100%';
                    par_elem.appendChild(par_sub1);
                    if (par.asset.captionText) {
                      par_sub2 = document.createElement('figcaption');
                      par_sub2.innerText = par.asset.captionText + ' ' + par.asset.copyrightByline +
                        ((par.asset.copyrightCredit && par.asset.captionText !== par.asset.copyrightByline) ? '/' + par.asset.copyrightCredit : '');
                      par_elem.appendChild(par_sub2);
                    }
                  }
                } else {
                  par_elem = document.createElement('p');
                  par_elem.innerText = par.text;
                  console.log(par.kind);
                }
                if (par_elem)
                  par_dom.appendChild(par_elem);
              }
              let content = document.querySelector('div[class*="StyledArticleContent"]');
              if (content) {
                content.appendChild(par_dom);
              } else {
                par_dom.setAttribute('style', 'margin: 20px;');
                breach_screen.parentElement.insertBefore(par_dom, breach_screen);
              }
            }
            removeDOMElement(breach_screen);
          }
        }, 1500); // Delay (in milliseconds)
        let header_advert = document.querySelector('.headerAdvertisement');
        if (header_advert)
          header_advert.setAttribute('style', 'display: none;');
      }
    }
  }
  else
    csDone = true;
}

} else if (window.location.hostname.match(/\.(de|at|ch)$/) || matchDomain(['faz.net', 'handelsblatt.com'])) {//germany/austria/switzerland - ch

if (matchDomain('aachener-zeitung.de')) {
  let url = window.location.href;
  if (url.includes('?output=amp')) {
    let subscr_sections = document.querySelectorAll('section[subscriptions-section="content"]');
    for (let subscr_section of subscr_sections)
      subscr_section.removeAttribute('subscriptions-section');
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(...amp_ads);
  } else {
    let paywall = document.querySelector('.park-article-paywall, .text-blurred');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  }
}

else if (matchDomain('augsburger-allgemeine.de')) {
  let url = window.location.href;
  if (!url.includes('-amp.html')) {
    let paywall = document.querySelector('div.aa-visible-logged-out');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.replace('.html', '-amp.html');
    }
  } else {
    let subscr_sections = document.querySelectorAll('div[subscriptions-section="content"]');
    for (let subscr_section of subscr_sections)
      subscr_section.removeAttribute('subscriptions-section');
    let amp_iframes = document.querySelectorAll('amp-iframe');
    let elem;
    for (let amp_iframe of amp_iframes) {
      elem = document.createElement('iframe');
      elem.src = amp_iframe.getAttribute('src');
      elem.setAttribute('frameborder', '0');
      if (amp_iframe.getAttribute('height') && amp_iframe.getAttribute('width')) {
        elem.setAttribute('height', amp_iframe.getAttribute('height'));
        elem.setAttribute('width', amp_iframe.getAttribute('width'));
      }
      amp_iframe.parentElement.insertBefore(elem, amp_iframe);
      removeDOMElement(amp_iframe);
    }
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(...amp_ads);
  }
}

else if (matchDomain('berliner-zeitung.de')) {
  let url = window.location.href;
  let paywall = document.querySelector('.paywall-dialog-box');
  if (url.split('?')[0].includes('.amp')) {
    if (paywall) {
      let preview = document.querySelector('section[subscriptions-section="content-not-granted"]');
      removeDOMElement(paywall, preview);
      let subscr_section = document.querySelector('section[subscriptions-section="content"]');
      if (subscr_section) {
        subscr_section.removeAttribute('subscriptions-section');
        let amp_ads = document.querySelectorAll('amp-ad');
        removeDOMElement(...amp_ads);
      }
    }
  } else {
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url.split('?')[0] + '.amp';
    }
  }
}

else if (matchDomain('cicero.de')) {
  let url = window.location.href;
  if (!url.includes('?amp')) {
    let paywall = document.querySelector('.plenigo-paywall');
    if (paywall) {
      removeDOMElement(paywall);
      let url_amp = url + '?amp';
      replaceDomElementExt(url_amp, false, false, '.field-name-field-cc-body');
    }
  } else {
    let teasered_content = document.querySelector('.teasered-content');
    if (teasered_content)
      teasered_content.classList.remove('teasered-content');
    let teasered_content_fader = document.querySelector('.teasered-content-fader');
    let btn_read_more = document.querySelector('.btn--read-more');
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(teasered_content_fader, btn_read_more, ...amp_ads);
  }
  let urban_ad_sign = document.querySelectorAll('.urban-ad-sign');
  removeDOMElement(...urban_ad_sign);
}

else if (matchDomain(de_funke_media_domains)) {
  sessionStorage.setItem('deobfuscate', 'true');
}

else if (matchDomain('deutsche-wirtschafts-nachrichten.de')) {
  window.setTimeout(function () {
    let hardpay = document.querySelector('.hardpay');
    if (hardpay) {
      window.location.reload(true);
    }
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('faz.net')) {
  if (matchDomain('zeitung.faz.net')) {
    let paywall_z = document.querySelector('.c-red-carpet');
    if (paywall_z) {
      let og_url = document.querySelector('meta[property="og:url"]');
      if (og_url)
        window.setTimeout(function () {
          window.location.href = og_url.content;
        }, 500); // Delay (in milliseconds)
    }
    let sticky_advt = document.querySelector('.sticky-advt');
    removeDOMElement(sticky_advt);
  } else {
    let paywall = document.querySelector('#paywall-form-container-outer, .atc-ContainerPaywall');
    if (paywall) {
      removeDOMElement(paywall);
      let url = new URL(window.location.href);
      let mUrl = new URL(url.pathname, 'https://m.faz.net/');
      fetch(mUrl)
      .then(response => {
        if (response.ok) {
          response.text().then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let json = doc.querySelector('script[id="schemaOrgJson"]');
            if (json) {
              let json_text = json.text.replace(/(\r|\n)/g, '');
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
                str = str.replace(/(?:^|[A-Za-z\"\“])(\.|\?|!)(?=[A-ZÖÜ\„\d][A-Za-zÀ-ÿ\„\d]{1,})/gm, "$&\n\n");
                str = str.replace(/(([a-z]{2,}|[\"\“]))(?=[A-Z](?=[A-Za-zÀ-ÿ]+))/gm, "$&\n\n");
                // exceptions: names with alternating lower/uppercase (no general fix)
                let str_rep_arr = ['AstraZeneca', 'BaFin', 'BerlHG', 'BfArM', 'BilMoG', 'BioNTech', 'DiGA', 'EuGH', 'FinTechRat', 'GlaxoSmithKline', 'IfSG', 'medRxiv', 'mmHg', 'PlosOne', 'StVO'];
                let str_rep_split,
                str_rep_src;
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
    let lay_paysocial = document.querySelector('div.lay-PaySocial');
    removeDOMElement(lay_paysocial);
  }
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

else if (matchDomain('handelsblatt.com')) {
  let url = window.location.href;
  if (url.match(/\/amp(\d)?\./)) {
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(...amp_ads);
  } else {
    let paywall = document.querySelector('div.temp-paywall2');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (!amphtml)
      amphtml = {href: url.replace(/\/(www|app)\./, '/amp2.')};
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
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

else if (matchDomain('kurier.at')) {
  let view_offer = document.querySelector('.view-offer');
  removeDOMElement(view_offer);
  let plus_content = document.querySelector('.plusContent');
  if (plus_content)
    plus_content.classList.remove('plusContent');
}

else if (matchDomain(['noz.de', 'nwzonline.de', 'shz.de', 'svz.de'])) {
  let url = window.location.href;
  if (url.includes('?amp') || url.includes('-amp.html')) {
    let subscriber = document.querySelectorAll('div[amp-access="NOT data.reduced"][amp-access-hide]');
    for (let elem of subscriber)
      elem.removeAttribute('amp-access-hide');
    let non_subscriber = document.querySelector('div[amp-access="data.reduced"]');
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed, #flying-carpet-wrapper');
    removeDOMElement(non_subscriber, ...amp_ads);
  } else {
    let paywall = document.querySelector('.paywall, .story--premium__container');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  }
}

else if (matchDomain('nzz.ch')) {
  let regwall = document.querySelector('.dynamic-regwall');
  removeDOMElement(regwall);
}

else if (matchDomain('rheinpfalz.de')) {
  let url = window.location.href;
  if (url.includes('reduced=true')) {
    window.setTimeout(function () {
      window.location.href = url.split('?')[0];
    }, 500); // Delay (in milliseconds)
  }
}

else if (matchDomain(['ruhrnachrichten.de', 'hellwegeranzeiger.de'])) {
  let url = window.location.href;
  if (!url.includes('?amp')) {
    let paywall = document.querySelector('.PianoContent');
    if (paywall)
      paywall.classList.remove('PianoContent');
  } else {
    let subscr_sections = document.querySelectorAll('section[subscriptions-section="content"]');
    for (let subscr_section of subscr_sections)
      subscr_section.removeAttribute('subscriptions-section');
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(...amp_ads);
  }
}

else if (matchDomain(['westfalen-blatt.de', 'wn.de'])) {
  let url = window.location.href;
  if (url.includes('/amp/')) {
    let subscr_sections = document.querySelectorAll('section[subscriptions-section="content"]');
    for (let subscr_section of subscr_sections)
      subscr_section.removeAttribute('subscriptions-section');
  }
  let amp_ads = document.querySelectorAll('amp-ad, section[class^="fp-ad"]');
  removeDOMElement(...amp_ads);
}

else if ((domain = matchDomain(de_madsack_domains)) || document.querySelector('link[rel="preload"][href="https://static.rndtech.de/cmp/1.x.x.js"]')) {
  let url = window.location.href;
  if (!url.includes(domain + '/amp/')) {
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
  } else {
    let subscr_sections = document.querySelectorAll('section[subscriptions-section="content"]');
    for (let subscr_section of subscr_sections)
      subscr_section.removeAttribute('subscriptions-section');
    let amp_ads = document.querySelectorAll('.pdb-ad-container');
    removeDOMElement(...amp_ads);
  }
}

else
  csDone = true;

} else if (window.location.hostname.match(/\.(es|pt)$/) || matchDomain(['diariovasco.com', 'elconfidencial.com', 'elcorreo.com', 'elespanol.com', 'elpais.com', 'elperiodico.com', 'elperiodicomediterraneo.com', 'expansion.com', 'larioja.com', 'lavanguardia.com', 'levante-emv.com', 'marca.com', 'politicaexterior.com'])) {//spain/portugal

if (matchDomain('cmjornal.pt')) {
  let paywall = document.querySelector('.bloqueio_exclusivos');
  let amphtml = document.querySelector('link[rel="amphtml"]');
  let url = window.location.href;
  if (!url.includes('/amp/')) {
    if (paywall && amphtml) {
      removeDOMElement(paywall);
      window.location.href = amphtml.href;
    }
  } else {
    let section_hidden = document.querySelectorAll('section[amp-access="subscriber"][amp-access-hide]');
    for (let elem of section_hidden)
      elem.removeAttribute('amp-access-hide');
    let not_subscriber = document.querySelector('section[amp-access="NOT subscriber"]');
    removeDOMElement(not_subscriber);
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed, .detalheAds');
    removeDOMElement(...amp_ads);
    let amp_links = document.querySelectorAll('a[href^="https://www-cmjornal-pt.cdn.ampproject.org/c/s/"]');
    for (let amp_link of amp_links)
      amp_link.href = amp_link.href.replace('www-cmjornal-pt.cdn.ampproject.org/c/s/', '');
  }
}

else if (matchDomain('elconfidencial.com')) {
  let premium = document.querySelector('div.newsType__content--closed');
  if (premium)
    premium.classList.remove('newsType__content--closed');
}

else if (matchDomain('elespanol.com')) {
  let adverts = document.querySelectorAll('[id*="superior"], [class*="adv"]');
  removeDOMElement(...adverts);
}

else if (domain = matchDomain(es_unidad_domains)) {
  let premium = document.querySelector('.ue-c-article__premium');
  let url = window.location.href;
  if (!url.includes('/amp.' + domain + '/')) {
    if (premium) {
      removeDOMElement(premium);
      window.location.href = window.location.href.replace('/www.', '/amp.');
    }
  } else {
    let paywall = document.querySelector('div[amp-access="authorized!=true"]');
    if (paywall) {
      removeDOMElement(paywall);
      let div_hidden = document.querySelector('div[amp-access="authorized=true"][amp-access-hide]');
      if (div_hidden) {
        div_hidden.removeAttribute('amp-access-hide');
      }
    }
    let adverts = document.querySelectorAll('.advertising, amp-embed, amp-ad');
    removeDOMElement(...adverts);
  }
}

else if (matchDomain('elpais.com')) {
  let url = window.location.href;
  let login_register = document.querySelector('.login_register');
  if (url.includes('.amp.html') || url.includes('?outputType=amp')) {
    let preview = document.querySelector('div[amp-access="NOT success"]');
    let paywall = document.querySelectorAll('div[amp-access="success"][amp-access-hide]');
    for (let elem of paywall)
      elem.removeAttribute('amp-access-hide');
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(login_register, preview, ...amp_ads);
  } else {
    let counter = document.querySelector('#counterLayerDiv');
    removeDOMElement(counter);
    let video = document.querySelector('div.videoTop')
      let amphtml = document.querySelector('link[rel="amphtml"]');
    if ((login_register || video) && amphtml) {
      removeDOMElement(login_register, video);
      window.location.href = amphtml.href;
    }
  }
  let paywall_offer = document.querySelector('.paywallOffer');
  let ctn_closed_article = document.querySelector('#ctn_closed_article');
  removeDOMElement(paywall_offer, ctn_closed_article);
}

else if (matchDomain('elperiodico.com')) {
  let url = window.location.href;
  if (!url.includes('amp.elperiodico.com')) {
    let div_hidden = document.querySelector('div.closed');
    if (div_hidden)
      div_hidden.classList.remove('closed');
    else {
      let paywall = document.querySelector('.ep-masPeriodico-info-login');
      removeDOMElement(paywall);
      if (paywall)
        window.location.href = url.replace('www.', 'amp.');
    }
  } else {
    let not_logged = document.querySelector('.ep-masPeriodico-info-login');
    if (not_logged) {
      let non_subscr_section = document.querySelector('div[amp-access^="NOT logged"]');
      removeDOMElement(not_logged, non_subscr_section);
      let subscr_section = document.querySelector('div[amp-access^="logged"][amp-access-hide]');
      if (subscr_section)
        subscr_section.removeAttribute('amp-access-hide');
    }
    window.setTimeout(function () {
      let amp_img = document.querySelectorAll('amp-img > img');
      for (let elem of amp_img) {
        if (elem.src)
          elem.src = elem.src.replace('amp.elperiodico.com/clip/', 'estaticos-cdn.elperiodico.com/clip/');
      }
    }, 3000); // Delay (in milliseconds)
  }
}

else if (matchDomain(es_grupo_vocento_domains)) {
  let url = window.location.href;
  let content_exclusive_bg = document.querySelector('.content-exclusive-bg, #cierre_suscripcion, ev-engagement[group-name^="paywall-"]');
  let amphtml = document.querySelector('link[rel="amphtml"]');
  if (content_exclusive_bg && amphtml) {
    removeDOMElement(content_exclusive_bg);
    window.location.href = url.split('?')[0].replace('.html', '_amp.html');
  } else if (url.includes('_amp.html')) {
    let voc_advers = document.querySelectorAll('.voc-adver, amp-embed');
    removeDOMElement(...voc_advers);
    let container_wall_exclusive = document.querySelector('.container-wall-exclusive');
    if (container_wall_exclusive) {
      let non_subscr_section = document.querySelector('[amp-access="result!=\'ALLOW_ACCESS\'"]');
      removeDOMElement(container_wall_exclusive, non_subscr_section);
      let subscr_section = document.querySelectorAll('[amp-access="result=\'ALLOW_ACCESS\'"][amp-access-hide]');
      for (let elem of subscr_section)
        elem.removeAttribute('amp-access-hide');
    }
    //lavozdigital.es
    let paywall = document.querySelector('span[subscriptions-section="content"]');
    if (paywall) {
      paywall.classList.remove('paywall');
      paywall.removeAttribute('subscriptions-section');
    }
  }
}

else if (matchDomain(es_epiberica_domains)) {
  let truncated = document.querySelector('div.article-body--truncated');
  if (truncated)
    truncated.classList.remove('article-body--truncated');
  window.setTimeout(function () {
    let paywall = document.querySelector('div.paywall');
    removeDOMElement(paywall);
  }, 500); // Delay (in milliseconds)
  if (window.location.href.includes('.amp.html')) {
    let div_access = document.querySelector('div[amp-access="access"]');
    removeDOMElement(div_access);
    let div_hidden = document.querySelectorAll('div[amp-access="NOT access"][amp-access-hide], div[amp-access="FALSE"][amp-access-hide]');
    for (let elem of div_hidden)
      elem.removeAttribute('amp-access-hide');
  } else {
    let div_hidden = document.querySelector('div.baldomero');
    if (div_hidden)
      div_hidden.classList.remove('baldomero');
  }
}

else if (matchDomain('lavanguardia.com')) {
  let paywall = document.querySelector('[class*="ev-open-modal-paywall"]');
  let infinite_loading = document.querySelector('#infinite-loading');
  removeDOMElement(paywall, infinite_loading);
}

else if (matchDomain('observador.pt')) {
  let paywall = document.querySelector('.premium-article');
  if (paywall)
    paywall.classList.remove('premium-article');
}

else if (matchDomain('politicaexterior.com')) {
  let paywall = document.querySelector('div[class^="paywall-"]');
  if (paywall) {
    let article = document.querySelector('div.entry-content-text');
    let json = document.querySelector('script[type="application/ld+json"]:not([class]');
    if (json) {
      let json_text = JSON.parse(json.text).description.replace(/&amp;nbsp;/g, '');
      let article_new = document.createElement('div');
      article_new.setAttribute('class', 'entry-content-text');
      article_new.innerText = '\r\n' + json_text;
      article.parentNode.replaceChild(article_new, article);
    }
    removeDOMElement(paywall);
  }
}

else
  csDone = true;

} else if (window.location.hostname.endsWith('.fr') || matchDomain(['bienpublic.com', 'journaldunet.com', 'la-croix.com', 'ledauphine.com', 'ledevoir.com', 'lejsl.com', 'loeildelaphotographie.com', 'marianne.net', 'nouvelobs.com', 'parismatch.com'])) {//france

if (matchDomain('alternatives-economiques.fr')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('#temp-paywall');
    removeDOMElement(paywall);
    let data_ae_poool = document.querySelector('div[data-ae-poool]');
    if (data_ae_poool)
      data_ae_poool.removeAttribute('style');
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('atlantico.fr')) {
  let paywall = document.querySelector('div.markup[class*="Paywall"]');
  if (paywall)
    paywall.setAttribute('class', 'markup');
}

else if (matchDomain('challenges.fr')) {
  let amorce = document.querySelector('.user-paying-amorce');
  if (amorce)
    amorce.setAttribute('style', 'display:none !important');
  let content = document.querySelectorAll('.user-paying-content');
  for (let elem of content)
    elem.classList.remove('user-paying-content');
  let paywall = document.querySelector('.temp-paywall');
  removeDOMElement(paywall);
}

else if (matchDomain('charliehebdo.fr')) {
  window.setTimeout(function () {
    let paywalled_content = document.querySelector('div.ch-paywalled-content');
    if (paywalled_content)
      paywalled_content.removeAttribute('style');
    let poool_widget = document.querySelector('div#poool-widget');
    removeDOMElement(poool_widget);
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('elle.fr')) {
  let hidden_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
  for (let hidden_image of hidden_images)
    hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
  let subscription_bar = document.querySelector('.tc-subscription-bar');
  removeDOMElement(subscription_bar);
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
    let amp_access_hide = document.querySelector('[amp-access][amp-access-hide]');
    if (amp_access_hide) {
      let not_access_section = document.querySelector('section[amp-access="NOT access"]');
      removeDOMElement(not_access_section);
      amp_access_hide.removeAttribute('amp-access-hide');
    }
    let amp_ads = document.querySelectorAll('amp-ad');
    removeDOMElement(...amp_ads);
  }
}

else if (domain = matchDomain(fr_groupe_la_depeche_domains)) {
  let url = window.location.href;
  let url_new = url.replace(domain + '/', domain + '/amp/');
  if (url.includes(domain + '/amp/')) {
    let subscr_section = document.querySelectorAll('[subscriptions-section="content"]');
    for (let elem of subscr_section)
      elem.removeAttribute('subscriptions-section');
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(...amp_ads);
  } else {
    let paywall = document.querySelector('div.paywall');
    if (paywall) {
      removeDOMElement(paywall);
      window.location.href = url_new;
    }
  }
}

else if (matchDomain('journaldunet.com')) {
  let reg_wall = document.querySelector('.reg_wall');
  removeDOMElement(reg_wall);
  let entry_reg_wall = document.querySelector('.entry_reg_wall');
  if (entry_reg_wall) {
    entry_reg_wall.removeAttribute('style');
  }
}

else if (matchDomain('la-croix.com')) {
  let url = window.location.href;
  if (!url.includes('la-croix.com/amp/')) {
    let hidden_images = document.querySelectorAll('source[srcset]');
    for (elem of hidden_images)
      elem.removeAttribute('srcset');
  } else {
    let paywall_block = document.querySelector('#paywall_block');
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(paywall_block, ...amp_ads);
  }
}

else if (matchDomain('lanouvellerepublique.fr')) {
  let alert_didacticiel = document.querySelector('div.alert-didacticiel');
  let loading = document.querySelectorAll('span.loading');
  removeDOMElement(alert_didacticiel, ...loading);
}

else if (matchDomain('ledevoir.com')) {
  let counter = document.querySelector('.popup-msg');
  removeDOMElement(counter);
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

else if (matchDomain('lesechos.fr') && window.location.href.match(/-\d{6,}/)) {
  window.setTimeout(function () {
    let abo_banner = document.querySelector('div[class*="pgxf3b-2"]');
    let ad_blocks = document.querySelectorAll('[class*="jzxvkd"');
    for (let ad_block of ad_blocks)
      ad_block.setAttribute('style', 'display:none');
    if (abo_banner && dompurify_loaded) {
      removeDOMElement(abo_banner);
      let url = window.location.href;
      let html = document.documentElement.outerHTML;
      let state;
      let split1 = html.split('window.__PRELOADED_STATE__=')[1];
      let split2 = split1.split('</script>')[0].trim();
      if (split2.includes('; window.__DATA__=')) {
        state = split2.split('; window.__DATA__=')[0].trim();
        if (state.length < 200)
          state = split2.split('; window.__DATA__=')[1].split('; window.__')[0].trim();
      } else
        state = split2.substr(0, split2.length - 1);
      try {
        let data = JSON.parse(state);
        let data_article = data.article ? data.article : data.pageProps;
        let article = data_article.data.stripes[0].mainContent[0].data.description;
        let url_loaded = data_article.data.path;
        if (url_loaded && !url.replace(/%20/g, '').includes(url_loaded))
          window.location.reload(true);
        let paywallNode = document.querySelector('.post-paywall');
        if (paywallNode) {
          let contentNode = document.createElement('div');
          let parser = new DOMParser();
          let article_html = parser.parseFromString('<div>' + DOMPurify.sanitize(article) + '</div>', 'text/html');
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
        let styleElem = document.head.appendChild(document.createElement('style'));
        styleElem.innerHTML = ".post-paywall::after {height: auto !important;}";
      } catch (err) {
        window.location.reload(true);
      }
    }
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('liberation.fr')) {
  let close_button = document.querySelector('.pw-action-close');
  if (close_button)
    close_button.click();
}

else if (matchDomain('loeildelaphotographie.com')) {
  let paywall = document.querySelector('.paywall');
  if (paywall) {
    paywall.removeAttribute('class');
  }
  let premium_pic_boxes = document.querySelectorAll('.premium-pic-box');
  let banners = document.querySelectorAll('.membership-promo-container, .login_form_litle');
  removeDOMElement(...premium_pic_boxes, ...banners);
  let blurred_images = document.querySelectorAll('img[style*="blur"]');
  for (let blurred_image of blurred_images)
    blurred_image.removeAttribute('style');
}

else if (matchDomain('marianne.net')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall && dompurify_loaded) {
    let article_source = document.querySelector('div.article-body[data-content-src]');
    if (article_source) {
      let article_text = decode_utf8(atob(article_source.getAttribute('data-content-src')));
      let parser = new DOMParser();
      let html = parser.parseFromString('<div>' + DOMPurify.sanitize(article_text) + '</div>', 'text/html');
      let article = html.querySelector('div');
      article_source.innerHTML = '';
      article_source.appendChild(article);
      article_source.removeAttribute('data-content-src');
    }
    removeDOMElement(paywall);
  }
}

else if (matchDomain('nouvelobs.com')) {
  let paywall = document.querySelector('.paywall');
  removeDOMElement(paywall);
}

else if (matchDomain('sudouest.fr')) {
  let url = window.location.href;
  let paywall = document.querySelector('.article-premium-footer');
  if (paywall) {
    let premium = document.querySelector('meta[name="gsoi:premium-content"]');
    if (premium) {
      if (premium.content) {
        let url_premium = window.location.origin + premium.content;
        replaceDomElementExt(url_premium, false, true, 'div.full-content');
      }
    }
    removeDOMElement(paywall);
  }
  window.setTimeout(function () {
    let footer_premium = document.querySelector('.footer-premium');
    removeDOMElement(footer_premium);
  }, 500); // Delay (in milliseconds)
}

else
  csDone = true;

} else if (window.location.hostname.endsWith('.it') || matchDomain(['limesonline.com', 'quotidiano.net'])) {//italy

if (matchDomain('corriere.it')) {
  let url = window.location.href;
  if (url.includes('_preview.shtml')) {
    window.setTimeout(function () {
      window.location.href = url.replace('_preview.shtml', '.shtml').split('?')[0];
    }, 500); // Delay (in milliseconds)
  }
}

else if (matchDomain('ilfattoquotidiano.it')) {
  let url = window.location.href;
  if (url.includes('/amp/')) {
    let section_not_granted = document.querySelector('section[subscriptions-section="content-not-granted"]');
    let comments = document.querySelector('div.content.comments');
    removeDOMElement(section_not_granted, comments);
    let hidden_content = document.querySelector('section[subscriptions-section="content"]');
    if (hidden_content)
      hidden_content.setAttribute('style', 'display:block !important;');
    let amp_ads = document.querySelectorAll('amp-ad, div#_4sVideoContainer');
    removeDOMElement(...amp_ads);
  } else {
    let paywall = pageContains('section.article-body > p', '[...]');
    if (paywall.length > 0) {
      removeDOMElement(...paywall);
      window.location.href = url.split('?')[0] + 'amp';
    }
  }
}

else if (matchDomain(it_quotidiano_domains)) {
  let detail_text_truncated = document.querySelector('div.detail-text--truncated');
  let detail_page_paywall = document.querySelector('body.detail-page--paywall');
  if (detail_page_paywall) {
    removeDOMElement(detail_text_truncated);
    detail_page_paywall.classList.remove('detail-page--paywall');
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

else if (matchDomain('limesonline.com')) {
  window.setTimeout(function () {
    let url = window.location.href;
    if (url.includes('prv=true'))
      window.location.href = new URL(url).pathname;
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('rep.repubblica.it')) {
  window.setTimeout(function () {
    if (window.location.href.includes('/pwa/')) {
      window.location.href = window.location.href.replace('/pwa/', '/ws/detail/');
    }
  }, 500); // Delay (in milliseconds)
  if (window.location.href.includes('/ws/detail/')) {
    let paywall = document.querySelector('.paywall[subscriptions-section="content"]');
    if (paywall) {
      paywall.removeAttribute('subscriptions-section');
      let preview = document.querySelector('div[subscriptions-section="content-not-granted"]');
      removeDOMElement(preview);
      csDoneOnce = true;
    }
  }
}

else if (domain = matchDomain(it_repubblica_domains)) {
  let url = window.location.href.split('?')[0];
  if (!url.match(/\amp(\/)?$/)) {
    let premium = document.querySelector('#paywall, iframe#__limio_frame');
    if (premium) {
      removeDOMElement(premium);
      if (!url.includes('/podcast/')) {
        let amphtml = document.querySelector('link[rel="amphtml"]');
        if (!amphtml)
          amphtml = {href: (url.split('?')[0] + '/amp').replace('//amp', '/amp')};
        if (amphtml)
          window.location.href = amphtml.href;
      }
    } else if (matchDomain('gelocal.it')) {
      premium = document.querySelector('.paywall-adagio');
      if (premium) {
        removeDOMElement(premium);
        window.setTimeout(function () {
          let article_body = document.querySelector('div#article-body[style]');
          if (article_body)
            article_body.removeAttribute('style');
        }, 1000); // Delay (in milliseconds)
      }
    }
  } else {
    let paywall;
    if (['lastampa.it', 'repubblica.it'].includes(domain)) {
      paywall = document.querySelector('div[id^="paywall-banner"]');
      removeDOMElement(paywall);
      let subscr_section = document.querySelector('[subscriptions-section="content"]');
      if (subscr_section) {
        subscr_section.removeAttribute('subscriptions-section');
        let preview = document.querySelector('div[subscriptions-section="content-not-granted"]');
        removeDOMElement(preview);
      }
    } else {
      paywall = document.querySelector('div[amp-access="showContent"][amp-access-hide]');
      if (paywall)
        paywall.removeAttribute('amp-access-hide');
    }
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(...amp_ads);
  }
}

else
  csDone = true;

} else if (window.location.hostname.match(/\.(be|nl)$/)) {//belgium/netherlands

if (matchDomain(['ad.nl', 'bd.nl', 'ed.nl', 'tubantia.nl', 'bndestem.nl', 'pzc.nl', 'destentor.nl', 'gelderlander.nl'])) {
  let paywall = document.querySelectorAll('.article__component--paywall-module-notification, .fjs-paywall-notification');
  let modal_login = document.querySelector('.modal--login');
  removeDOMElement(...paywall, modal_login);
}

else if (matchDomain('fd.nl')) {
  document.addEventListener('DOMContentLoaded', () => {
    if (window.location.href.includes('?'))
      window.location.href = window.location.href.split('?')[0];
    let reg_modal = document.querySelector('div.modal.upsell');
    if (reg_modal)
      window.location.reload(true);
  });
}

else if (matchDomain('ftm.nl')) {
  let banner_pp = document.querySelector('div.banner-pp');
  removeDOMElement(banner_pp);
}

else if (matchDomain('knack.be')) {
  let paywall = document.querySelector('[class$="Paywall"], #paywall-modal-below');
  if (paywall) {
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

else if (matchDomain(nl_mediahuis_region_domains)) {
  window.setTimeout(function () {
    let close_button = document.querySelector('button[data-testid="button-close"]');
    if (close_button)
      close_button.click();
    let premium = document.querySelector('div.common-components-plus_pluslabel--container');
    if (premium && dompurify_loaded) {
      let hidden_article = document.querySelector('div[data-auth-body="article"]');
      if (hidden_article)
        hidden_article.removeAttribute('style');
      let paywall = document.querySelector('div[data-auth-root="paywall"]');
      removeDOMElement(paywall);
      let auth_body = document.querySelector('div[data-auth-body="article"]');
      if (paywall && auth_body) {
        let auth_body_par_count = auth_body.querySelectorAll('p');
        if (auth_body_par_count.length < 2) {
          let json_script = document.querySelector('script[data-fragment-type="PacoArticleContent"]');
          let json_str = json_script.text.substring(json_script.textContent.indexOf('{'));
          try {
            let json = JSON.parse(json_str);
            let article = Object.values(json)[0]['data']['article']['body'];
            auth_body.innerHTML = '';
            let par_html, par_dom, par_elem, par_div, par_key;
            let parser = new DOMParser();
            for (let par of article) {
              for (let key in par) {
                par_dom = document.createElement('p');
                par_elem = '';
                par_key = par[key];
                if (key === 'subhead') {
                  par_html = parser.parseFromString('<div><strong>' + DOMPurify.sanitize(par_key) + '</strong></div>', 'text/html');
                  par_elem = par_html.querySelector('div');
                } else if (key === 'twitter' || key === 'instagram') {
                  par_elem = document.createElement('a');
                  Object.assign(par_elem, {
                    href: par_key,
                    innerText: par_key.split('?')[0],
                    target: '_blank'
                  });
                } else if (key === 'youtube') {
                  par_elem = document.createElement('iframe');
                  Object.assign(par_elem, {
                    src: 'https://www.youtube.com/embed/' + par_key.id,
                    id: 'ytplayer',
                    type: 'text/html',
                    width: 640,
                    height: 360,
                    frameborder: 0
                  });
                } else if (key === 'streamone') {
                  par_elem = document.createElement('iframe');
                  Object.assign(par_elem, {
                    src: 'https://content.tmgvideo.nl/embed/item=' + par_key.id,
                    type: 'text/html',
                    width: 640,
                    height: 360,
                    frameborder: 0
                  });
                } else if (key === 'image') {
                  par_elem = document.createElement('div');
                  let par_img = document.createElement('img');
                  par_img.src = par_key.url;
                  par_elem.appendChild(par_img);
                  par_div = document.createElement('div');
                  par_div.innerText = par[key].caption ? par[key].caption : '';
                  par_div.innerText += par[key].credit ? '\n' + par[key].credit : '';
                  par_elem.appendChild(par_div);
                } else {
                  par_html = parser.parseFromString('<p style="font-size: 18px; line-height: 1.625;">' + DOMPurify.sanitize(par_key) + '</div>', 'text/html');
                  par_elem = par_html.querySelector('p');
                }
                if (par_elem)
                  par_dom.appendChild(par_elem);
                auth_body.appendChild(par_dom);
              }
            }
          } catch (err) {
            console.warn('unable to parse text');
            console.warn(err);
          }
        }
      }
    }
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('nrc.nl')) {
  window.setTimeout(function () {
    let mijnnrc_overlay = document.querySelector('#mijnnrc__modal__overlay');
    let subscribe_bar = document.querySelector('.header__subscribe-bar');
    removeDOMElement(mijnnrc_overlay, subscribe_bar);
    let paywall = document.querySelector('.has-paywall');
    if (paywall)
      paywall.classList.remove('has-paywall');
    let paywall_overlay = document.querySelector('.has-paywall-overlay');
    if (paywall_overlay)
      paywall_overlay.classList.remove('has-paywall-overlay');
  }, 100);
}

else if (matchDomain(["parool.nl", "trouw.nl", "volkskrant.nl", "humo.be", "demorgen.be"])) {
  let banners = document.querySelectorAll('div[data-temptation-position^="PAGE_"], div[class^="ad--"]');
  let paywall = document.querySelectorAll('[data-temptation-position^="ARTICLE_"]');
  removeDOMElement(...banners, ...paywall);
}

else if (matchDomain('telegraaf.nl')) {
  if (window.location.href.startsWith('https://www.telegraaf.nl/error?ref=/')) {
    window.setTimeout(function () {
      window.location.href = window.location.href.split('&')[0].replace('error?ref=/', '');
    }, 500);
  }
  let refresh = document.querySelector('div[id="content"] > meta[http-equiv="refresh"]');
  if (refresh) {
    window.setTimeout(function () {
      window.location.reload(true);
    }, 500);
  }
  let article_wrapper = document.querySelector('.ArticlePageWrapper__uid');
  let spotx_banner = document.querySelector('.ArticleBodyBlocks__inlineArticleSpotXBanner');
  let paywall = document.querySelector('.MeteringNotification__backdrop');
  removeDOMElement(spotx_banner, paywall);
  let premium = document.querySelector('.PremiumLabelWithLine');
  let article_id = article_wrapper ? article_wrapper.innerText : '123';
  let article_body_done = document.querySelector('#articleBody' + article_id);
  if (premium && !article_body_done) {
    let article_body_old = document.querySelector('[id^="articleBody"]');
    removeDOMElement(article_body_old);
    let html = document.documentElement.outerHTML;
    let json = html.includes('window.__APOLLO_STATE__=') ? html.split('window.__APOLLO_STATE__=')[1].split('};')[0] + '}' : '';
    if (json) {
      let json_article_id = json.split('uid\":')[1].split(',\"')[0];
      if (json_article_id && json_article_id !== article_id) {
        window.setTimeout(function () {
          window.location.reload(true);
        }, 500);
      }
      let json_text = json.includes('"body":"') ? json.split('"body":"')[1].split('","__typename":')[0] : '';
      if (json_text) {
        let intro = document.querySelector('span[id^="articleIntro"]');
        if (intro)
          json_text = json_text.replace(intro.innerText + '\n\n', '');
        let article_body = document.querySelector('section.TextArticlePage__bodyText');
        if (article_body) {
          let div_main = document.createElement('div');
          div_main.setAttribute('id', 'articleBody' + article_id);
          let div_elem = document.createElement('div');
          div_elem.setAttribute('data-element', 'articleBodyBlocks');
          let text_array = json_text.split('\\n');
          text_array.forEach(p_text => {
            let p_div = document.createElement('p');
            p_div.setAttribute('class', 'ArticleBodyBlocks__paragraph');
            p_div.innerText = p_text;
            div_elem.appendChild(p_div);
          });
          div_main.appendChild(div_elem);
          article_body.appendChild(div_main);
        }
      }
    }
  }
}

else
  csDone = true;

} else if (window.location.hostname.match(/\.(ie|uk)$/) || matchDomain(['theathletic.com'])) {//united kingdom/ireland

if (matchDomain('prospectmagazine.co.uk')) {
  let url = window.location.href;
  document.addEventListener('DOMContentLoaded', () => {
    let paywall = document.querySelector('div.paywall_overlay_blend, div.paywall');
    if (paywall) {
      removeDOMElement(paywall);
      let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url.split('//')[1];
      replaceDomElementExt(url_cache, true, false, 'main', 'Failed to load from Google webcache: ');
    }
  });
}

else if (matchDomain('spectator.co.uk')) {
  let url = window.location.href.split('?')[0];
  if (url.match(/\/amp(\/)?$/)) {
    let paywall = document.querySelectorAll('div[amp-access^="p.show"');
    let not_logged_in = document.querySelector('div[amp-access*="NOT loggedIn"]');
    removeDOMElement(...paywall, not_logged_in)
  } else {
    let premium = document.querySelector('.HardPayWallContainer-module__overlay');
    removeDOMElement(premium);
    if (premium)
      window.location.href = url + '/amp';
  }
}

else if (matchDomain('telegraph.co.uk')) {
  let url = window.location.href;
  if (new URL(url).pathname.endsWith('/amp/')) {
    let paywall = document.querySelector('.premium-paywall');
    if (paywall) {
      let truncated_content = document.querySelector('.truncated-content');
      removeDOMElement(paywall, truncated_content);
      let subscr_section = document.querySelector('.notAccessibleForFree[amp-access-hide]');
      if (subscr_section)
        subscr_section.removeAttribute('amp-access-hide');
    }
  }
}

else if (matchDomain('the-tls.co.uk')) {
  let paywall = document.querySelector('.tls-subscriptions-banner__closed-skin');
  removeDOMElement(paywall);
}

else if (matchDomain(['theathletic.com', 'theathletic.co.uk'])) {
  if (!window.location.href.includes('?amp')) {
    let paywall = document.querySelectorAll('div#paywall-container, div[subscriptions-action="subscribe"], a.headline-paywall');
    let amphtml = document.querySelector('link[rel="amphtml"]');
    if (paywall && amphtml) {
      removeDOMElement(...paywall);
      window.setTimeout(function () {
        window.location.href = amphtml.href;
      }, 500); // Delay (in milliseconds)
    }
  } else {
    let subscr_sections = document.querySelectorAll('[subscriptions-section="content"]');
    for (let subscr_section of subscr_sections)
      subscr_section.removeAttribute('subscriptions-section');
    let subscr_actions = document.querySelectorAll('[subscriptions-actions]');
    removeDOMElement(...subscr_actions);
    let podcast = document.querySelector('div[id^="podcast-clip-"]');
    if (podcast) {
      let podcast_src = podcast.innerHTML.replace(/<amp-/g, '<').replace(/<\/amp-/g, '</');
      let parser = new DOMParser();
      let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(podcast_src, {ADD_TAGS: ['iframe'], ADD_ATTR: ['layout', 'sandbox']}) + '</div>', 'text/html');
      let podcast_new = doc.querySelector('div');
      if (podcast_new)
        podcast.parentNode.replaceChild(podcast_new, podcast);
    }
  }
}

else if (matchDomain('thetimes.co.uk')) {
  let block = document.querySelector('.subscription-block');
  let adverts = document.querySelectorAll('#ad-article-inline, #sticky-ad-header, div[class*="InlineAdWrapper"], div[class*="NativeAd"], div.responsiveweb-sc-1exejum-0');
  removeDOMElement(block, ...adverts);
  let url = window.location.href;
  let paywall = document.querySelector('div#paywall-portal-article-footer');
  if (paywall && !url.includes('?shareToken=')) {
    removeDOMElement(paywall);
    let article = document.querySelector('article[role="article"]');
    if (article)
      article.insertBefore(archiveLink(url), article.firstChild);
  }
  let paywall_page = document.querySelector('div#paywall-portal-page-footer');
  removeDOMElement(paywall_page);
}

else if (!matchDomain(['belfasttelegraph.co.uk', 'independent.ie']))
  csDone = true;

} else if (window.location.hostname.match(/\.(br|cl|pe)$/) || matchDomain(['elmercurio.com', 'latercera.com', 'lasegunda.com', 'valor.globo.com'])) {//south america

if (matchDomain(['elcomercio.pe', 'gestion.pe'])) {
  let paywall = document.querySelector('.story-content__nota-premium');
  if (paywall) {
    paywall.classList.remove('story-content__nota-premium');
    paywall.removeAttribute('style');
  }
}

else if (matchDomain('elmercurio.com')) {
  window.setTimeout(function () {
    let elem_hidden = document.querySelectorAll('[style="visibility:hidden"]');
    for (let elem of elem_hidden)
      elem.removeAttribute('style');
    let page_pdf_content = document.querySelector('div.page_pdf_content');
    let close_html = document.querySelector('div.close_html');
    removeDOMElement(page_pdf_content, close_html)
  }, 1000); // Delay (in milliseconds)
  window.setTimeout(function () {
    let cont_articlelight = document.querySelector('div.cont_articlelight');
    if (cont_articlelight)
      cont_articlelight.setAttribute('style', 'height: 100% !important; width: 90% !important');
  }, 3000); // Delay (in milliseconds)
}

else if (matchDomain('estadao.com.br')) {
  let paywall = document.getElementById('paywall-wrapper-iframe-estadao');
  removeDOMElement(paywall);
}

else if (matchDomain('folha.uol.com.br')) {
  let signup = document.querySelector('.c-top-signup');
  removeDOMElement(signup);
}

else if (matchDomain('latercera.com')) {
    let subscr_banner = document.querySelector('.empty');
    removeDOMElement(subscr_banner);
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

else if (matchDomain('valor.globo.com')) {
  let url = window.location.href;
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url;
    replaceDomElementExt(url_cache, true, false, 'div.protected-content', 'Failed to load from Google webcache: ');
  }
  let skeleton_box = document.querySelector('div.glb-skeleton-box');
  if (skeleton_box) {
    skeleton_box.classList.remove('glb-skeleton-box');
    skeleton_box.removeAttribute('style');
  }
}

else
  csDone = true;

} else {//other (like com/org & not at/be/br/ch/cl/de/fr/es/ie/nl/pe/pt/uk))

if (matchDomain('adweek.com')) {
  let url = window.location.href;
  let body_single = document.querySelector('body.single');
  let amphtml = document.querySelector('link[rel="amphtml"]');
  if (body_single && amphtml) {
    body_single.classList.remove('single');
    window.location.href = amphtml.href;
  }
}

else if (matchDomain('americanbanker.com')) {
  let inline_gate = document.querySelector('.inline-gate');
  if (inline_gate) {
    inline_gate.classList.remove('inline-gate');
    let inline_gated = document.querySelectorAll('.inline-gated');
    for (let elem of inline_gated)
      elem.classList.remove('inline-gated');
  }
}

else if (matchDomain('americanaffairsjournal.org')) {
  let paywall_bar = document.querySelector('.paywall-notification-bar-wrapper');
  removeDOMElement(paywall_bar);
}

else if (matchDomain('asia.nikkei.com')) {
  let popup = document.querySelector('.pw-widget--popup');
  removeDOMElement(popup);
}

else if (matchDomain('asiatimes.com')) {
  let paywall = document.querySelector('div[amp-access="NOT story.ordered"]');
  removeDOMElement(paywall);
  let div_hidden = document.querySelector('div[amp-access="story.ordered"][amp-access-hide]');
  if (div_hidden)
    div_hidden.removeAttribute('amp-access-hide');
  let adverts = document.querySelectorAll('amp-ad, amp-consent, amp-embed');
  removeDOMElement(...adverts);
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
    let signin_links = document.querySelectorAll('a.primary-button--link[href*="target="]');
    for (let signin_link of signin_links) {
      signin_link.href = decodeURIComponent(signin_link.href.split('target=')[1]).split('?')[0];
      signin_link.text = 'Click';
    }
    let barrons_ads = document.querySelectorAll('.barrons-body-ad-placement');
    removeDOMElement(...barrons_ads);
  } else {
    let preview = document.querySelector('section[subscriptions-section="content-not-granted"]');
    removeDOMElement(preview);
    let subscr_section = document.querySelector('section[subscriptions-section="content"]');
    if (subscr_section)
      subscr_section.removeAttribute('subscriptions-section');
    let wsj_ads = document.querySelectorAll('.wsj-ad');
    removeDOMElement(...wsj_ads);
  }
}

else if (matchDomain('bloomberg.com')) {
  function bloomberg_noscroll(node) {
    node.removeAttribute('data-paywall-overlay-status');
  }
  waitDOMElement('div#fortress-paywall-container-root', 'DIV', removeDOMElement, true);
  waitDOMAttribute('body', 'BODY', 'data-paywall-overlay-status', bloomberg_noscroll, true);
  sessionStorage.clear();
  let paywall = document.querySelector('div#fortress-paywall-container-root');
  let counter = document.querySelector('div#fortress-preblocked-container-root');
  let noscroll = document.querySelector('body[data-paywall-overlay-status]');
  if (noscroll)
    noscroll.removeAttribute('data-paywall-overlay-status');
  removeDOMElement(paywall, counter);
  let url = window.location.href;
  if (url.match(/\/(articles|features)\//)) {
    let leaderboard = document.querySelector('div[id^="leaderboard"], div.leaderboard-wrapper');
    let shimmering_content = document.querySelectorAll('div[class^="shimmering-"]');
    let page_ad = document.querySelectorAll('div.page-ad, div[data-ad-placeholder]');
    let reg_ui_client = document.querySelector('div#reg-ui-client');
    removeDOMElement(leaderboard, ...shimmering_content, ...page_ad, reg_ui_client);
    let hidden_images = document.querySelectorAll('img.lazy-img__image[src][data-native-src]');
    for (let hidden_image of hidden_images) {
      if (hidden_image.src.match(/\/60x-1\.(png|jpg)$/))
        hidden_image.setAttribute('src', hidden_image.getAttribute('data-native-src'));
      hidden_image.style.filter = 'none';
    }
    let hidden_charts = document.querySelectorAll('div[data-toaster-id][data-src]');
    for (let hidden_chart of hidden_charts) {
      let elem = document.createElement('iframe');
      Object.assign(elem, {
        src: hidden_chart.getAttribute('data-src'),
        frameborder: 0,
        height: hidden_chart.getAttribute('style').replace('min-height: ', ''),
        scrolling: 'no'
      });
      hidden_chart.parentNode.replaceChild(elem, hidden_chart);
    }
    let blur = document.querySelector('div.blur[style]');
    if (blur) {
      blur.classList.remove('blur');
      blur.removeAttribute('style');
    }
    let json_script = document.querySelector('script[data-component-props="ArticleBody"], script[data-component-props="FeatureBody"]');
    if (json_script && dompurify_loaded) {
      let json = JSON.parse(json_script.innerHTML);
      if (json) {
        let json_text = json.body ? json.body : '';
        if (json_text) {
          removeDOMElement(json_script);
          let article = document.querySelector('div.body-copy-v2:not(.art_done)');
          let article_class = 'body-copy-v2';
          if (!article) {
            article = document.querySelector('div.body-copy:not(.art_done)');
            article_class = 'body-copy';
          }
          if (article) {
            article_class += ' art_done';
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div class="' + article_class + '">' + DOMPurify.sanitize(json_text, {ADD_TAGS: ['iframe', 'script']}) + '</div>', 'text/html');
            let article_new = doc.querySelector('div');
            if (article_new)
              article.parentNode.replaceChild(article_new, article);
          }
        }
      }
    }
  }
}

else if (matchDomain('bloombergquint.com')) {
  let articlesLeftModal = document.querySelector('.paywall-meter-module__story-paywall-container__1UgCE');
  let paywall = document.getElementById('paywallDmp');
  removeDOMElement(articlesLeftModal, paywall);
}

else if (matchDomain('bostonglobe.com')) {
  let paywall = document.querySelector('div.meter-paywall');
  let fade = document.querySelector('div.fade');
  if (paywall || fade) {
    removeDOMElement(paywall);
    let body_hidden = document.querySelector('body[style]');
    if (body_hidden)
      body_hidden.removeAttribute('style');
    let continue_button = document.querySelector('button.continue_button');
    if (continue_button)
      continue_button.click();
  }
}

else if (matchDomain('business-standard.com')) {
  let skip_button = document.querySelector('a.btn_skip');
  if (skip_button)
    skip_button.click();
  let p_content = document.querySelector('span.p-content.paywall');
  if (p_content) {
    p_content.classList.remove('paywall');
    let scripts = document.querySelectorAll('script[type="application/ld+json"]');
    let json;
    for (let script of scripts) {
      if (script.innerText.includes('articleBody'))
        json = script;
    }
    if (json) {
      let json_text = JSON.parse(json.text.replace(/(\r|\n|\t)/gm, ''))[0].articleBody;
      json_text = parseHtmlEntities(json_text);
      json_text = json_text.replace(/(?:^|[\w\"\'\’])(\.|\?|!)(?=[A-Z\"\”\“\‘\’\'][A-Za-zÀ-ÿ\"\”\“\‘\’\']{1,})/gm, "$&\r\n\r\n") + '\r\n\r\n';
      let article = document.createElement('div');
      article.innerText = json_text;
      if (article) {
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
	 
 

else if (matchDomain('businessoffashion.com')) {
  let paywall = document.querySelector('div.paywall');
  if (paywall) {
    let article_locked = document.querySelector('div.article-locked');
    if (article_locked)
      article_locked.removeAttribute('class');
    let article_locked_overlay = document.querySelector('div.article-locked-overlay');
    removeDOMElement(paywall, article_locked_overlay);
  }
}

else if (matchDomain('caixinglobal.com')) {
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
  }, 1000); // Delay (in milliseconds)
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

else if (matchDomain('cen.acs.org')) {
  document.addEventListener('DOMContentLoaded', () => {
    let meteredBar = document.querySelector('.meteredBar');
    removeDOMElement(meteredBar);
  });
}

else if (matchDomain('chronicle.com')) {
  let preview = document.querySelector('div[data-content-summary]');
  removeDOMElement(preview);
  let article_hidden = document.querySelector('div[data-content-body]');
  if (article_hidden)
    article_hidden.removeAttribute('data-content-body');
}

else if (matchDomain('csmonitor.com')) {
  let paywall = document.querySelector('div.paywall');
  removeDOMElement(paywall);
}

else if (matchDomain('discovermagazine.com')) {
  window.setTimeout(function () {
    let mammoth = document.querySelector('.iXVGnF');
    if (mammoth)
      window.location.reload();
    let banner = document.querySelector('div.dPURIw');
    if (banner)
      banner.setAttribute('style', 'display:none;');
  }, 1000); // Delay (in milliseconds)
}

else if (matchDomain('economictimes.com')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div#blocker_layer');
    let data_prime = document.querySelector('div[data-prime="1"]');
    if ((paywall || data_prime) && dompurify_loaded) {
      removeDOMElement(paywall);
      if (data_prime)
        data_prime.removeAttribute('data-prime');
      let content = document.querySelector('div[id^="articlebody_"]');
      if (content && content.classList.contains('paywall')) {
        content.classList.remove('paywall');
        window.location.reload(true);
      }
      let full_text = document.querySelector('div.paywall:not([id])');
      if (content && full_text) {
        content.innerText = '';
        let parser = new DOMParser();
        html = parser.parseFromString('<div>' + DOMPurify.sanitize(full_text.innerHTML, {ADD_ATTR: ['frameborder'], ADD_TAGS: ['iframe']}) + '</div>', 'text/html');
        let article = html.querySelector('div');
        content.appendChild(article);
        removeDOMElement(full_text);
        let data_adaptive = document.querySelector('div[data-adaptive="1"]');
        if (data_adaptive)
          data_adaptive.removeAttribute('data-adaptive');
        let prime_banner = document.querySelector('div.q0AQz');
        removeDOMElement(prime_banner);
      }
    }
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('economictimes.indiatimes.com')) {
  let paywall = document.querySelector('section.prime_paywall');
  if (paywall) {
    removeDOMElement(paywall);
    let content = document.querySelector('div.content1, div.artText');
    let full_text = document.querySelector('div.paywall.p1');
    if (content && full_text)
      content.innerText = full_text.innerText;
    let page_content = document.querySelector('div.pageContent:not([style]');
    if (page_content)
      page_content.setAttribute('style', 'height: auto !important;');
  }
}

else if (matchDomain('economist.com')) {
  document.addEventListener('DOMContentLoaded', () => {
    let subscribe = document.querySelector('.subscription-proposition');
    let wrapper = document.getElementById('bottom-page-wrapper');
    removeDOMElement(subscribe, wrapper);
    let adverts = document.querySelectorAll('div.advert');
    for (let advert of adverts)
      advert.setAttribute('style', 'display:none');
    window.setTimeout(function () {
      let paywall = document.querySelector('.layout-article-regwall'); ;
      if (paywall) {
        window.location.reload(true);
      }
    }, 600); // Delay (in milliseconds)
    let p_articles = document.querySelectorAll('p.article__body-text');
    let href;
    for (let p_article of p_articles) {
      let e_anchors = document.querySelectorAll('a');
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

else if (matchDomain('entrepreneur.com')) {
  let promo = document.querySelector('.paywall-promo');
  if (promo) {
    removeDOMElement(promo);
    let gate_check = document.querySelector('.gate-check');
    if (gate_check)
      gate_check.removeAttribute('class');
    let hidden_images = document.querySelectorAll('img.lazy[src*="blur"][data-src]');
    for (let hidden_image of hidden_images)
      hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
  }
}

else if (matchDomain(fi_alma_talent_domains)) {
  let ads = document.querySelectorAll('div[class^="p2m385-"]');
  removeDOMElement(...ads);
}

else if (matchDomain('firstthings.com')) {
  let paywall = document.querySelector('.paywall');
  removeDOMElement(paywall);
}

else if (matchDomain('foreignaffairs.com')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('.paywall');
    let loading_indicator = document.querySelector('.loading-indicator');
    let msg_bottom = document.querySelector('.messages--container--bottom');
    removeDOMElement(paywall, loading_indicator, msg_bottom);
    let article_dropcap = document.querySelectorAll('.article-dropcap');
    for (let elem of article_dropcap)
      elem.classList.add('loaded');
    let hidden_images = document.querySelectorAll('img[src^="data:image/"][data-src]');
    for (let hidden_image of hidden_images) {
      hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
      hidden_image.removeAttribute('class');
    }
    let img_list = document.querySelectorAll('.magazine-list-article img');
    for (let img_elem of img_list)
      img_elem.setAttribute('class', 'mb-4');
    if (window.location.href.includes('/interviews/')) {
      let img_header = document.querySelector('.interview-header > div');
      if (img_header) {
        let img_src = img_header.getAttribute('data-src');
        let img_elem = document.createElement('img');
        img_elem.src = img_src;
        img_header.appendChild(img_elem);
      }
    }
  }, 1000); // Delay (in milliseconds)
}

else if (matchDomain('foreignpolicy.com')) {
  let content_ungated = document.querySelector('div.content-ungated');
  removeDOMElement(content_ungated);
  let content_gated = document.querySelector('div.content-gated');
  if (content_gated)
    content_gated.classList.remove('content-gated');
}

else if (matchDomain('ft.com')) {
  if (window.location.hostname.startsWith('amp.')) {
    let subscr_section = document.querySelector('[subscriptions-section="content"]');
    if (subscr_section)
      subscr_section.removeAttribute('subscriptions-section');
    let amp_ads = document.querySelectorAll('.ad-container, amp-ad');
    removeDOMElement(...amp_ads);
  } else {
    let cookie_banner = document.querySelector('.o-banner__outer');
    let ribbon = document.querySelector('.js-article-ribbon');
    let ads = document.querySelector('.o-ads');
    removeDOMElement(cookie_banner, ribbon, ads);
  }
}

else if (matchDomain('griffithreview.com')) {
  let body_single = document.querySelector('body.single');
  if (body_single)
    body_single.classList.remove('single');
  let subscribe = document.querySelector('div.call-to-action');
  removeDOMElement(subscribe);
}

else if (matchDomain('harpers.org')) {
  let overlay = document.querySelector('div[id^="pum-"]');
  removeDOMElement(overlay);
  let entry_content = document.querySelectorAll('.entry-content');
  for (let elem of entry_content)
    elem.setAttribute('style', 'display: block !important');
}

else if (matchDomain('hbr.org')) {
  let popup = document.querySelector('.persistent-banner');
  removeDOMElement(popup);
}

else if (matchDomain('hindustantimes.com')) {
  let paywall = document.querySelector('.freemium-card');
  if (paywall) {
    removeDOMElement(paywall);
    let freemium_text = document.querySelector('.freemiumText');
    if (freemium_text)
      freemium_text.classList.remove('freemiumText');
  }
  let noscroll = document.querySelector('body.open-popup');
  if (noscroll)
    noscroll.classList.remove('open-popup');
  let close_story = document.querySelector('.closeStory');
  let ads = document.querySelectorAll('div[class^="adHeight"]');
  removeDOMElement(close_story, ...ads);
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
}

else if (matchDomain(['houstonchronicle.com', 'sfchronicle.com'])) {
  let wrapper = document.querySelector('.belowMastheadWrapper');
  removeDOMElement(wrapper);
}

else if (matchDomain('inc42.com')) {
  let url = window.location.href;
  if (!url.includes('/amp/')) {
    let premium = document.querySelector('div.premium-container');
    if (premium) {
      removeDOMElement(premium);
      window.location.href = url.split('?')[0] + 'amp/';
    }
  } else {
    let plus_popup = document.querySelector('div#plus-pop');
    if (plus_popup) {
      removeDOMElement(plus_popup);
      let expired = document.querySelectorAll('div[amp-access="p.showPageviewExpired"], div[amp-access="cm.maxViews AND NOT loggedIn"]');
      removeDOMElement(...expired);
      let not_expired = document.querySelectorAll('div[amp-access^="NOT p.showPageviewExpired"][amp-access-hide]');
      for (let elem of not_expired)
        elem.removeAttribute('amp-access-hide');
    }
  }
}

else if (matchDomain('infzm.com')) {
  let url = window.location.href;
  if (url.includes('/wap/#/')) {
    let container = document.querySelector('section.container');
    if (container)
      container.classList.remove('container');
    let overlay = document.querySelector('div.article-content[style]');
    if (overlay)
      overlay.removeAttribute('style');
  }
}

else if (matchDomain('inkl.com')) {
  document.addEventListener('DOMContentLoaded', () => {
    let menu_btn = document.querySelector('div.left-buttons-container button.menu-btn');
    if (!menu_btn) {
      let article_container = document.querySelector('div.article-content-container');
      if (article_container)
        article_container.setAttribute('style', 'overflow: visible; max-height: none;');
      let gradient_container = document.querySelector('div.gradient-container');
      if (gradient_container)
        gradient_container.setAttribute('style', 'height:auto;');
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
        let ng_click = summary_body.getAttribute('ng-click').replace("showArticle('", '').replace("')", '');
        let weblink = document.createElement('a');
        weblink.text = 'open';
        weblink.href = 'https://www.inkl.com/news/' + ng_click;
        summary_body.appendChild(weblink);
      }
    }
  }
}

else if (matchDomain('jpost.com')) {
  let premium_banners = document.querySelectorAll('.hide-for-premium, #hiddenPremiumForm, #hiddenLink');
  removeDOMElement(...premium_banners);
}

else if (matchDomain('law360.com')) {
  window.setTimeout(function () {
    let modal = document.querySelectorAll('div#NewsletterModal, div.modal-backdrop');
    removeDOMElement(...modal);
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('livelaw.in')) {
  let paywall = document.querySelectorAll('div.restricted_message > div.story, div.restricted_message > div.row');
  if (paywall) {
    removeDOMElement(...paywall);
    let paywall_content = document.querySelector('div.paywall-content.hide');
    if (paywall_content)
      paywall_content.classList.remove('hide');
  }
}

else if (matchDomain('magazine.atavist.com')) {
  let bottom_notification = document.querySelector('div.bottom-notification');
  let overlay = document.querySelector('div.notification-overlay');
  removeDOMElement(bottom_notification, overlay);
  let paywall = document.querySelector('body.paywall-notification-visible');
  if (paywall)
    paywall.classList.remove('paywall-notification-visible');
}

else if (matchDomain('marketwatch.com')) {
  let premium = document.querySelector('html.is-paywall');
  let url = window.location.href;
  if (!url.includes('/amp/')) {
    if (premium) {
      premium.classList.remove('is-paywall');
      window.location.href = url.replace('.marketwatch.com/', '.marketwatch.com/amp/');
    }
  } else {
    let meter = document.querySelector('div.meter');
    let container_sponsored = document.querySelector('div.container--sponsored');
    let amp_ads = document.querySelectorAll('.display-ad');
    removeDOMElement(meter, container_sponsored, ...amp_ads);
    let preview = document.querySelector('div[subscriptions-section="content-not-granted"]');
    if (preview) {
      removeDOMElement(preview);
      let subscr_section = document.querySelector('section[subscriptions-section="content"]');
      if (subscr_section)
        subscr_section.removeAttribute('subscriptions-section');
    }
  }
  let ads = document.querySelectorAll('div.element--ad, div.j-ad');
  removeDOMElement(...ads);
}

else if (matchDomain('medianama.com')) {
  window.setTimeout(function () {
    let modal = document.querySelector('div.modal');
    removeDOMElement(modal);
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('mexiconewsdaily.com')) {
  window.setTimeout(function () {
    let popup = document.querySelector('div.pigeon-widget-prompt');
    let cpro_overlay = document.querySelector('.cpro-overlay');
    removeDOMElement(popup, cpro_overlay);
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('nation.africa')) {
  let datawall_content = document.querySelector('.datawall-content');
  if (datawall_content)
    datawall_content.classList.remove('datawall-content');
  let div_hidden = document.querySelectorAll('[data="datawall-content"]');
  for (let elem of div_hidden)
    elem.removeAttribute('style');
  let hidden_images = document.querySelectorAll('img.lazy-img:not([src])[data-srcset]');
  for (let hidden_image of hidden_images) {
    hidden_image.classList.remove('lazy-img');
    hidden_image.setAttribute('src', hidden_image.getAttribute('data-srcset').split(',')[1].split(' ')[0]);
  }
}

else if (matchDomain('nationalgeographic.com')) {
  // plus code in contentScript_once.js
  let url = window.location.href;
  let subscribed = document.querySelector('.Article__Content--gated');
  let overlay = document.querySelector('.Article__Content__Overlay--gated');
  let msg = document.querySelector('div#bpc_archive');
  if (subscribed && !msg) {
    subscribed.appendChild(archiveLink(url));
    subscribed.setAttribute('style', 'overflow: visible !important;');
    if (overlay)
      overlay.classList.remove('Article__Content__Overlay--gated');
  }
}

else if (matchDomain('nationalreview.com')) {
  let url = window.location.href.split('?')[0];
  if (!url.includes('/amp/')) {
    let continue_reading = document.querySelector('div.continue-reading');
    if (continue_reading) {
      removeDOMElement(continue_reading);
      window.location.href = url + 'amp';
    }
  }
  let adverts = document.querySelectorAll('amp-ad, .ad-unit--center');
  removeDOMElement(...adverts);
}

else if (matchDomain('newleftreview.org')) {
  window.setTimeout(function () {
    let url = window.location.href;
    let paywall = document.querySelector('div.promo-wrapper');
    if (paywall) {
      removeDOMElement(paywall);
      let url_cache = 'https://webcache.googleusercontent.com/search?q=cache:' + url.split('//')[1];
      replaceDomElementExt(url_cache, true, false, 'div.article-page', 'Failed to load from Google webcache: ');
    }
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('newstatesman.com')) {
  let tns_modal_wrapper = document.querySelector('.tns-modal-wrapper');
  removeDOMElement(tns_modal_wrapper);
}

else if (matchDomain('newrepublic.com')) {
  let pw_opups = document.querySelector('div#pwPopups');
  removeDOMElement(pw_opups);
}

else if (matchDomain('newyorker.com') && window.location.href.split('?')[0].match(/\.com\/.+\//) ) {
  let paywall_bar = document.querySelector('.paywall-bar');
  removeDOMElement(paywall_bar);
  let invisible_assets = document.querySelectorAll('.responsive-asset--invisible');
  for (let asset_invisible of invisible_assets)
    asset_invisible.classList.remove('responsive-asset--invisible');
  let overlays = document.querySelectorAll('.aspect-ratio--overlay-container, .asset-embed__asset-container');
  let parser = new DOMParser();
  for (let overlay of overlays) {
    let noscript = overlay.querySelector('noscript');
    if (noscript && noscript.innerHTML && dompurify_loaded) {
      let html = parser.parseFromString(DOMPurify.sanitize(noscript.innerHTML), 'text/html');
      overlay.appendChild(html.querySelector('img'));
      removeDOMElement(noscript);
    }
  }
}

else if (matchDomain('nzherald.co.nz')) {
  let article_content = document.querySelector('.article__content');
  if (article_content) {
    let article_offer = document.querySelector('.article-offer');
    if (article_offer && dompurify_loaded) {
      removeDOMElement(article_offer);
      let css_selector = article_content.querySelectorAll('p[style]')[1].getAttribute('class');
      let hidden_not_pars = article_content.querySelectorAll('.' + css_selector + ':not(p)');
      for (let hidden_not_par of hidden_not_pars) {
        hidden_not_par.classList.remove(css_selector);
        hidden_not_par.removeAttribute('style');
      }
      let hidden_pars = article_content.querySelectorAll('p.' + css_selector);
      let par_html, par_dom;
      let parser = new DOMParser();
      for (let hidden_par of hidden_pars) {
        let par_html = parser.parseFromString('<div style="margin: 10px 0px; font-size: 17px">' + DOMPurify.sanitize(hidden_par.innerHTML) + '</div>', 'text/html');
        let par_dom = par_html.querySelector('div');
        article_content.insertBefore(par_dom, hidden_par);
      }
      let first_span = document.querySelector('p > span');
      if (first_span)
        first_span.removeAttribute('class');
    }
  }
  let premium_toaster = document.querySelector('#premium-toaster');
  removeDOMElement(premium_toaster);
}

else if (matchDomain('nybooks.com')) {
  let paywall_article = document.querySelector('.paywall-article');
  if (paywall_article)
    paywall_article.classList.remove('paywall-article');
  let banner = document.querySelector('div.toast-cta');
  removeDOMElement(banner);
}

else if (matchDomain('nyteknik.se')) {
  // plus code in contentScript_once.js
  let locked_article = document.querySelector('div.locked-article');
  if (locked_article)
    locked_article.classList.remove('locked-article');
}

else if (matchDomain('nytimes.com')) {
  function nyt_main() {
    navigator.storage.estimate = undefined;
    webkitRequestFileSystem = function () {};
  }
  insert_script(nyt_main);
  let preview_button = document.querySelector('.css-3s1ce0');
  if (preview_button)
    preview_button.click();
  if (window.location.hostname === 'cooking.nytimes.com') {
    let no_scroll = document.querySelectorAll('.nytc---modal-window---noScroll');
    for (let elem of no_scroll)
      elem.classList.remove('nytc---modal-window---noScroll');
    let login = document.querySelector('.nytc---modal-window---isShown');
    if (login) {
      let close_button = login.querySelector('span[aria-label="close"]');
      if (!close_button)
        login.classList.remove('nytc---modal-window---isShown');
    }
  } else {
    waitDOMElement('div[data-testid="inline-message"]', 'DIV', removeDOMElement, false);
    waitDOMElement('div.expanded-dock', 'DIV', removeDOMElement, false);
    csDoneOnce = true;
  }
}

else if (matchDomain('qz.com')) {
  let url = window.location.href;
  window.setTimeout(function () {
    if (url.includes('utm_source='))
      window.location.href = url.split('?')[0];
  }, 500); // Delay (in milliseconds)
  let paywall = document.querySelector('div.KbD9m');
  let overflow = document.querySelector('div._7S-qA');
  let msg = document.querySelector('div#bpc_archive');
  if (paywall && !msg) {
    if (overflow)
      overflow.classList.remove('_7S-qA');
    let article = document.querySelector('div#article-content');
    if (article)
      article.appendChild(archiveLink(url));
  }
}

else if (matchDomain('sandiegouniontribune.com')) {
  window.setTimeout(function () {
    let metering_bottompanel = document.querySelector('metering-bottompanel');
    removeDOMElement(metering_bottompanel);
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('scmp.com') && window.location.href.includes('/amp.')) {
  let div_hidden = document.querySelectorAll('div.article-body[amp-access][amp-access-hide]');
  for (let elem of div_hidden)
    elem.removeAttribute('amp-access-hide');
  let default_meters = document.querySelectorAll('div.default-meter, div#archive-article-meter');
  let adverts = document.querySelectorAll('amp-ad, div.ad-banner, div.advert-fly-carpet-container, div.inline-advert');
  removeDOMElement(...default_meters, ...adverts);
}

else if (matchDomain('scribd.com')) {
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

else if (matchDomain('seekingalpha.com')) {
  let url = window.location.href;
  let locked = document.querySelector('div[data-test-id="post-locked-banner"]');
  if (locked && !url.includes('/amp/')) {
    window.setTimeout(function () {
      window.location.href = url.replace('seekingalpha.com/', 'seekingalpha.com/amp/');
    }, 500); // Delay (in milliseconds)
  } else if (url.includes('/amp/')) {
    let div_hidden = document.querySelectorAll('[amp-access*="premium_access OR"][amp-access-hide]');
    for (let elem of div_hidden)
      elem.removeAttribute('amp-access-hide');
    let paywall = document.querySelector('[class*="paywall-container"]');
    if (paywall)
      paywall.setAttribute('style', 'display:none;');
    let adverts = document.querySelectorAll('.ad-wrap');
    removeDOMElement(...adverts);
  }
}

else if (matchDomain('slate.com')) {
  let slate_roadblock = document.querySelector('.slate-roadblock');
  let ads = document.querySelectorAll('section[class*="-ad"]');
  removeDOMElement(slate_roadblock, ...ads);
}

else if (matchDomain('sofrep.com')) {
  let banners = document.querySelectorAll('#scrollerCTA, #botCta');
  removeDOMElement(...banners);
}

else if (matchDomain('staradvertiser.com')) {
  let url = window.location.href.split('?')[0];
  if (url.endsWith('/amp/')) {
    let section_not_granted = document.querySelector('section[subscriptions-section="content-not-granted"]');
    if (section_not_granted) {
      removeDOMElement(section_not_granted);
      let hidden_content = document.querySelector('section[subscriptions-section="content"]');
      if (hidden_content)
        hidden_content.removeAttribute('subscriptions-section');
    }
  } else {
    let paywall = document.querySelector('div#hsa-paywall-overlay');
    if (paywall) {
      removeDOMElement(paywall);
      let div_hidden = document.querySelector('div#hsa-paywall-content[style]');
      if (div_hidden)
        div_hidden.removeAttribute('style');
    }
  }
}

else if (matchDomain('startribune.com')) {
  document.addEventListener('DOMContentLoaded', () => {
    let react_modal_portal = document.querySelectorAll('div.ReactModalPortal');
    removeDOMElement(...react_modal_portal);
    let body_modal = document.querySelector('body.ReactModal__Body--open');
    if (body_modal)
      body_modal.classList.remove('ReactModal__Body--open');
  });
}

else if (matchDomain('stocknews.com')) {
  let hideme = document.querySelector('div#hideme');
  removeDOMElement(hideme);
  let blurmes = document.querySelectorAll('div[id^="blurme"]');
  for (let i = 0; i < blurmes.length; i++)
    blurmes[i].setAttribute('id', 'blurmenot' + i);
}

else if (matchDomain('stratfor.com')) {
  let banner = document.querySelector('.free-cta-container, .paywall-banner');
  removeDOMElement(banner);
  let hidden_images = document.querySelectorAll('img[src^="data:image/gif"][data-src]');
  for (let hidden_image of hidden_images)
    hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
  let url = window.location.href.split('?')[0];
  if (url.match(/(\/(\d){4}-([a-z]|-)+-forecast(-([a-z]|-)+)?|-forecast-(\d){4}-([a-z]|[0-9]|-)+)$/)) {
    json_script = document.querySelector('script#__NEXT_DATA__');
    if (json_script && dompurify_loaded) {
      let json = JSON.parse(json_script.innerText);
      if (json && json.props.pageProps.data) {
        let overview_div = document.querySelector('div[class^="overview_overview__"] > div');
        if (overview_div) {
          let data = json.props.pageProps.data;
          let parser = new DOMParser();
          let doc = parser.parseFromString('<div>' + DOMPurify.sanitize('<p>' + data.teaser_body + '</p>' + data.overview + '<p><h2>Sections</h2></p>' ) + '</div>', 'text/html');
          let content_new = doc.querySelector('div');
          let sections = data.section;
          for (let section of sections) {
            let section_link = document.createElement('a');
            section_link.innerText = section.title;
            section_link.href = 'https://' + window.location.hostname + '/' + section.path_alias;
            content_new.appendChild(section_link);
            content_new.appendChild(document.createElement('br'));
          }
          overview_div.parentNode.replaceChild(content_new, overview_div);
          csDoneOnce = true;
        }
      }
    }
    waitDOMElement('div.paywall-banner', 'DIV', removeDOMElement, false);
  } else if (url.match(/\/article\/.+-forecast(-.+)?\//)) {
    let next_section_buttons = document.querySelectorAll('div[class^="nextSection_nextSection__"] > button');
    for (let elem of next_section_buttons) {
      let section_link = document.createElement('a');
      section_link.innerText = elem.innerText;
      section_link.href = url.replace(/[^\/]+$/, '') + elem.innerText.split(': ')[1].toLowerCase().split(' ').filter(x => !['a', 'an', 'of', 'the'].includes(x)).join('-');
      elem.parentNode.replaceChild(section_link, elem);
    }
  }
}

else if (matchDomain('study.com')) {
  let faded_content = document.querySelector('div.faded-content');
  if (faded_content)
    faded_content.removeAttribute('class');
  let div_hidden = document.querySelector('div.hidden[ng-non-bindable]');
  if (div_hidden)
    div_hidden.removeAttribute('class');
}

else if (matchDomain('techinasia.com')) {
  let paywall = document.querySelector('.paywall-content');
  if (paywall && dompurify_loaded) {
    paywall.classList.remove('paywall-content');
    let url = window.location.href;
    let url_xhr = url.replace('.com/', '.com/wp-json/techinasia/2.0/posts/').replace('/visual-story/', '/');
    fetch(url_xhr)
    .then(response => {
      if (response.ok) {
        response.json().then(json => {
          let json_text = json.posts[0].content;
          json_text = json_text.replace(/width\=\"(\d){3,}\"/g, 'width="100%"').replace(/height\=\"(\d){3,}\"/g, 'height="100%"');
          let content = document.querySelector('div.content');
          if (json_text && content) {
            let parser = new DOMParser();
            let doc = parser.parseFromString('<div class="jsx-1794864983 content">' + DOMPurify.sanitize(json_text) + '</div>', 'text/html');
            let content_new = doc.querySelector('div.content');
            content.parentNode.replaceChild(content_new, content);
          }
        });
      }
    });
  }
  let splash_subscribe = document.querySelector('.splash-subscribe');
  let paywall_hard = document.querySelector('.paywall-hard');
  removeDOMElement(splash_subscribe, paywall_hard);
}

else if (matchDomain('technologyreview.com')) {
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

else if (matchDomain('the-american-interest.com')) {
  let counter = document.getElementById('article-counter');
  removeDOMElement(counter);
}

else if (matchDomain('theatlantic.com')) {
  let banner = document.querySelector('.c-nudge__container,.c-non-metered-nudge');
  removeDOMElement(banner);
}

else if (matchDomain('thedailybeast.com')) {
  let paywall = document.querySelector('div.Body__paywall-container');
  if (paywall) {
    removeDOMElement(paywall);
    let json_script = document.querySelector('script[displayName="initialState"]');
    if (json_script) {
      let json_str = json_script.text.substring(json_script.textContent.indexOf('{'));
      try {
        let json = JSON.parse(json_str);
        if (json.body) {
          let pars = json.body.sections;
          let cards = json.body.cards;
          if (pars) {
            let mobile_doc = document.querySelector('div.Mobiledoc');
            if (mobile_doc) {
              let mobile_doc_text = mobile_doc.innerText.replace(/(\r|\n)/g, '');
              for (let elem of pars) {
                let par_elem = '';
                if (elem[0] === 1) {
                  if (elem[1] === 'p') {
                    let par = '';
                    for (let part of elem[2])
                      par += part[3];
                    if (par && !mobile_doc_text.includes(par)) {
                      par_elem = document.createElement('p');
                      par_elem.innerText = par;
                    }
                  }
                } else if (elem[0] === 10) {
                  if (cards && cards[elem[1]]) {
                    let card = cards[elem[1]];
                    if (card[0] === 'pt-image') {
                      par_elem = document.createElement('p');
                      let par_fig = document.createElement('figure');
                      let par_img = document.createElement('img');
                      par_img.src = card[1].url;
                      par_fig.appendChild(par_img);
                      par_elem.appendChild(par_fig);
                      let par_cap = document.createElement('figcaption');
                      par_cap.innerText = card[1].title + ' ' + card[1].credit;
                      par_elem.appendChild(par_cap);
                    } else if (card[0] === 'pt-fancy-links-card') {
                      par_elem = document.createElement('p');
                      let par_link = document.createElement('a');
                      par_link.href = card[1].links;
                      par_link.innerText = card[1].linksData[0].long_headline;
                      par_elem.appendChild(par_link);
                    }
                  }
                }
                if (par_elem)
                  mobile_doc.appendChild(par_elem);
              }
            }
          }
        }
        csDoneOnce = true;
      } catch (err) {
        console.log(err);
      }
    }
  }
}

else if (matchDomain('thediplomat.com')) {
  let preview = document.querySelector('.dpl-preview');
  if (preview)
    preview.classList.remove('dpl-preview');
}

else if (matchDomain('theglobeandmail.com')) {
  let article_body_subscribed = document.querySelector('.c-article-body--subscribed');
  if (article_body_subscribed)
    article_body_subscribed.removeAttribute('class');
}

else if (matchDomain(['thehindu.com', 'thehindubusinessline.com'])) {
  if (!localStorage.geo) {
    localStorage.setItem("geo", '{"v":{"clientTcpRtt":20,"longitude":"' + makeRandomNumber(2) + '.' + makeRandomNumber(5) + '","httpProtocol":"HTTP/2","tlsCipher":"AEAD-AES128-GCM-SHA256","continent":"EU","asn":1234,"clientAcceptEncoding":"gzip, deflate,br","country":"UK","isEUCountry":"1","tlsClientAuth":{"certIssuerDNLegacy":"","certIssuerDN":"","certIssuerDNRFC2253":"","certSubjectDNLegacy":"","certVerified":"NONE","certNotAfter":"","certSubjectDN":"","certFingerprintSHA1":"","certNotBefore":"","certSerial":"","certPresented":"0","certSubjectDNRFC2253":""},"tlsVersion":"TLSv1.3","colo":"DUS","timezone":"Europe/London","edgeRequestKeepAliveStatus":1,"requestPriority":"weight=220;exclusive=1","botManagement":{"staticResource":false,"verifiedBot":false,"score":99},"clientTrustScore":99,"postalCode":"' + makeRandomNumber(4) + '","regionCode":"QR","region":"County","city":"London","latitude":"' + makeRandomNumber(2) + '.' + makeRandomNumber(5) + '"},"e":' + makeRandomNumber(13) + '}');
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

else if (matchDomain('thelogic.co')) {
  let article_subscribe = document.querySelector('.article-subscribe');
  removeDOMElement(article_subscribe);
}

else if (matchDomain('thenewatlantis.com')) {
  let article_gated = document.querySelector('.article-gated');
  if (article_gated)
    article_gated.classList.remove('article-gated');
}

else if (matchDomain('thepointmag.com')) {
  let overlay = document.querySelectorAll('div.overlay, div#tpopup-');
  for (let elem of overlay)
    removeDOMElement(elem);
}

else if (matchDomain('thewrap.com')) {
  let paywall = document.querySelector('.wrappro-paywall');
  if (paywall)
    paywall.classList.remove('wrappro-paywall');
}

else if (matchDomain('time.com')) {
  let body = document.querySelector('body');
  if (body)
    body.setAttribute('style', 'position:relative !important;');
}

else if (matchDomain('timeshighereducation.com')) {
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
  let hidden_images = document.querySelectorAll('img.b-lazy[src^="data:image/"][data-src]');
  for (let hidden_image of hidden_images) {
    hidden_image.setAttribute('src', hidden_image.getAttribute('data-src'));
    hidden_image.classList.remove('b-lazy');
    hidden_image.parentElement.classList.remove('media--loading');
  }
  let ads = document.querySelectorAll('div[id^="div-gpt-in-article-ad-"], div[class^="the-dfp__in-article-ATD"]');
  removeDOMElement(...ads);
}

else if (matchDomain(timesofindia_domains)) {
  let region_block = document.querySelector('div.plan-popup.active');
  if (region_block) {
    removeDOMElement(region_block);
    let overflow = document.querySelector('html[style]');
    if (overflow)
      overflow.removeAttribute('style');
  }
}

else if (matchDomain(no_nhst_media_domains)) {
  let url = window.location.href;
  if (url.includes('.tradewinds.com/markets/')) {
    let paywall = document.querySelector('iframe[src]');
    removeDOMElement(paywall);
    let overflow = document.querySelector('body[style]');
    if (overflow)
      overflow.removeAttribute('style');
    let blurred = document.querySelector('body > div[style]');
    if (blurred)
      blurred.removeAttribute('style');
  } else {
    window.setTimeout(function () {
      let paywall = document.querySelector('iframe#paywall-iframe');
      if (paywall && dompurify_loaded) {
        removeDOMElement(paywall);
        fetch(url)
        .then(response => {
          if (response.ok) {
            response.text().then(html => {
              let split1 = html.split('window.__INITIAL_STATE__=')[1];
              let state = split1.split('};')[0] + '}';
              if (state) {
                let json = JSON.parse(state);
                if (json) {
                  let json_text = json.article.body;
                  let parser = new DOMParser();
                  let doc = parser.parseFromString('<div>' + DOMPurify.sanitize(json_text, {ADD_ATTR: ['itemprop'], ADD_TAGS: ['link']}) + '</div>', 'text/html');
                  let article_new = doc.querySelector('div');
                  let article = document.querySelector('div.article-body-preview');
                  if (article_new) {
                    if (article)
                      article.parentNode.replaceChild(article_new, article);
                  }
                }
              }
            })
          }
        })
      }
    }, 500); // Delay (in milliseconds)
  }
}

else if (matchDomain(usa_craincomm_domains)) {
  let body_hidden = document.querySelector('body[class]');
  if (body_hidden)
    body_hidden.removeAttribute('class');
  let lazy_images = document.querySelectorAll('img.lazy[data-src]');
  for (let lazy_image of lazy_images) {
    lazy_image.src = lazy_image.getAttribute('data-src');
    lazy_image.removeAttribute('class');
  }
  let lazy_sources = document.querySelectorAll('source[srcset^="data:image"]');
  removeDOMElement(...lazy_sources);
}

else if (matchDomain(usa_tribune_domains)) {
  let overlay = document.querySelector('div#zephr-overlay');
  removeDOMElement(overlay);
}

else if (matchDomain('usatoday.com')) {
  let roadblock = document.querySelector('.roadblock-container');
  if (roadblock) {
    removeDOMElement(roadblock);
    article_next = document.querySelector('article.next-in-depth-story > div.article-inner');
    if (article_next) {
      let url = article_next.getAttribute('data-url');
      let weblink = document.createElement('a');
      weblink.href = url;
      weblink.innerText = 'open next in-depth story';
      article_next.appendChild(weblink);
    }
  }
}

else if (matchDomain('velonews.com')) {
  let paywall = document.querySelector('div.o-membership-overlay');
  if (paywall) {
    let is_gated = document.querySelector('.is-gated');
    if (is_gated)
      is_gated.classList.remove('is-gated');
    removeDOMElement(paywall);
  }
}

else if (matchDomain('venturebeat.com')) {
  window.setTimeout(function () {
    let paywall = document.querySelector('div.paywall');
    if (paywall)
      paywall.classList.remove('paywall');
  }, 500); // Delay (in milliseconds)
}

else if (matchDomain('washingtonpost.com')) {
  window.setTimeout(function () {
    let leaderboard = document.querySelector('#leaderboard-wrapper');
    let adverts = document.querySelectorAll('div[data-qa="article-body-ad"]');
    removeDOMElement(leaderboard, ...adverts);
  }, 500); // Delay (in milliseconds)
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
  } else {
    function wapo_main(node) {
      removeDOMElement(node);
      if (!url.match(/\/(graphics|interactive)\//)) {
        let url_amp = url.split('?')[0] + '?outputType=amp';
        replaceDomElementExt(url_amp, false, false, 'div.article-body', 'Failed to load from amp-page: ');
        window.scrollTo(0, 0);
      }
    }
    function wapo_overlay(node) {
      node.removeAttribute('style');
    }
    let url = window.location.href;
    if (!url.includes('outputType=amp')) {
      waitDOMElement('div[id^="paywall-"], div.wp_signin, div#wp_Signin', 'DIV', wapo_main, false);
      waitDOMElement('div[data-qa*="wall"]', 'DIV', removeDOMElement, true);
      window.setTimeout(function () {
        waitDOMAttribute('body', 'BODY', 'style', wapo_overlay, true);
      }, 500); // Delay (in milliseconds)
      waitDOMAttribute('html', 'HTML', 'style', wapo_overlay, false);
      if (!url.match(/\/(graphics|interactive)\//))
        csDoneOnce = true;
    } else {
      let subscr_sections = document.querySelectorAll('[subscriptions-section="content"]');
      for (let subscr_section of subscr_sections)
        subscr_section.removeAttribute('subscriptions-section');
    }
  }
}

else if (matchDomain('wired.com')) {
  let url = window.location.href.split('?')[0];
  if (url.endsWith('/amp')) {
    let preview = document.querySelector('section[subscriptions-section="content-not-granted"]');
    removeDOMElement(preview);
    let subscr_section = document.querySelector('[subscriptions-section="content"]');
    if (subscr_section)
      subscr_section.removeAttribute('subscriptions-section');
    let amp_ads = document.querySelectorAll('.ad');
    removeDOMElement(...amp_ads);
  }
}

else if (matchDomain('wsj.com')) {
  let url = window.location.href;
  if (location.href.includes('/articles/')) {
    let close_button = document.querySelector('div.close-btn[role="button"]');
    if (close_button)
      close_button.click();
  }
  let wsj_ads = document.querySelectorAll('div.wsj-ad');
  removeDOMElement(...wsj_ads);
  if (url.includes('/amp/')) {
    let masthead_link = document.querySelector('div.masthead > a[href*="/articles/"]');
    if (masthead_link)
      masthead_link.href = 'https://www.wsj.com';
    let preview = document.querySelector('section[subscriptions-section="content-not-granted"]');
    removeDOMElement(preview);
    let subscr_section = document.querySelector('section[subscriptions-section="content"]');
    if (subscr_section)
      subscr_section.removeAttribute('subscriptions-section');
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      let snippet = document.querySelector('.snippet-promotion');
      let wsj_pro = document.querySelector('meta[name="page.site"][content="wsjpro"]');
      if (snippet || wsj_pro) {
        removeDOMElement(snippet, wsj_pro);
        window.location.href = url.replace('wsj.com', 'wsj.com/amp');
      }
    });
  }
}

else if ((domain = matchDomain(usa_mcc_domains)) || document.querySelector('script[src^="https://media.mcclatchyinteractive.com/"]') || (window.location.href.match(/\/\/amp\..+\.com\/(.+\/)?article(\d){8,}\.html/) && document.querySelector('a[href^="https://classifieds.mcclatchy.com/"]'))) {
  if (!domain)
    domain = document.domain.replace(/(account|amp)\./, '');
  let url = window.location.href;
  if (url.includes('account.' + domain + '/paywall/')) {
    window.setTimeout(function () {
      window.location.href = 'https://amp.' + domain + '/article' + url.split('resume=')[1].split('#')[0] + '.html';
    }, 500); // Delay (in milliseconds)
  } else if (url.includes('amp.' + domain + '/')) {
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

else if ((domain = matchDomain(usa_mng_domains)) || (window.location.href.match(/\.com\/(\d){4}\/(\d){2}\/(\d){2}\/.+\/amp\//) && document.querySelector('amp-img#paywall[src*=".com/wp-content/plugins/dfm-amp-mods/"]'))) {
  let url = window.location.href;
  if (url.split('?')[0].endsWith('/amp/')) {
    let subscr_sections = document.querySelectorAll('div[subscriptions-section="content"]');
    for (let subscr_section of subscr_sections) {
      subscr_section.removeAttribute('subscriptions-section');
    }
    let amp_ads = document.querySelectorAll('amp-ad, amp-embed');
    removeDOMElement(...amp_ads);
  }
}

else
  csDone = true;
}

if ((csDone && (bg2csData !== undefined)) || csDoneOnce) {
  addDivBpcDone();
  if (csDone && (bg2csData !== undefined) && !bg2csData.amp_unhide)
    ext_api.runtime.sendMessage({csDone: true});
}

} // end div_bpc_done

// General Functions
function removeDOMElement(...elements) {
  for (let element of elements) {
    if (element)
      element.remove();
  }
}

function waitDOMElement(selector, tagName = '', callback, multiple = false) {
  new window.MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      for (let node of mutation.addedNodes) {
        if (!tagName || (node.tagName === tagName)) {
          if (node.matches(selector)) {
            callback(node);
            if (!multiple)
              this.disconnect();
          }
        }
      }
    }
  }).observe(document, {
    subtree: true,
    childList: true
  });
}

function waitDOMAttribute(selector, tagName = '', attributeName = '', callback, multiple = false) {
  let targetNode = document.querySelector(selector);
  if (!targetNode)
	  return;
  new window.MutationObserver(function (mutations) {
    for (let mutation of mutations) {
      if (mutation.target.attributes[attributeName]) {
        callback(mutation.target);
        if (!multiple)
          this.disconnect();
      }
    }
  }).observe(targetNode, {
    attributes: true,
    attributeFilter: [attributeName]
  });
}

function addDivBpcDone() {
  let div_bpc_new = document.createElement('div');
  div_bpc_new.setAttribute('id', 'bpc_done');
  div_bpc_new.setAttribute('style', 'display: none;');
  let insertAfter = (document.body || document.head || document.documentElement);
  insertAfter.appendChild(div_bpc_new);
}

function matchDomain(domains, hostname) {
  let matched_domain = false;
  if (!hostname)
    hostname = window.location.hostname;
  if (typeof domains === 'string')
    domains = [domains];
  domains.some(domain => (hostname === domain || hostname.endsWith('.' + domain)) && (matched_domain = domain));
  return matched_domain;
}

function replaceDomElementExt(url, proxy, base64, selector, text_fail = '') {
  let proxyurl = proxy ? 'https://bpc2-cors-anywhere.herokuapp.com/' : '';
  fetch(proxyurl + url, {headers: {"Content-Type": "text/plain", "X-Requested-With": "XMLHttpRequest"} })
  .then(response => {
    let article = document.querySelector(selector);
    if (response.ok) {
      response.text().then(html => {
        if (base64) {
          html = decode_utf8(atob(html));
          selector = 'body';
        }
        if (matchDomain(['washingtonpost.com']) && html.includes('<amp-')) {
          html = html.replace(/<amp-/g, '<').replace(/<\/amp-/g, '</');
        }
        let parser = new DOMParser();
        let doc = parser.parseFromString(DOMPurify.sanitize(html, {ADD_ATTR: ['layout'], ADD_TAGS: ['amp-img']}), 'text/html');
        //console.log(DOMPurify.removed);
        let article_new = doc.querySelector(selector);
        if (article_new) {
          if (article && article.parentNode)
            article.parentNode.replaceChild(article_new, article);
        }
      });
    } else if (text_fail) {
      if (article) {
        let text_fail_div = document.createElement('div');
        text_fail_div.appendChild(document.createTextNode(text_fail));
        if (proxy) {
          let a_link = document.createElement('a');
          a_link.innerText = url;
          a_link.href = url;
          a_link.target = '_blank';
          text_fail_div.appendChild(a_link);
        }
        article.insertBefore(text_fail_div, article.firstChild);
      }
    }
  });
}

function archiveLink(url) {
  let archive_url = 'https://archive.today/newest/' + url;
  let text_fail_div = document.createElement('div');
  text_fail_div.id = 'bpc_archive';
  text_fail_div.appendChild(document.createTextNode('BPC > Read full article text:\r\n'));
  let a_link = document.createElement('a');
  a_link.innerText = archive_url;
  a_link.href = archive_url;
  a_link.target = '_blank';
  a_link.setAttribute('style', 'font-weight: bold;');
  text_fail_div.appendChild(a_link);
  return text_fail_div;
}

function removeClassesByPrefix(el, prefix) {
  let el_classes = el.classList;
  for (let el_class of el_classes) {
    if (el_class.startsWith(prefix))
      el_classes.remove(el_class);
  }
}

function cookieExists(name) {
  return document.cookie.split(';').some(function (item) {
    return item.trim().indexOf(name + '=') === 0
  })
}

function setCookie(name, value, domain, path, days) {
  let max_age = days * 24 * 60 * 60;
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
  for (let i = 0; i < len; i++)
    output += (Math.floor(Math.random() * 16)).toString(16);
  return output;
}

function makeRandomNumber(len) {
  let result = '';
  let characters = '123456789';
  let charactersLength = characters.length;
  for (let i = 0; i < len; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  return result;
}

function pageContains(selector, text) {
  let elements = document.querySelectorAll(selector);
  return Array.prototype.filter.call(elements, function (element) {
    return RegExp(text).test(element.textContent);
  });
}

function parseHtmlEntities(encodedString) {
  let translate_re = /&(nbsp|amp|quot|lt|gt|deg|hellip|laquo|raquo|ldquo|rdquo|lsquo|rsquo|mdash);/g;
  let translate = {"nbsp": " ", "amp": "&", "quot": "\"", "lt": "<", "gt": ">", "deg": "°", "hellip": "…",
      "laquo": "«", "raquo": "»", "ldquo": "“", "rdquo": "”", "lsquo": "‘", "rsquo": "’", "mdash": "—"};
  return encodedString.replace(translate_re, function (match, entity) {
      return translate[entity];
  }).replace(/&#(\d+);/gi, function (match, numStr) {
      let num = parseInt(numStr, 10);
      return String.fromCharCode(num);
  });
}

function encode_utf8(str) {
  return unescape(encodeURIComponent(str));
}

function decode_utf8(str) {
  return decodeURIComponent(escape(str));
}
