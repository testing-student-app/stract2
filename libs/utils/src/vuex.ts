import { mapState } from 'vuex';

export function customMapState<
  S,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Map extends { [key: string]: (t: any, s: S, g?: any) => any } = {}
>(map: Map) {
  return mapState(map);
}
