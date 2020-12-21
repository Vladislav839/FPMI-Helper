const HtmlService = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");

    return {
        getTable: function() {
            return doc.getElementById('data-table')
        },
        isLecture: function(ref) {
            let elem = doc.getElementById(`sjs-${ref}`);
            return elem.getAttribute('colspan') > 2;
        },
        getColspan: function(ref) {
            let elem = doc.getElementById(`sjs-${ref}`);
            return elem.getAttribute('colspan');
        }
    }
}