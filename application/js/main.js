var api_url = document.getElementById('api_url').innerHTML;
var page = document.getElementById('page-content');

var getCookieValue = function (a, b) {
    b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
};

