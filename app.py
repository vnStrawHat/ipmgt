from flask import Flask, render_template
from db import *
from flask_restful import Resource, Api, abort
from parsers import *

app = Flask(__name__)
app.config['BUNDLE_ERRORS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:\\Users\\vnstr\\Desktop\\new\\database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
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
    allIpPool = getAllIpPool()
    if pool_id not in allIpPool:
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
            return {"value": result[1]}, 201
        else:
            abort(400, message=result[1])


class IpPools(Resource):
    def get(self, pool_id):
        abort_if_pool_id_doesnt_exist(pool_id)
        pass

    def delete(self, pool_id):
        abort_if_pool_id_doesnt_exist(pool_id)
        pass

    def put(self, pool_id):
        abort_if_pool_id_doesnt_exist(pool_id)
        pass


api.add_resource(IpPoolsList, "/api/v1/ippools")
api.add_resource(IpPools, '/api/v1/ippools/<pool_id>')


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)
