import uuid
import json
import ipaddr
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

database = SQLAlchemy()


# Initial database
class ipPool(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    poolid = database.Column(database.String(40), nullable=False)
    pool = database.Column(database.String(80), unique=True, nullable=False)
    domain = database.Column(database.String(120), nullable=False)
    pnl = database.Column(database.String(120), nullable=False)
    site = database.Column(database.String(120), nullable=False)
    note = database.Column(database.String(300), nullable=False)
    itowner = database.Column(database.String(120), nullable=False)
    itcontact = database.Column(database.String(120), nullable=False)
    deleted = database.Column(database.Integer, nullable=False)


class Setting(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    name = database.Column(database.String(80), unique=True, nullable=False)
    value = database.Column(database.String(80), unique=True, nullable=False)
    created_at = database.Column(database.String(80), unique=True, nullable=False)
    updated_at = database.Column(database.String(80), unique=True, nullable=False)


class User(database.Model):
    id = database.Column(database.Integer, primary_key=True)
    username = database.Column(database.String(80), unique=True, nullable=False)
    email = database.Column(database.String(120), unique=True, nullable=False)


def getSetting(nameofsetting=None):
    returndata = []
    if nameofsetting is not None:
        value = Setting.query.filter_by(name=nameofsetting).first()
        if value is not None:
            return value
        else:
            return None
    else:
        results = Setting.query.all()
        for result in results:
            data = result.__dict__
            del data['_sa_instance_state']
            returndata.append(data)
        return returndata


def insertSetting(data):
    name = data['Name']
    value = data['Value']
    created_at = str(datetime.now())[:19]
    updated_at = str(datetime.now())[:19]
    settingdata = ipPool(name=name, value=value, created_at=created_at, updated_at=updated_at)
    try:
        database.session.add(settingdata)
        database.session.commit()
        return "OK", ""
    except Exception as e:
        database.session.rollback()
        return "Error", "Insert Error: " + e.message


def editSetting(data):
    settingname = data["Name"]
    settingname_record = ipPool.query.filter_by(name=settingname).first()
    if settingname_record is not None:
        settingname_record.name = data['Name']
        settingname_record.value = data['Value']
        settingname_record.updated_at = str(datetime.now())[:19]
        try:
            database.session.commit()
            return "OK", ""
        except Exception as e:
            database.session.rollback()
            return "Error", "Cannot edit setting: %s \n Exception: %s" % (settingname_record, str(e))
    else:
        return "Error", "Do not find setting : %s" % settingname_record


def getIpInfo(ipaddress):
    return "OK", "Data"


def generatePoolId():
    poolid = str(uuid.uuid4())
    return poolid


def getAllIpPool(filters):
    returndata = []
    allpool = ipPool.query.filter(
        ipPool.pool.contains(filters['pool']),
        ipPool.domain.contains(filters['domain']),
        ipPool.pnl.contains(filters['pnl']),
        ipPool.site.contains(filters['site']),
        ipPool.note.contains(filters['note']),
        ipPool.itowner.contains(filters['itowner']),
        ipPool.itcontact.contains(filters['itcontact'])
    )
    for pool in allpool:
        data = pool.__dict__
        del data['_sa_instance_state']
        returndata.append(data)
    return {"value": returndata}

def getResultForBulkSearch(filters):
    iplists = json.loads(filters['iplist'])
    iplists = iplists['iplist']
    cidrsearch = filters['cidrsearch']
    returndata = []
    if cidrsearch == 'true':
        allpolldata = []
        allpool = ipPool.query.all()
        for pool in allpool:
            data = pool.__dict__
            allpolldata.append(data['pool'])
        for ip in iplists:
            try:
                newipnetwork = ipaddr.IPv4Network(ip)
                match = []
                correctpool = None
                for pool in allpolldata:
                    if newipnetwork.overlaps(ipaddr.IPv4Network(str(pool))):
                        match.append(pool)
                print match
                for ip in match:
                    if correctpool is not None:
                        if (ipaddr.IPv4Network(ip) > ipaddr.IPv4Network(correctpool)):
                            correctpool = ip
                    else:
                        correctpool = ip
                print correctpool
                result = ipPool.query.filter(ipPool.pool.contains(str(correctpool)))
                data = result.first()             
                tmp = {}
                tmp['searchip'] = ip
                tmp['pool'] = data.pool
                tmp['domain'] = data.domain
                tmp['pnl'] = data.pnl
                tmp['site'] = data.site
                tmp['itowner'] = data.itowner
                tmp['itcontact'] = data.itcontact
                tmp['note'] = data.note
                returndata.append(tmp)
            except Exception as e:
                tmp = {};
                tmp['searchip'] = ip
                tmp['pool'] = "N/A"
                tmp['domain'] = "N/A"
                tmp['pnl'] = "N/A"
                tmp['site'] = "N/A"
                tmp['itowner'] = "N/A"
                tmp['itcontact'] = "N/A"
                tmp['note'] = "N/A"
                returndata.append(tmp)
                return {
                    "value": returndata,
                    "Error": e.message + " is not IPv4Network"
                }
    else:
        for ip in iplists:
            result = ipPool.query.filter(
                ipPool.pool.contains(str(ip))
            )
            for pool in result:
                # data = pool.__dict__
                data = pool
                tmp = {};
                tmp['searchip'] = ip;
                tmp['pool'] = data.pool;
                tmp['domain'] = data.domain;
                tmp['pnl'] = data.pnl
                tmp['site'] = data.site;
                tmp['itowner'] = data.itowner;
                tmp['itcontact'] = data.itcontact;
                tmp['note'] = data.note;
                returndata.append(tmp)

    return {"value": returndata}

def isPoolIdExist(pool_id):
    poolinfo = ipPool.query.filter_by(poolid=pool_id).first()
    if poolinfo is not None:
        return True
    else:
        return False


def getPoolIDbyPool(pool):
    poolinfo = ipPool.query.filter_by(pool=pool).first()
    if poolinfo is not None:
        return poolinfo.poolid
    else:
        return None


def getpoolinfo(pool_id):
    poolinfo = ipPool.query.filter_by(poolid=pool_id).first()
    if poolinfo is not None:
        data = poolinfo.__dict__
        del data['_sa_instance_state']
        return data
    else:
        return None


def deleteIPPool(poolid):
    ippool = ipPool.query.filter_by(poolid=str(poolid)).first()
    try:
        database.session.delete(ippool)
        database.session.commit()
        return "OK", ""
    except Exception as e:
        return "Error", "Cannot delete poolid: %s \n Exception: %s" % (poolid, str(e))


def editIpPool(data):
    poolid = data["poolid"]
    poolrecord = ipPool.query.filter_by(poolid=poolid).first()
    if poolrecord is not None:
        poolrecord.pool = data['pool']
        poolrecord.domain = data['domain']
        poolrecord.pnl = data['pnl']
        poolrecord.site = data['site']
        poolrecord.note = data['note']
        poolrecord.itowner = data['itowner']
        poolrecord.itcontact = data['itcontact']
        poolrecord.deleted = 0
        try:
            database.session.commit()
            # return "OK", "Debug variable: poolid = %s, result_check = %s" % (poolid, result_check)
            return "OK", ""
        except Exception as e:
            database.session.rollback()
            if "UNIQUE constraint failed" in str(e.message):
                return "Error", "Networks %s is already existed" % (data['pool'])
            else:
                return "Error", "Cannot edit pool id: %s <br> Exception: %s <br> error: %s <br> Message: %s" % (poolid, str(e), str(e.args), str(e.message))
    else:
        return "Error", "Do not find IP pool have id: %s" % poolid


def addIpPool(data):
    # allipnetwork = getAllIpPool()
    poolid = generatePoolId()
    pool = data['pool']
    try:
        ipaddr.IPv4Network(pool)
        # newipnetwork = ipaddr.IPv4Network(pool)
    except Exception as e:
        return "Error", e.message + " is not IPv4Network"

    # if isDuplicateIPv4Network(pool):
        # return "Error", "%s was existed in database" % pool
    # if len(allipnetwork) > 0:
    #     for ipnetwork in allipnetwork:
    #         if newipnetwork.overlaps(ipaddr.IPv4Network(ipnetwork['pool'])):
    #             return "Error", "Overlap with poolid: %s" % ipnetwork['poolid']

    domain = data['domain']
    pnl = data['pnl']
    site = data['site']
    note = data['note']
    itowner = data['itowner']
    itcontact = data['itcontact']
    deleted = 0
    pooldata = ipPool(poolid=poolid, pool=pool, domain=domain, pnl=pnl, site=site, note=note, itowner=itowner, itcontact=itcontact, deleted=deleted)
    try:
        database.session.add(pooldata)
        database.session.commit()
        return "OK", getpoolinfo(poolid)
    except Exception as e:
        database.session.rollback()
        if "UNIQUE constraint failed" in str(e.message):
            return "Error", "Networks %s is already existed" % (data['pool'])
        else:
            return "Error", "Insert Error: " + e.message
