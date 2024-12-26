import { exec, execSync } from "child_process";
import fs from "fs";
import dns from "dns";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config()

const app: Express = express()

const { SERVER_IP, SERVER_PORT, TERRAFORM_DIRECTORY, DNS_RECORD } = process.env;

const ip = SERVER_IP || "0.0.0.0";
const port: number = +SERVER_PORT || 12345;

if (!TERRAFORM_DIRECTORY) {
	throw new Error("Terraform directory environment variable missing.");
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

app.get("/start", async (req: Request, res: Response) => {
	console.log("Starting VPN server...");
	execSync("terraform apply -auto-approve", { cwd: TERRAFORM_DIRECTORY });
	execSync("systemctl enable wg-quick@wg0");
	var dns_lookup_not_successful = true;
	var dns_lookup_tries = 0;
	while (dns_lookup_not_successful) {
		dns.lookup(DNS_RECORD, (err, address, family) => {
			if (!err) {
				dns_lookup_not_successful = false;
			}
		});
		if (dns_lookup_tries > 40) {
			res.status(500);
			res.send();
		}
		dns_lookup_tries++;
		await sleep(2500);
	}
	execSync("systemctl start wg-quick@wg0");
	fs.writeFile("vpn_running", "", (err) => {});
	console.log("VPN server started.")
	res.status(200);
	res.send();
});

app.get("/stop", async (req: Request, res: Response) => {
	console.log("Stopping VPN server...");
	execSync("systemctl stop wg-quick@wg0");
	execSync("systemctl disable wg-quick@wg0");
	execSync("terraform destroy -auto-approve", { cwd: TERRAFORM_DIRECTORY });
	fs.unlink("vpn_running", (err) => {});
	console.log("VPN server stopped.");
	res.status(200);
	res.send();
});

app.get("/status", async (req: Request, res: Response) => {
	if (fs.existsSync("vpn_running")) {
		res.json("VPN running");
	} else {
		res.json("VPN not running");
	}
});

app.listen(port, ip, () => {
	console.log(`[server]: Server is running at http://${ip}:${port}`);
});
