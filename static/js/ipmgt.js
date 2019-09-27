$(function() {
  var IPv4NetworksData;
  var uniqueArray = function(arrArg) {
    return arrArg.filter(function(elem, pos, arr) {
      return arr.indexOf(elem) == pos;
    });
  };
  buildTableBulkSearch([]);
  $("#bulksearch").click(function() {
    var activity;
    var iplists = [];
    var lines = $(".ip-list-search")
      .val()
      .split("\n");
    var iplists = {
      iplist: lines
    };
    $.ajax({
      type: "POST",
      url: "/api/v1/bulksearch",
      dataType: "json",
      data: {
        iplist: JSON.stringify(iplists),
        cidrsearch: $("#cdirsearch").is(":checked"),
        oneresult: $("#oneresult").is(":checked")
      },
      beforeSend: function() {
        activity = Metro.activity.open({
          type: "cycle",
          overlayColor: "#fff"
        });
      },
      complete: function() {
        Metro.activity.close(activity);
      },
      success: function(data) {
        buildTableBulkSearch(data.value);
        console.log(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var dataResponse = jQuery.parseJSON(jqXHR.responseText);
        console.log(dataResponse);
        console.log(dataResponse.message);
      }
    });
  });
  $("#exportxlsx").click(function() {
    var data = $("#bulk-search-result").jsGrid("option", "data");
    var fn = "Export-data.xlsx";
    var type = "xlsx";
    var ws_name = "Data Result";
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.json_to_sheet(data, {
      header: ["searchip", "pool", "site", "description", "detail", "note"]
    });
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    return XLSX.writeFile(wb, fn || "test." + (type || "xlsx"));
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
          name: "site",
          type: "text",
          width: 70,
          title: "Site",
          validate: "required"
        },
        {
          name: "description",
          type: "text",
          width: 250,
          title: "Description",
          validate: "required"
        },
        {
          name: "detail",
          type: "text",
          width: 200,
          title: "Detail",
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
  }
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
    loadIndicator: function(config) {
      var activity;
      console.log("loading started: " + config.message);
      activity = Metro.activity.open({
        type: "cycle",
        overlayColor: "#fff"
      });
      return {
        show: function() {
          activity = Metro.activity.open({
            type: "cycle",
            overlayColor: "#fff"
          });
        },
        hide: function() {
          console.log("loading finished");
          Metro.activity.close(activity);
        }
      };
    },
    rowClick: function(args) {},
    controller: {
      loadData: function(filter) {
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
      deleteItem: function(item) {
        console.log(item);
        return $.ajax({
          type: "DELETE",
          url: "/api/v1/ippools/" + item.poolid,
          success: function(data) {
            $("#ipmgt-table").jsGrid("refresh");
            Metro.dialog.create({
              title: "Insert success",
              content:
                '<div>Dữ liệu cập nhật thành công</div><br><div class="ajax-message"><div class="message-lable"><b>Message</b>:</div><div>' +
                data.message +
                "</div></div>",
              actions: [
                {
                  caption: "OK",
                  cls: "js-dialog-close success"
                }
              ]
            });
          },
          error: function(jqXHR, textStatus, errorThrown) {
            var dataResponse = jQuery.parseJSON(jqXHR.responseText);
            Metro.dialog.create({
              title: "Insert failed",
              content:
                '<div>Dữ liệu cập nhật không thành công</div><br><div class="ajax-message"><div class="message-lable"><b>Message</b>:</div><div>' +
                dataResponse.message +
                "</div></div>",
              actions: [
                {
                  caption: "OK",
                  cls: "js-dialog-close alert"
                }
              ]
            });
            console.log("loading data failed");
          }
        });
      },
      insertItem: function(item) {
        return $.ajax({
          type: "POST",
          url: "/api/v1/ippools",
          data: item,
          success: function(data) {
            Metro.dialog.create({
              title: "Insert success",
              content:
                '<div>Dữ liệu cập nhật thành công</div><br><div class="ajax-message"><div class="message-lable"><b>Message</b>:</div><div>' +
                data.message +
                "</div></div>",
              actions: [
                {
                  caption: "OK",
                  cls: "js-dialog-close success"
                }
              ]
            });
          },
          error: function(jqXHR, textStatus, errorThrown) {
            var dataResponse = jQuery.parseJSON(jqXHR.responseText);
            Metro.dialog.create({
              title: "Insert failed",
              content:
                '<div>Dữ liệu cập nhật không thành công</div><br><div class="ajax-message"><div class="message-lable"><b>Message</b>:</div><div>' +
                dataResponse.message +
                "</div></div>",
              actions: [
                {
                  caption: "OK",
                  cls: "js-dialog-close alert"
                }
              ]
            });
            console.log("loading data failed");
          }
        });
      },
      updateItem: function(item) {
        console.log(item);
        return $.ajax({
          type: "PUT",
          url: "/api/v1/ippools/" + item.poolid,
          data: item,
          success: function(data) {
            Metro.dialog.create({
              title: "Insert success",
              content:
                '<div>Dữ liệu cập nhật thành công</div><br><div class="ajax-message"><div class="message-lable"><b>Message</b>:</div><div>' +
                data.message +
                "</div></div>",
              actions: [
                {
                  caption: "OK",
                  cls: "js-dialog-close success"
                }
              ]
            });
          },
          error: function(jqXHR, textStatus, errorThrown) {
            var dataResponse = jQuery.parseJSON(jqXHR.responseText);
            Metro.dialog.create({
              title: "Insert failed",
              content:
                '<div>Dữ liệu cập nhật không thành công</div><br><div class="ajax-message"><div class="message-lable"><b>Message</b>:</div><div>' +
                dataResponse.message +
                "</div></div>",
              actions: [
                {
                  caption: "OK",
                  cls: "js-dialog-close alert"
                }
              ]
            });
          }
        });
      }
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
        name: "site",
        type: "text",
        width: 70,
        title: "Site",
        validate: "required"
      },
      {
        name: "description",
        type: "text",
        width: 250,
        title: "Description",
        validate: "required"
      },
      {
        name: "detail",
        type: "text",
        width: 200,
        title: "Detail",
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
});
