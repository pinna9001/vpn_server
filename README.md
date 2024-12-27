# vpn-server

## dependencies

- hetzner vpn server:
    - terraform
- discord bot:
    - docker
    - docker-compose
- vpn_manager:
    - nodejs
    - npm

## Usage

### hetzner vpn server

#### Initalization

You only have to run: 

``` bash
terraform init
```

Then you have to create a file `terraform.tfvars` with the following content:
``` bash
hcloud_token = "<hcloud_token>"
hdns_token = "<hdns_token>"
dns_zone = "<name_of_dns_zone>"
```
You can generate an API Token for the Hetzner Cloud with this guide [Generating an API token](https://docs.hetzner.com/cloud/api/getting-started/generating-api-token/)

And an API token for The DNS Console here [Manage access tokens](https://dns.hetzner.com/settings/api-token)

Terraform will create an AAAA record (for example `vpn.example.com`) for the vpn server in the specified dns zone (for example `example.com`). Your API token has to have access to manage the specified zone.

For the automatic setup of the Wireguard server a cloud-config.yaml is used. You can check the cloud-config-example.yaml for reference.

#### Deploy/Destroy

Then you can deploy/destroy the server with:

``` bash
# create server
terraform apply

# destroy server
terraform destroy
```

For a dry-run you can also use `terraform apply`

If you need ssh access to the created server, there is an file (ssh.key) with the required private key to login via ssh. 

### Discord Bot

[Discord Bot Usage](./discord-bot/README.md#Usage)

### VPN Manager

[VPN Manager Usage](./vpn_manager/README.md#Usage)
