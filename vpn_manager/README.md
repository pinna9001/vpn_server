# vpn_manager

## Usage

This server has to run directly on the device to manage the wireguard connections.

### Build

Before using the application it has to be built with these commands:

```bash
npm install
npm run build
```

Then you have to create an .env file with the following content:

```env
SERVER_IP=0.0.0.0
SERVER_PORT=12345
TERRAFORM_DIRECTORY=/path/to/vpn-server/
DNS_RECORD=vpn.example.com
```

The server ip and port are the listening ip and port for the server. Use 0.0.0.0 to listen for all ip addresses or a specific one to only listen on a locally available ip address.

The terraform directory is the path to the directory containing the *.tf files (in this case the absolute path of `..` when considering this directory as the current dir)

The dns record is used to check if the record is propagated to the used nameservers before starting the wireguard service. Use the same domain here as in the terraform.tfvars file. After 40 failed attempts to resolve the dns_record the server considers the start vpn server as unsuccessful. (You should probably use the hetzner dns servers on the machine running the vpn manager)

## Run

### npm

After configuring the server you can run it with

```bash
npm run start
```

### systemd-service

...or use the systemd service file in this directory to create an systemd service. For this to work you have to change the `WorkingDirectory` and `ExecStart` fields in the service file to the correct paths and copy the file to the correct directory:

```bash
cp ./vpn_manager.service /etc/systemd/system/
```

Then you have to reload the daemon:

```bash
systemctl daemon-reload
```

...and then start and enable the service with: 

```bash
# enable the service to always start after reboot
systemctl enable vpn_manager.service
# start the service
systemctl start vpn_manager.service
```
