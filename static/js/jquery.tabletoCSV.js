jQuery.fn.tableToCSV = function() {
    
    var clean_text = function(text){
        text = text.replace(/"/g, '\\"').replace(/'/g, "\\'");
        return '"'+text+'"';
    };
    var csv;
    $(this).each(function(){
        var table = $(this);
        var title = [];
        var rows = [];

        $(this).find('tr').each(function(){
            var data = [];
            $(this).find('th').each(function(){
                var text = clean_text($(this).text());
                title.push(text);
                });
            $(this).find('td').each(function(){
                var text = clean_text($(this).text());
                data.push(text);
                });
            data = data.join(",");
            rows.push(data);
            });
        title = title.join(",");
        rows = rows.join("\n");
        csv = title + rows;
        console.log("Title " + title);
        console.log("Rows " + rows);
    });
    console.log("ALL" + csv);
    var uri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    var download_link = document.createElement('a');
    download_link.href = uri;
    var ts = new Date().getTime();
    download_link.download = ts+".csv";
    document.body.appendChild(download_link);
    download_link.click();
    document.body.removeChild(download_link);
    
};
