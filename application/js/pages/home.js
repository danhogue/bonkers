
var HomePage = Backbone.View.extend({
    el: page,
    initialize: function(){
        _.bindAll(this, 'render');
        this.render();
    },
    render: function(){
//        ReactDOM.render(React.createElement(SearchWidget), page_header_right);
    }
});