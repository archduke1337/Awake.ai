// Placeholder JS wrapper. The real function entry is `api/index.ts`.
// Keep this file minimal to avoid runtime imports of .ts files from a .js
// module which can cause ERR_MODULE_NOT_FOUND on Vercel.

export default function _noop(req, res) {
	res.statusCode = 501;
	res.setHeader('Content-Type', 'application/json');
	res.end(JSON.stringify({ message: 'Use the TypeScript API entry at api/index.ts' }));
}