import { Router } from "express";
import dotenv from "dotenv";
import { setUserGoogleTokens } from "../services/googleFit";

dotenv.config();

const router = Router();

// Exchange authorization code for tokens server-side and associate with userId (state)
router.post("/exchange", async (req, res) => {
	try {
		const { code, redirectUri, state } = req.body || {};
		if (!code || !redirectUri || !state) {
			return res.status(400).json({ error: "Missing code, redirectUri or state" });
		}
		const clientId = process.env.GOOGLE_CLIENT_ID;
		const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
		if (!clientId || !clientSecret) {
			return res.status(500).json({ error: "Google OAuth not configured" });
		}
		const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				client_id: clientId,
				client_secret: clientSecret,
				code,
				grant_type: "authorization_code",
				redirect_uri: redirectUri,
			}).toString(),
		});
		if (!tokenRes.ok) {
			const text = await tokenRes.text();
			return res.status(400).json({ error: "Token exchange failed", detail: text });
		}
		const json = await tokenRes.json() as { access_token: string; refresh_token?: string; expires_in?: number };
		setUserGoogleTokens(state, { accessToken: json.access_token, refreshToken: json.refresh_token });
		return res.json({ ok: true });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ error: "Failed to exchange code" });
	}
});

export default router;


