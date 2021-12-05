import { Gateway } from '@/gateway';
import { Server } from 'http';

const NAKIRI_ASCII = `
              _    _      _
             | |  (_)    (_)
  _ __   __ _| | ___ _ __ _
 | '_ \\ / _\` | |/ / | '__| |
 | | | | (_| |   <| | |  | |
 |_| |_|\\__,_|_|\\_\\_|_|  |_|
`;

export default function boot(server: Server, port: number, gateway: Gateway) {
  return server.listen(port, () => {
    console.log(NAKIRI_ASCII);
    console.log(` > NakiriAPI started on http://localhost:${port}`);
    console.log(
      ` > Started Nakiri Gateway on ws://127.0.0.1:${gateway.getPort()}`,
    );
  });
}
