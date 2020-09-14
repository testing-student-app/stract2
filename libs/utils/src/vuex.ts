import { mapState, StoreOptions } from 'vuex';
import { LoguxVuex, createLogux } from '@logux/vuex';
import { badge, badgeEn, log } from '@logux/client';
import { badgeStyles } from '@logux/client/badge/styles';
import { VueConstructor } from 'vue';

export function customMapState<
  S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Map extends { [key: string]: (t: any, s: S, g?: any) => any } = {}
>(map: Map) {
  return mapState(map);
}

export function createCustomLogux(
  Vue: VueConstructor,
  loguxConfig: { userId: string; token: '' },
  storeOptions: StoreOptions<{}>
) {
  Vue.use(LoguxVuex);

  const Logux = createLogux({
    subprotocol: '1.0.0',
    server: 'ws://localhost:31337',
    ...loguxConfig,
  });

  const store = new Logux.Store(storeOptions);

  badge(store.client, { messages: badgeEn, styles: badgeStyles });
  log(store.client);

  return store;
}
