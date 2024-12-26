import { execSync } from "child_process";
import fs from "fs";
import express, { Express, Request, Response } from "express";

const app: Express = express()

const { SERVER_IP, SERVER_PORT, TERRAFORM_DIRECTORY } = process.env;

const ip = SERVER_IP || "0.0.0.0"
const port: number = +SERVER_PORT || 12345;

if (!TERRAFORM_DIRECTORY) {
	throw new Error("Terraform directory environment variable missing.");
}

app.get("/start", (req: Request, res: Response) => {
	console.log("Starting VPN server...")
	execSync("terraform apply -auto-approve", { cwd: TERRAFORM_DIRECTORY })
	execSync("wg-quick up wg0");
	fs.writeFile("vpn_running", "", (err) => {});
	console.log("VPN server started.")
	res.status(200);
});

app.get("/stop", (req: Request, res: Response) => {
	console.log("Stopping VPN server...")
	execSync("wg-quick down wg0");
	execSync("terraform destroy -auto-approve", { cwd: TERRAFORM_DIRECTORY })
	fs.unlink("vpn_running", (err) => {});
	console.log("VPN server stopped.")
	res.status(200);
});

app.get("/status", (req: Request, res: Response) => {
	if (fs.existsSync("vpn_running")) {
		res.json("VPN running")
	} else {
		res.json("VPN not running");
	}
});

app.listen(port, ip, () => {
	console.log(`[server]: Server is running at http://${ip}:${port}`);
});
