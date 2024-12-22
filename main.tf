terraform {
	required_providers {
		hcloud = {
			source = "hetznercloud/hcloud"
		}
		hetznerdns = {
			source = "timohirt/hetznerdns"
			version = "2.1.0"
		}
		local = {
			source = "hashicorp/local"
		}
		tls = {
			source = "hashicorp/tls"
		}
	}
	required_version = ">= 1.0"
}

provider "hcloud" {
	token = "${var.hcloud_token}"
}

provider "hetznerdns" {
	apitoken = "${var.hdns_token}"
}
