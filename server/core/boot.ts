import { Server } from 'http';

export default function boot(server: Server, port: number) {
  return server.listen(port, () => {
    console.log(`NakiriAPI has started on port ${port}.`);
  });
}
