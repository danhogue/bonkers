
var SettingsPage = Backbone.View.extend({
    el: page,
    initialize: function(){
        _.bindAll(this, 'render');
        this.render();
    },
    render: function(){
        this.el.innerHTML = "<div>My Settings</div>";
    }
});
