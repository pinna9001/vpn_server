# discord bot

## Usage

Use `docker-compose build` to build the container.

Before running the container a `.env` file has to be created with the following content:

```env
DISCORD_TOKEN=<token_of_your_bot>
DISCORD_CLIENT_ID=<id_of_your_discord_application>
DISCORD_USER_ID=<the_if_of_your_discord_user>
VPN_MANAGEMENT_SERVER=<http://ip_or_hostname:port>
```

DISCORD_TOKEN and DISCORD_CLIENT_ID are from the discord developer portal.

You can get your discord user id when enabling the developer mode in discord and then right clicking on you user -> copy user id

The VPN_MANAGEMENT_SERVER is the ip and port of the [vpn_manager](../vpn_manager/README.md)

The the container can be started with `docker-compose up -d`

The bot will then send you a dm when it is ready.

After you receive the ready message you can use either of these three commands:

- /start - will start the vpn server
- /stop - will stop the vpn server
- /status - will sent you a message containing the current status (server on or off)
