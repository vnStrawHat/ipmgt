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
addnew_arguments.add_argument("note", required=True)
addnew_arguments.add_argument("domain", required=True)
addnew_arguments.add_argument("pnl", required=True)
addnew_arguments.add_argument("site", required=True)
addnew_arguments.add_argument("itowner", required=True)
addnew_arguments.add_argument("itcontact", required=True)


setting_arguments = reqparse.RequestParser()
setting_arguments.add_argument("name")
setting_arguments.add_argument("value")
setting_arguments.add_argument("updated_at")


update_arguments = reqparse.RequestParser()
update_arguments.add_argument("poolid", required=True)
update_arguments.add_argument("pool", type=ipnetworkvalidate, required=True)
update_arguments.add_argument("note", required=True)
update_arguments.add_argument("domain", required=True)
update_arguments.add_argument("pnl", required=True)
update_arguments.add_argument("site", required=True)
update_arguments.add_argument("itowner", required=True)
update_arguments.add_argument("itcontact", required=True)
