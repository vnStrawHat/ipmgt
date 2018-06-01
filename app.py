from flask import Flask, render_template
from db import *
from flask_restful import Resource, Api, abort
from parsers import *

app = Flask(__name__)
app.config['BUNDLE_ERRORS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['ERROR_404_HELP'] = False
app.app_context().push()
database.init_app(app)
database.create_all(app=app)
api = Api(app)


# Application route
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
        allIpPool = getAllIpPool()
        return allIpPool

    def post(self):
        data = {}
        args = addnew_arguments.parse_args()
        data['pool'] = args['pool']
        data['domain'] = args['domain']
        data['site'] = args['site']
        data['note'] = args['note']
        data['itowner'] = args['itowner']
        data['itcontact'] = args['itcontact']
        result = addIpPool(data)
        if result[0] == "OK":
            return {"value": result[1], "message": "Success"}, 201
        else:
            abort(400, message=result[1])


class IpPools(Resource):
    def get(self, pool_id):
        abort_if_pool_id_doesnt_exist(pool_id)
        pass

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
        newdata['site'] = args['site']
        newdata['note'] = args['note']
        newdata['itowner'] = args['itowner']
        newdata['itcontact'] = args['itcontact']
        result = editIpPool(newdata)
        if result[0] == "OK":
            return {"value": result[1], "message": "Success"}, 201
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
