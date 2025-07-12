resource "tls_private_key" "ssh_key" {
	algorithm = "ED25519"
}

resource "local_sensitive_file" "ssh_private_key" {
	content = tls_private_key.ssh_key.private_key_openssh
	filename = "${path.module}/ssh.key"
}

resource "hcloud_firewall" "firewall" {
	name = "firewall"
	rule {
		direction = "in"
		protocol = "udp"
		port = "12345"
		source_ips = [
			"::/0"
		]
	}

	rule {
		direction = "in"
		protocol = "tcp"
		port = "22"
		source_ips = [
			"::/0",
			"0.0.0.0/0"
		]
	}
}

resource "hcloud_ssh_key" "vpn_server_ssh_key" {
	name = "ssh_key"
	public_key = tls_private_key.ssh_key.public_key_openssh
}

resource "hcloud_server" "vpn_server" {
	name = "vpn-server"
	image = "ubuntu-22.04"
	server_type = "cx22"
	location = "fsn1"
	public_net {
		ipv4_enabled = false
		ipv6_enabled = true
	}
	firewall_ids = [
		hcloud_firewall.firewall.id
	]
	ssh_keys = [
		hcloud_ssh_key.vpn_server_ssh_key.id
	]
	user_data = file("${path.module}/cloud-config.yaml")
}

resource "hetznerdns_record" "vpn_dns" {
	zone_id = data.hetznerdns_zone.dns_zone.id
	name = "vpn"
	value = hcloud_server.vpn_server.ipv6_address
	type = "AAAA"
	ttl = 60
}
