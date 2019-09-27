# Management IP networks and search

- Copy vào thư mục /opt/ipmgt/ipmgt/
- Edit file ipmgt.service, thay đổi = username sẽ chạy service -> Save

```code
[Service]
User=trungkfc
WorkingDirectory=/opt/ipmgt/ipmgt
```

- edit file ipmgt.ini, thay đổi port theo nhu cầu (default: 5000)

```code
http-socket = :5000
```

- Copy file ipmgt.service vào folder /etc/systemd/system/
- Start services:

```code
systemctl start ipmgt.service
```

- Stop Services:

```code
systemctl stop ipmgt.service
```

- Services Status:

```code
systemctl status ipmgt.service
```

- Access to Web Application:

```code
http://ip_server:5000
```
