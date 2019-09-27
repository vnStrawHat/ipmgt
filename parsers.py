from flask_restful import reqparse
import ipaddr


def ipnetworkvalidate(value):
    try:
        ipaddr.IPv4Network(value)
        return value
    except Exception:
        raise ValueError("'{}' is not IPv4Network".format(value))


def mobilenumbervalidate(value):
    if value.startswith("0") and len(value) < 12:
        return value
    else:
        raise ValueError("'{}' is not Mobile Number".format(value))


addnew_arguments = reqparse.RequestParser()
addnew_arguments.add_argument("pool", type=ipnetworkvalidate, required=True)
addnew_arguments.add_argument("site", required=True)
addnew_arguments.add_argument("description", required=True)
addnew_arguments.add_argument("detail", required=True)
addnew_arguments.add_argument("note", required=True)


setting_arguments = reqparse.RequestParser()
setting_arguments.add_argument("name")
setting_arguments.add_argument("value")
setting_arguments.add_argument("updated_at")


update_arguments = reqparse.RequestParser()
update_arguments.add_argument("id", required=True)
update_arguments.add_argument("poolid", required=True)
update_arguments.add_argument("pool", type=ipnetworkvalidate, required=True)
update_arguments.add_argument("site", required=True)
update_arguments.add_argument("description", required=True)
update_arguments.add_argument("detail", required=True)
update_arguments.add_argument("note", required=True)

filter_arguments = reqparse.RequestParser()
filter_arguments.add_argument("pool", required=True)
filter_arguments.add_argument("site", required=True)
filter_arguments.add_argument("description", required=True)
filter_arguments.add_argument("detail", required=True)
filter_arguments.add_argument("note", required=True)

bulksearch_arguments = reqparse.RequestParser()
bulksearch_arguments.add_argument("iplist", required=True)
bulksearch_arguments.add_argument("cidrsearch", required=True)
bulksearch_arguments.add_argument("oneresult", required=True)
