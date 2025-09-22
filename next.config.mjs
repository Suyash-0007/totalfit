import { fileURLToPath } from 'url';
import path from 'path';
 
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Help Next resolve workspace root correctly on Windows/OneDrive
	outputFileTracingRoot: __dirname,
	webpack: (config, { isServer, webpack }) => { // Add webpack to the arguments
		// Define the GOOGLE_AI_API_KEY directly here
		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env.GOOGLE_AI_API_KEY': JSON.stringify("AIzaSyDIUrA9b1ibubFcOA9jdRUpQfqInVGpyE0") // <--- YOUR KEY HERE
			})
		);
		return config;
	},
};

export default nextConfig;


