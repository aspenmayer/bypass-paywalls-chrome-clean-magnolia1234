var ext_api = (typeof browser === 'object') ? browser : chrome;

// daily users counter
function bpc_count_daily_users() {
    let date = new Date();
    let dateStr = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
    ext_api.storage.sync.get({
        daily_users: {},
    }, function (items) {
        var daily_users = items.daily_users;
        if (daily_users.date !== dateStr) {
            daily_users.date = dateStr;
            chrome.storage.sync.set({
                daily_users: daily_users
            }, function () {
                true;
            });
            let count_json = 'https://bitbucket.org/magnolia1234/bpc-chrome-daily-users/downloads/bpc-daily-users-' + dateStr + '.json';
            fetch(count_json);
        }
    });
}
bpc_count_daily_users();
