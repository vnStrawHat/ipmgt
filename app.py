# -*- coding: utf-8 -*-
from flask import Flask, render_template, send_from_directory
from raven.contrib.flask import Sentry
from db import *
from openpyxl import load_workbook
from flask_restful import Resource, Api, abort
from parsers import *
import os

dir_path = os.path.dirname(os.path.realpath(__file__))
sqlitedb = 'sqlite:///' + dir_path + os.sep + "database.db"
app = Flask(__name__)
app.config['BUNDLE_ERRORS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = sqlitedb
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['ERROR_404_HELP'] = False
app.app_context().push()
database.init_app(app)
database.create_all(app=app)
api = Api(app)
# sentry = Sentry(app, dsn='https://f89968f901484fd48ff3f3a50bf3b912:5766fc339e7f4d029a39289459508f21@sentry.io/1223183')
# sentry.init_app(app)


# Application route
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/static/mif/metro.ttf')
def metrottf():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'metro.ttf', mimetype='application/octet-stream')


@app.route('/static/mif/metro.woff')
def metrowoff():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'metro.woff', mimetype='application/octet-stream')


@app.route('/static/js/metro.min.js.map')
def metromap():
    return send_from_directory(os.path.join(app.root_path, 'static/js'), 'metro.min.js.map', mimetype='application/octet-stream')


@app.route("/")
def hello():
    data = ""
    return render_template('hello.html', data=data)


@app.route("/ipmanagement")
def ipmanagement():
    data = ""
    return render_template('ipmgt.html', data=data)


@app.route("/setting")
def setting():
    data = ""
    return render_template('setting.html', data=data)


@app.route("/bulksearch")
def bulksearch():
    data = ""
    return render_template('bulksearch.html', data=data)


def abort_if_pool_id_doesnt_exist(pool_id):
    existed = isPoolIdExist(pool_id)
    if not existed:
        abort(404, message="pool_id {} doesn't exist".format(pool_id))


class IpPoolsList(Resource):
    def get(self):
        filters = filter_arguments.parse_args()
        allIpPool = getAllIpPool(filters)
        return allIpPool

    def post(self):
        data = {}
        args = addnew_arguments.parse_args()
        data['pool'] = args['pool']
        data['domain'] = args['domain']
        data['pnl'] = args['pnl']
        data['site'] = args['site']
        data['note'] = args['note']
        data['itowner'] = args['itowner']
        data['itcontact'] = args['itcontact']
        result = addIpPool(data)
        if result[0] == "OK":
            return args, 201
        else:
            abort(400, message=result[1])


class IpPools(Resource):
    def get(self, pool_id):
        # abort_if_pool_id_doesnt_exist(pool_id)
        itowner = {
            "VCM": ["Vũ Tuấn Anh", "v.anhvt7@vincommerce.com"],
            "VinPearl": ["Vũ Hữu Thành", "v.thanhvh3@vinpearl.com"],
            "VincomRetail": ["Nguyễn Pháp","v.phapn2@vincom.com.vn"],
            "VinHomes": ["Vũ Duy Hùng", "v.hungvd@vinhomes.vn"],
            "VinMec": ["Đỗ Mạnh Hoàng", "v.hoangdm2@vinmec.com"],
            "VinEco": ["Nguyễn Trần Thành Nhật", "v.nhatntt@vingroup.net"],
            "VinSchool": ["Trương Trọng Quỳnh, Nguyễn Quang Bảo", "v.quynhtt2@vinschool.com, V.BAONQ@VINSERVICE.NET"],
            "CN.HN": ["Hoàng Đức Việt", "V.VIETHD@vingroup.net"],
            "VinFast": ["Trần Quang Huy", "v.congnt9@vinfast.vn"],
            "Server": ["",""],
            "VinPro": ["Lưu Văn Lăng, Trần Vũ   ","v.langlv@vinservice.net, v.vut@vinservice.net"]
        }
        if pool_id == "0":
            excelfile = dir_path + os.sep + "all_IP_list.xlsx"
            wb = load_workbook(excelfile)
            sheet = wb['All']
            for row in range(2,2000):
                data = {}
                data['domain'] = sheet["A" + str(row)].value if sheet["A" + str(row)].value is not None else ""
                data['pnl'] = sheet["B" + str(row)].value
                data['site'] = sheet["C" + str(row)].value
                data['pool'] = sheet["D" + str(row)].value
                data['note'] = sheet["E" + str(row)].value
                if data['pool'] is None:
                    continue
                else:
                    if data['pnl'] is not None:
                        data['itowner'] = itowner[sheet["B" + str(row)].value][0].decode("utf-8")
                        data['itcontact'] = itowner[sheet["B" + str(row)].value][1]
                    else:
                        data['pnl'] = ""
                        data['itowner'] = ""
                        data['itcontact'] = ""

                    data['pool'] = data['pool'].strip()
                    result = addIpPool(data)
                    if result[0] != "OK":
                        abort(400, message=result[1])
                    else:
                        pass

            return {"value": result[1], "message": "Success"}, 201
        else:
            return {"value": "Nothing", "message": "Success"}, 201

    def delete(self, pool_id):
        abort_if_pool_id_doesnt_exist(pool_id)
        result = deleteIPPool(pool_id)
        if result[0] == "OK":
            return {"value": result[1], "message": "Success"}, 201
        else:
            abort(400, message=result[1])

    def put(self, pool_id):
        newdata = {}
        args = update_arguments.parse_args()
        abort_if_pool_id_doesnt_exist(args["poolid"])
        newdata['poolid'] = args['poolid']
        newdata['pool'] = args['pool']
        newdata['domain'] = args['domain']
        newdata['pnl'] = args['pnl']
        newdata['site'] = args['site']
        newdata['note'] = args['note']
        newdata['itowner'] = args['itowner']
        newdata['itcontact'] = args['itcontact']
        result = editIpPool(newdata)
        if result[0] == "OK":
            return args, 201
        else:
            abort(400, message=result[1])

class Validate(Resource):
    def get(self):
        args = validate_arguments.parse_args()
        function = args['function']
        pool = args['param']
        poolid = args['id']
        db_poolid = isDuplicateIPv4Network(pool)
        if db_poolid is not None:
            if db_poolid == int(poolid):
                return {"message": "valid", "debug": "this pool %s belong to this record" % pool}, 201
            else:
                return {"message": "invalid", "debug": "Pool %s is duplicate with record id %s"%(pool, str(db_poolid))}, 201
        else:
            return {"message": "valid", "debug": "Pool %s do not exist in database" % pool}, 201


api.add_resource(IpPoolsList, "/api/v1/ippools")
api.add_resource(IpPools, '/api/v1/ippools/<pool_id>')
api.add_resource(Validate, '/api/v1/validate')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
