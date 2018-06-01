$(function() {
    var IPv4NetworksData;
    var uniqueArray = function(arrArg) {
        return arrArg.filter(function(elem, pos,arr) {
            return arr.indexOf(elem) == pos;
        });
    };
    buildTableBulkSearch([]);
    $("#bulksearch").click(function(){
        var activity;
        $.ajax({
            type: "GET",
            url: "/api/v1/ippools",
            dataType: "json",
            beforeSend: function(){
                activity = Metro.activity.open({
                    type: 'cycle',
                    overlayColor: '#fff',
                    overlayAlpha: 1
                });
            },
            complete: function(){
                Metro.activity.close(activity);
            },
            success: function(data){
                IPv4NetworksData = data.value;
                console.log(IPv4NetworksData);
                var displaydata = [];
                var lines = $('.ip-list-search').val().split('\n');
                lines = uniqueArray(lines);
                lines.forEach(function(line) {
                    if (ipaddr.IPv4.isValidFourPartDecimal(line.trim())) {
                        IPv4NetworksData.forEach(function(data) {
                            var IPv4Search = ipaddr.parse(line.trim());
                            var Networks = ipaddr.parseCIDR(data.pool);
                            var match = IPv4Search.match(Networks);
                            if (match) {
                                var tmp = {};
                                tmp['searchip'] = line.trim();
                                tmp['pool'] = data.pool;
                                tmp['domain'] = data.domain;
                                tmp['site'] = data.site;
                                tmp['itowner'] = data.itowner;
                                tmp['itcontact'] = data.itcontact;
                                tmp['note'] = data.note;
                                displaydata.push(tmp);
                            } else {
                                return true;
                            }
                        });
                    } else {
                        var tmp = {};
                        tmp['searchip'] = line.trim();
                        tmp['pool'] = "N/A";
                        tmp['domain'] = "N/A";
                        tmp['site'] = "N/A";
                        tmp['itowner'] = "N/A";
                        tmp['itcontact'] = "N/A";
                        tmp['note'] = "N/A";
                        displaydata.push(tmp);
                    }
                });
                buildTableBulkSearch(displaydata);
            },
            fail: function(data){
                IPv4NetworksData = {};
            }
        });
    });
    $("#exportcsv").click(function(){
        var uri = 'data:application/vnd.ms-excel;base64,'
            , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
            , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
            , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
        if (!table.nodeType) table = $(".jsgrid-grid-body table")
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = uri + base64(format(template, ctx))
    });
    function buildTableBulkSearch(data) {
        $("#bulk-search-result").jsGrid({
                // height: "50%",
                width: "100%",

                filtering: false,
                inserting: false,
                editing: false,
                sorting: true,
                paging: false,
                autoload: true,

                pageSize: 15,
                pageButtonCount: 5,

                data: data,

                fields: [
                    {
                        name: "searchip",
                        width: 150,
                        type: "text",
                        title: "IP Address"
                    },
                    {
                        name: "pool",
                        type: "text",
                        width: 150,
                        title: "IP Network"
                    },
                    {
                        name: "domain",
                        type: "text",
                        width: 100,
                        title: "Miền",
                        validate: "required"
                    },
                    {
                        name: "site",
                        type: "text",
                        width: 200,
                        title: "P&L",
                        validate: "required"
                    },
                    {
                        name: "itowner",
                        type: "text",
                        width: 200,
                        title: "IT Owner",
                        validate: "required"
                    },
                    {
                        name: "itcontact",
                        type: "text",
                        width: 200,
                        title: "Contact",
                        validate: "required"
                    },
                    {
                        name: "note",
                        type: "text",
                        width: 200,
                        title: "Note",
                        validate: "required"
                    }
                ]
            });
        };
    $("#ipmgt-table").jsGrid({
        width: "100%",
        filtering: false,
        inserting: true,
        editing: true,
        sorting: true,
        paging: false,
        autoload: true,

        deleteConfirm: "Do you really want to delete this record ?",

        controller: {
            loadData: function(filter){
                var d = $.Deferred();
                $.ajax({
                    type: "GET",
                    url: "/api/v1/ippools",
                    dataType: "json"
                }).done(function(response) {
                    d.resolve(response.value);
                });
                return d.promise();
            },
            deleteItem: function(item) {
                $.ajax({
                    type: "DELETE",
                    url: "/api/v1/ippools/" + item.poolid,
                    success: function (data) {
                        $("#ipmgt-table").jsGrid("refresh");
                        Metro.dialog.create({
                            title: "Insert success",
                            content: "<div>Dữ liệu cập nhật thành công</div><br><div class=\"ajax-message\"><div class=\"message-lable\"><b>Message</b>:</div><div>" + data.message + "</div></div>",
                            actions: [{
                                caption: "OK",
                                cls: "js-dialog-close success",
                            }]
                        });
                        var datatablesIndex = $.inArray(item, datatables);
                        datatables.splice(datatablesIndex, 1);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var dataResponse = jQuery.parseJSON(jqXHR.responseText);
                        Metro.dialog.create({
                            title: "Insert failed",
                            content: "<div>Dữ liệu cập nhật không thành công</div><br><div class=\"ajax-message\"><div class=\"message-lable\"><b>Message</b>:</div><div>" + dataResponse.message + "</div></div>",
                            actions: [{
                                caption: "OK",
                                cls: "js-dialog-close alert",
                            }]
                        });
                        console.log("loading data failed");
                    }
                });
            },
        },
        onDataLoaded: function () {
            $(".jsgrid-grid-body").removeAttr("style");
        },
        onItemInserting: function (args) {
            $.ajax({
                type: "POST",
                url: "/api/v1/ippools",
                data: args.item,
                success: function (data) {
                    Metro.dialog.create({
                        title: "Insert success",
                        content: "<div>Dữ liệu cập nhật thành công</div><br><div class=\"ajax-message\"><div class=\"message-lable\"><b>Message</b>:</div><div>" + data.message + "</div></div>",
                        actions: [{
                            caption: "OK",
                            cls: "js-dialog-close success",
                        }]
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var dataResponse = jQuery.parseJSON(jqXHR.responseText);
                    args.cancel = true;
                    Metro.dialog.create({
                        title: "Insert failed",
                        content: "<div>Dữ liệu cập nhật không thành công</div><br><div class=\"ajax-message\"><div class=\"message-lable\"><b>Message</b>:</div><div>" + jdataResponse.message + "</div></div>",
                        actions: [{
                            caption: "OK",
                            cls: "js-dialog-close alert",
                        }]
                    });
                    console.log("loading data failed");
                }
            });
        },
        onItemUpdating: function (args) {
            $.ajax({
                type: "PUT",
                url: "/api/v1/ippools/" + args.item.poolid,
                data: args.item,
                success: function (data) {
                    Metro.dialog.create({
                        title: "Insert success",
                        content: "<div>Dữ liệu cập nhật thành công</div><br><div class=\"ajax-message\"><div class=\"message-lable\"><b>Message</b>:</div><div>" + data.message + "</div></div>",
                        actions: [{
                            caption: "OK",
                            cls: "js-dialog-close success",
                        }]
                    });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var dataResponse = jQuery.parseJSON(jqXHR.responseText);
                    args.cancel = true;
                    Metro.dialog.create({
                        title: "Insert failed",
                        content: "<div>Dữ liệu cập nhật không thành công</div><br><div class=\"ajax-message\"><div class=\"message-lable\"><b>Message</b>:</div><div>" + dataResponse.message + "</div></div>",
                        actions: [{
                            caption: "OK",
                            cls: "js-dialog-close alert",
                        }]
                    });
                }
            });
        },

        fields: [
            {
                name: "poolid",
                width: 50,
                title: "ID"
            },
            {
                name: "pool",
                type: "text",
                width: 150,
                title: "IPv4 Network"
            },
            {
                name: "domain",
                type: "text",
                width: 100,
                title: "Miền",
                validate: "required"
            },
            {
                name: "site",
                type: "text",
                width: 200,
                title: "P&L",
                validate: "required"
            },
            {
                name: "itowner",
                type: "text",
                width: 200,
                title: "IT Owner",
                validate: "required"
            },
            {
                name: "itcontact",
                type: "text",
                width: 200,
                title: "Contact",
                validate: "required"
            },
            {
                name: "note",
                type: "text",
                width: 200,
                title: "Note",
                validate: "required"
            },
            { type: "control" }
        ]
    });

    $(".jsgrid-grid-header").addClass("remove-table-scroll");
    $(".jsgrid-grid-body").addClass("remove-table-scroll");
    // Universal Search
    $("#searchInput").keyup(function () {
        var searchstring = this.value.toLowerCase().trim();
        $(".jsgrid-grid-body table tr").each(function (index) {
            if (!(index + 1)) return;
            if (!ipaddr.IPv4.isValidFourPartDecimal(searchstring)) {
                // search string is not IPv4
                $(this).find("td").each(function () {
                    var id = $(this).text().toLowerCase().trim();
                    var not_found = (id.indexOf(searchstring) == -1);
                    $(this).closest('tr').toggle(!not_found);
                    return not_found;
                });
            } else {
                $(this).find("td").each(function (index) {
                    var table_value = $(this).text().toLowerCase().trim();
                    try {
                        var IPv4Search = ipaddr.parse(searchstring);
                        var IPv4Tables = ipaddr.parseCIDR(table_value);
                        var display = IPv4Search.match(IPv4Tables);
                        $(this).closest('tr').toggle(display);
                        return !display;
                    } catch (error) {
                        return true;
                    }
                });
            }
        });
    });
});

