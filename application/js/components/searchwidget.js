
var SearchWidget = React.createClass({
    render: function() {
        return (
            <div className="input-group input-group-lg">
                <input id="results-filter" className="form-control input-lg" type="text" placeholder="Filter items..." />
                <div className="input-group-btn">
                    <button type="submit" className="btn btn-default">
                        <i className="fa fa-fw fa-filter"></i>
                    </button>
                </div>
            </div>
        );
    },
    componentDidMount: function () {
        function getInnerHTML(item) {
            if (item && item[0]) {
                return item[0].innerHTML
            }
        }
        var input = document.getElementById('results-filter');
        input.onkeyup = function () {
            var filter = input.value.toLowerCase();
            var items = document.getElementsByClassName('results-item');
            for (var i = 0; i < items.length; i++) {
                var text = getInnerHTML(items[i].getElementsByClassName('results-item-search-text'));
                if (text.toLowerCase().indexOf(filter) != -1)
                    items[i].style.display = 'block';
                else
                    items[i].style.display = 'none';
            }
        };
    }
});


