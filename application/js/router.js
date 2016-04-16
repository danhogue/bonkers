
var AppRouter = Backbone.Router.extend({
    routes: {
        "": "home",
        "home": "home",
        "settings": "settings",
        "users": "users",
        "users/:id": "user",
        "*actions": "notfound"
    }
});
var app_router = new AppRouter();

app_router.on('route:settings', function (actions) {
    var p = new SettingsPage();
});

app_router.on('route:home', function (actions) {
    var p = new HomePage();
});

app_router.on('route:users', function () {
    ReactDOM.render(React.createElement(SearchWidget), page_header_right);
    page.innerHTML = "";
});

app_router.on('route:user', function (id) {
    page_header_middle.innerHTML = "";
    page_header_right.innerHTML = "";
    page.innerHTML = "get user #" + id;
});

app_router.on('route:notfound', function () {
    page_header_middle.innerHTML = "";
    page_header_right.innerHTML = "";
    page.innerHTML = "Page Not Found";
});

Backbone.history.start();
