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
            fetch(count_json, {mode: 'no-cors'});
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
