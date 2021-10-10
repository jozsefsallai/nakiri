import { Server } from 'http';

export default function boot(server: Server) {
  const port = parseInt(process.env.APP_PORT, 10) || 3000;

  return server.listen(port, () => {
    console.log(`NakiriAPI has started on port ${port}.`);
  });
}
