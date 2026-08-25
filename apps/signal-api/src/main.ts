import { createServer } from 'node:http';

import { handleRequest } from './server';

const port = Number(process.env['SIGNAL_API_PORT'] ?? 4300);
const server = createServer(handleRequest);

server.listen(port, '127.0.0.1', () => {
  console.log(`Signal API listening on http://127.0.0.1:${port}`);
});
