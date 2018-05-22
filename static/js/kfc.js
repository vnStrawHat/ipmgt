console.log(rangeIPv4List);
function initSearchButton() {
    $("#searchInput").keyup(function () {
        var value = this.value.toLowerCase().trim();
        $(".jsgrid-grid-body table tr").each(function (index) {
            if (!(index + 1)) return;
            if (!ipaddr.IPv4.isValid(value)) {
                // search string is not IPv4
                $(this).find("td").each(function () {
                    var id = $(this).text().toLowerCase().trim();
                    var not_found = (id.indexOf(value) == -1);
                    $(this).closest('tr').toggle(!not_found);
                    return not_found;
                });
            } else {
                // Search string is valid IPv4
                $(this).find("td").each(function (index) {
                    var id = $(this).text().toLowerCase().trim();
                    if (ipaddr.IPv4.isValid(id)) {
                        var display = ipaddr.subnetMatch(ipaddr.parse(value), rangeIPv4List, false)
                        console.log(value + " is belong to subnet mark " + id)
                        $(this).closest('tr').toggle(display);
                    } else {
                        return true;
                    }
                    // try {
                    //     var display = ipaddr.subnetMatch(ipaddr.parse(value), rangeIPv4List, false)
                    //     // console.log(value + " is belong to subnet mark " + id)
                    //     $(this).closest('tr').toggle(display);
                    // } catch (error) {
                    //     $(this).closest('tr').toggle(false);
                    //     return true;
                    // }
                });
            }
        });
    });
}

function initSettingTableEdit() {
    $('#settingtable').Tabledit({
        url: 'settingtable',
        columns: {
            identifier: [1, 'ID'],
            editable: [
                [2, 'Name'],
                [3, 'Value']
            ]
        },
        restoreButton: true,
        onDraw: function() {
        console.log('onDraw()');
        },
        onSuccess: function(data, textStatus, jqXHR) {
            Metro.dialog.create({
                title: "Update Success",
                content:    "<div>Dữ liệu đã được cập nhật" +
                            "<br> " + data +
                            "</div>"
            });
            $("#settingtable").find("tr:last").find('button.tabledit-edit-button').removeClass('temprow');
        },
        onFail: function(jqXHR, textStatus, errorThrown) {
            Metro.dialog.create({
                title: "Update Failed",
                content: "<div>Không thể update dữ liệu vào database</div>"
            });
            console.log(message);
        },
        onAlways: function() {
            console.log('onAlways()');
        },
        onAjax: function(action, serialize) {
            console.log('onAjax(action, serialize)');
            console.log(action);
            console.log(serialize);
        }
    });
}

function initIpPoolTableEdit() {
    // var column = "table#ippool .hidden"
    // $(column).hide();

    $('#ippool').Tabledit({
        url: 'ippool',
        columns: {
            identifier: [1, 'Pool Id'],
            editable: [
                [2, 'Pool'],
                [3, 'Domain'],
                [4, 'Site'],
                [5, 'Note', 'textarea', '{"rows": "3", "cols": "5", "maxlength": "200", "wrap": "hard"}'],
                [6, 'IT Owner'],
                [7, 'IT Contact']
            ]
        },
        restoreButton: true,
        onDraw: function() {
        console.log('onDraw()');
        },
        onSuccess: function(data, textStatus, jqXHR) {
            Metro.dialog.create({
                title: "Update Success",
                content:    "<div>Dữ liệu đã được cập nhật" +
                            "<br> " + data +
                            "</div>"
            });
            $("#ippool").find("tr:last").find('button.tabledit-edit-button').removeClass('temprow');
        },
        onFail: function(jqXHR, textStatus, errorThrown) {
            Metro.dialog.create({
                title: "Update Failed",
                content: "<div>Không thể update dữ liệu vào database</div>"
            });
            console.log(message);
        },
        onAlways: function() {
            console.log('onAlways()');
        },
        onAjax: function(action, serialize) {
            console.log('onAjax(action, serialize)');
            console.log(action);
            console.log(serialize);
        }
    });
}