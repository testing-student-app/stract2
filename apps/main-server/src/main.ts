import { Server } from '@logux/server';
import { nanoid } from 'nanoid';

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

interface Answer {
  isCorrect: boolean;
  value: string;
}

interface Question {
  answers: Answer[];
  value: string;
}

interface QuestionKey {
  clientId: string;
  testId: string;
  index: number;
}

type Tests = Map<QuestionKey, Question>;
type Clients = Map<string, ClientMeta>;
type RoomState = 'cold_start' | 'running' | 'stopped' | 'gone';

interface Room {
  key: string;
  clients: Clients;
  runningTests: Tests;
  state: RoomState;
}

const clients: Clients = new Map<string, ClientMeta>();
const tests: Tests = new Map<QuestionKey, Question>();
let rooms: Room[] = [];

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

server.type('room/create', {
  access(ctx) {
    return ctx.userId === 'admin';
  },
  process() {
    const room: Room = {
      key: nanoid(),
      clients,
      runningTests: tests,
      state: 'cold_start',
    };
    server.log.add({ type: 'room/created', room }, { channels: ['admin'] });
  },
});

server.type('room/run', {
  access(ctx, action) {
    return ctx.userId === 'admin' && rooms.some((r) => r.key === action.key);
  },
  process(_, action) {
    const room = rooms.find((r) => r.key === action.key);
    const index = rooms.findIndex((r) => r.key === action.key);
    const newRoom: Room = {
      ...room,
      state: 'running',
    };

    const roomsShallowCopy = [...rooms];
    roomsShallowCopy[index] = newRoom;
    rooms = roomsShallowCopy;

    server.log.add(
      { type: 'room/running', roomKey: newRoom.key },
      { channels: ['tests'] }
    );
  },
});

server.type('room/finish', {
  access(ctx, action) {
    return ctx.userId === 'admin' && rooms.some((r) => r.key === action.key);
  },
  process(_, action) {
    const room = rooms.find((r) => r.key === action.key);
    const index = rooms.findIndex((r) => r.key === action.key);
    const newRoom: Room = {
      ...room,
      state: 'stopped',
    };

    const roomsShallowCopy = [...rooms];
    roomsShallowCopy[index] = newRoom;
    rooms = roomsShallowCopy;

    server.log.add(
      { type: 'room/finished', room: newRoom },
      { channels: ['admin'] }
    );
  },
});

server.type('room/delete', {
  access(ctx, action) {
    return ctx.userId === 'admin' && rooms.some((r) => r.key === action.key);
  },
  process(_, action) {
    const room = rooms.find((r) => r.key === action.key);
    const index = rooms.findIndex((r) => r.key === action.key);
    const newRoom: Room = {
      ...room,
      state: 'gone',
    };

    const roomsShallowCopy = [...rooms];
    roomsShallowCopy[index] = newRoom;
    rooms = roomsShallowCopy;

    server.log.add({ type: 'room/deleted', rooms }, { channels: ['admin'] });
  },
});

server.type('users/roomFinish', {
  access(ctx, action) {
    return clients.has(ctx.clientId) && rooms.some((r) => r.key === action.key);
  },
  process(ctx, action) {
    const client = clients.get(ctx.clientId);
    const room = rooms.find((r) => r.key === action.key);
    server.log.add(
      { type: 'room/userFinished', roomKey: room.key, client },
      { channels: ['admin'] }
    );
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

server.channel('room/:key', {
  access({ params }: { params: { key: string } }) {
    return rooms.some((r) => r.key === params.key);
  },
  async load({ params }) {
    const { runningTests } = rooms.find((r) => r.key === params.key);
    return {
      type: 'room/currentRunningTest',
      runningTests: Object.fromEntries([...runningTests]),
    };
  },
});

server.channel('editor', {
  access(ctx) {
    // User can subscribe only to own data
    return ctx.userId === 'admin';
  },
  load() {
    return {
      type: 'tests/get',
      tests: Object.fromEntries([...tests]),
    };
  },
});

server.listen();
