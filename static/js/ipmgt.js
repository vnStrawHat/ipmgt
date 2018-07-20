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
        var iplists = []
        var lines = $('.ip-list-search').val().split('\n');
        var iplists = {
            iplist: lines,
        }
        $.ajax({
            type: "POST",
            url: "/api/v1/bulksearch",
            dataType: "json",
            data: {
                iplist: JSON.stringify(iplists),
                cidrsearch: $("input[type='checkbox']").is(':checked')
            },
            success: function (data) {
                buildTableBulkSearch(data.value);
                console.log(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var dataResponse = jQuery.parseJSON(jqXHR.responseText);
                console.log(dataResponse);
                console.log(dataResponse.message);
            }
        });
        // $.ajax({
        //     type: "GET",
        //     url: "/api/v1/ippools",
        //     dataType: "json",
        //     data: {
        //         domain: "",
        //         itcontact: "",
        //         itowner: "",
        //         note: "",
        //         pnl: "",
        //         pool: "",
        //         site:"",
        //         cidrsearch: $("input[type='checkbox']").is(':checked')
        //     },
        //     beforeSend: function(){
        //         activity = Metro.activity.open({
        //             type: 'cycle',
        //             overlayColor: '#fff'
        //         });
        //     },
        //     complete: function(){
        //         Metro.activity.close(activity);
        //     },
        //     success: function(data){
        //         IPv4NetworksData = data.value;
        //         // console.log(IPv4NetworksData);
        //         var displaydata = [];
        //         var lines = $('.ip-list-search').val().split('\n');
        //         lines = uniqueArray(lines);
        //         lines.forEach(function(line) {
        //             if (ipaddr.IPv4.isValidFourPartDecimal(line.trim())) {
        //                 var tmpdata = [];
        //                 IPv4NetworksData.forEach(function(data) {
        //                     var IPv4Search = ipaddr.parse(line.trim());
        //                     var Networks = ipaddr.parseCIDR(data.pool);
        //                     var match = IPv4Search.match(Networks);
        //                     if (match) {
        //                         tmpdata.push({
        //                             network: data.pool,
        //                             data: data
        //                         });
        //                     } else {
        //                         return true;
        //                     }
        //                 });
        //                 var min;
        //                 tmpdata.forEach(function(temp){
        //                     if (typeof min === 'undefined') {
        //                         min = temp.network
        //                     }
        //                     if (ipaddr.parseCIDR(temp.network) > ipaddr.parseCIDR(min)) {
        //                         min = temp.network
        //                     }
        //                 });
        //                 tmpdata.forEach(function(temp){
        //                     if (temp.network == min) {
        //                         var tmp = {};
        //                         tmp['searchip'] = line.trim();
        //                         tmp['pool'] = temp.data.pool;
        //                         tmp['domain'] = temp.data.domain;
        //                         tmp['pnl'] = temp.data.pnl
        //                         tmp['site'] = temp.data.site;
        //                         tmp['itowner'] = temp.data.itowner;
        //                         tmp['itcontact'] = temp.data.itcontact;
        //                         tmp['note'] = temp.data.note;
        //                         displaydata.push(tmp);
        //                     };
        //                 });
        //             } else {
        //                 if (line.length == 0) {
        //                     var tmp = {};
        //                 } else {
        //                     var tmp = {};
        //                     tmp['searchip'] = line.trim();
        //                     tmp['pool'] = "N/A";
        //                     tmp['domain'] = "N/A";
        //                     tmp['pnl'] = temp.data.pnl
        //                     tmp['site'] = "N/A";
        //                     tmp['itowner'] = "N/A";
        //                     tmp['itcontact'] = "N/A";
        //                     tmp['note'] = "N/A";
        //                     displaydata.push(tmp);
        //                 }
        //             }
        //         });
        //         buildTableBulkSearch(displaydata);
        //     },
        //     fail: function(data){
        //         IPv4NetworksData = {};
        //     }
        // });
    });
    $("#exportxlsx").click(function () {
        var data = $('#bulk-search-result').jsGrid('option', 'data');
        var fn = "Export-data.xlsx";
        var type = "xlsx";
        var ws_name = "Data Result";
        var wb = XLSX.utils.book_new()
        var ws = XLSX.utils.json_to_sheet(data, {
            header: ["searchip", "pool", "domain", "pnl", "site", "note", "itowner", "itcontact"]
        });
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        return XLSX.writeFile(wb, fn || ('test.' + (type || 'xlsx')));
    });
    function buildTableBulkSearch(data) {
        $("#bulk-search-result").jsGrid({
                width: "100%",
                filtering: false,
                inserting: false,
                editing: false,
                sorting: true,
                paging: false,
                autoload: true,
                data: data,
                fields: [
                    {
                        name: "searchip",
                        width: 80,
                        type: "text",
                        title: "IP Address"
                    },
                    {
                        name: "pool",
                        type: "text",
                        width: 90,
                        title: "Networks"
                    },
                    {
                        name: "domain",
                        type: "text",
                        width: 70,
                        title: "Miền",
                        validate: "required"
                    },
                    {
                        name: "pnl",
                        type: "text",
                        width: 70,
                        title: "P&L",
                        validate: "required"
                    },
                    {
                        name: "site",
                        type: "text",
                        width: 180,
                        title: "Sites",
                        validate: "required"
                    },
                    {
                        name: "note",
                        type: "text",
                        width: 180,
                        title: "Note",
                        validate: "required"
                    },
                    {
                        name: "itowner",
                        type: "text",
                        width: 90,
                        title: "IT Owner",
                        validate: "required"
                    },
                    {
                        name: "itcontact",
                        type: "text",
                        width: 120,
                        title: "Contact",
                        validate: "required"
                    }
                ]
            });
        };
    $("#ipmgt-table").jsGrid({
        width: "100%",
        filtering: true,
        inserting: true,
        editing: true,
        sorting: true,
        paging: true,
        autoload: true,
        pageSize: 12,
        deleteConfirm: "Do you really want to delete this record ?",
        loadIndicator: function (config) {
            var activity;
            console.log("loading started: " + config.message);
            activity = Metro.activity.open({
                type: 'cycle',
                overlayColor: '#fff'
            });
            return {
                show: function () {
                    activity = Metro.activity.open({
                        type: 'cycle',
                        overlayColor: '#fff'
                    });
                },
                hide: function () {
                    console.log("loading finished");
                    Metro.activity.close(activity);
                }
            };
        },
        rowClick: function (args) {
        },
        controller: {
            loadData: function(filter){
                var d = $.Deferred();
                $.ajax({
                    type: "GET",
                    url: "/api/v1/ippools",
                    dataType: "json",
                    data: filter
                }).done(function(response) {
                    d.resolve(response.value);
                });
                return d.promise();
            },
            deleteItem: function (item) {
                console.log(item);
                return $.ajax({
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
            insertItem: function (item) {
                return $.ajax({
                    type: "POST",
                    url: "/api/v1/ippools",
                    data: item,
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
            updateItem: function (item) {
                console.log(item);
                return $.ajax({
                    type: "PUT",
                    url: "/api/v1/ippools/" + item.poolid,
                    data: item,
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
        },
        fields: [
            {
                name: "poolid",
                title: "ID",
                visible: false
            },
            {
                name: "pool",
                type: "text",
                width: 100,
                title: "IPv4 Network",
                validate: "required"
            },
            {
                name: "domain",
                type: "text",
                width: 70,
                title: "Miền",
                validate: "required"
            },
            {
                name: "pnl",
                type: "text",
                width: 70,
                title: "P&L",
                validate: "required"
            },
            {
                name: "site",
                type: "text",
                width: 200,
                title: "Sites",
                validate: "required"
            },
            {
                name: "note",
                type: "text",
                width: 200,
                title: "Note",
                validate: "required"
            },
            {
                name: "itowner",
                type: "text",
                width: 100,
                title: "IT Owner",
                validate: "required"
            },
            {
                name: "itcontact",
                type: "text",
                width: 130,
                title: "Contact",
                validate: "required"
            },
            { type: "control" }
        ]
    });

    $(".jsgrid-grid-header").addClass("remove-table-scroll");
    $(".jsgrid-grid-body").addClass("remove-table-scroll");
});

