export type PlayerBundle = {
  setup: <T extends object>(args: T) => Player
}

export type PlayerEvents = {
  PLAYER_STATE: { payload: { newState: string } }
  PLAYER_STATE_CHANGED: { payload: { newState: string } }
  LOADED_DATA: { payload: { newState: string } }
}

export type Player = {
  play: () => void
  pause: () => void
  destroy: () => Promise<void>
  loadMedia: (config: { entryId: string }) => Promise<void>
  enableAdaptiveBitrate: () => void
  addEventListener: <E extends keyof PlayerEvents>(event: E, callback: (args: PlayerEvents[E]) => void) => void
  volume: number
  muted: boolean
  currentTime: number
  duration: number
  Event: {
    PLAYER_STATE: string;
    PLAYER_STATE_CHANGED: string;
    LOADED_DATA: string;
  }
}
