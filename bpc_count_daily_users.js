var ext_api = (typeof browser === 'object') ? browser : chrome;

// daily users counter
function bpc_count_daily_users(dateStr) {
  ext_api.storage.local.get({
    daily_users: {},
  }, function (items_local) {
    daily_users = items_local.daily_users;
    if (daily_users.date !== dateStr) {
      daily_users.date = dateStr;
      ext_api.storage.local.set({
        daily_users: daily_users
      }, function () {
        true;
      });
      let count_json = 'https://bitbucket.org/bpc_redux/bpc-chrome-daily-users/downloads/bpc-daily-users-' + dateStr + '.json';
      try {
        fetch(count_json, {mode: 'no-cors'});
        let count_mobile_json = 'https://bitbucket.org/bpc_redux/bpc-chrome-mobile-daily-users/downloads/bpc-daily-users-' + dateStr + '.json';
        let count_desktop_json = 'https://bitbucket.org/bpc_redux/bpc-chrome-desktop-daily-users/downloads/bpc-daily-users-' + dateStr + '.json';
        if (window.navigator && window.navigator.userAgent.match(/(mobile|android)/i))
          fetch(count_mobile_json, {mode: 'no-cors'});
        else
          fetch(count_desktop_json, {mode: 'no-cors'});
      } catch (err) {
        false;
      };
    }
  });
}

function currentDateStr() {
    let date = new Date();
    let dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    return dateStr;
}
var last_date_str = currentDateStr();
var daily_users;
bpc_count_daily_users(last_date_str);
