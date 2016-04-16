
var GalleryItem = React.createClass({
    render: function() {
        return (
            <div className="results-item">
                <span className="hidden results-item-search-text">{this.props.searchtext}</span>
                <div className="col-md-4">
                    <a href={"?id="+this.props.key}>
                        <img className="img-responsive gallery-item-img" src={""+this.props.img} />
                    </a>
                    <h3>
                        <a className="gallery-item-name" href="#">{this.props.name}</a>
                    </h3>
                    <p className="gallery-item-description">{this.props.description}</p>
                </div>
            </div>
        );
    }
});
