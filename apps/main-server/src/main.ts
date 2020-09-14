import { Server } from '@logux/server';

const server = new Server(
  Server.loadOptions(process, {
    subprotocol: '1.0.0',
    supports: '1.x',
    root: __dirname,
  })
);

interface ClientMeta {
  name: string;
}

const clients = new Map<string, ClientMeta>();

server.auth((/* { userId, token } */) => {
  // Allow only local users until we will have a proper authentication
  return process.env.NODE_ENV === 'development';
});

server.type('users/change_name', {
  access() {
    return true;
  },
  process(ctx, action) {
    if (clients.has(ctx.clientId)) {
      const client = clients.get(ctx.clientId);
      client.name = action.name;
      server.log.add(
        { type: 'users/get', clients: Object.fromEntries([...clients]) },
        { channels: ['admin'] }
      );
    }
  },
});

server.channel('admin', {
  access(ctx) {
    // User can subscribe only to own data
    return ctx.userId === 'admin';
  },
  load() {
    return {
      type: 'users/get',
      clients: Object.fromEntries([...clients]),
    };
  },
});

server.channel('tests', {
  access(ctx) {
    return ctx.userId !== 'admin';
  },
  load(ctx) {
    const payload: ClientMeta = {
      name: ctx.clientId,
    };
    clients.set(ctx.clientId, payload);
    server.log.add(
      { type: 'users/get', clients: Object.fromEntries([...clients]) },
      { channels: ['admin'] }
    );
    return { type: 'users/add', ...payload };
  },
});

server.listen();
