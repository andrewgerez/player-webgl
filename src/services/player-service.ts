import { Player, PlayerBundle } from '@/types'
import { PlayerEvents } from '@/types/player'

declare global {
  interface Window {
    Player: Player | null
    KalturaPlayer: PlayerBundle
  }
}

const state = {
  bundleLoaded: false,
  playingState: false,
  playerState: 'idle',
}

/**
 * Initializes the player by loading the player script and setting up the player instance.
 * @returns {Promise<void>} A promise that resolves when the player is initialized.
 */
const init = async (): Promise<void> => {
  let playerInstance
  const script = document.createElement('script')
  script.src = import.meta.env.VITE_PLAYER_API
  script.onload = () => {
    state.bundleLoaded = true
    playerInstance = window.KalturaPlayer

    const ovpObj = {
      playback: {
        additionalTextLanguage: 'off',
        allowMutedAutoPlay: true,
        audioLanguage: 'pt',
        autoplay: true,
        captionsDisplay: 'off',
        options: {
          html5: {
            dash: {},
            hls: {},
            native: {},
          },
        },
        preferNative: {
          dash: true,
          hls: false,
        },
        streamPriority: [
          { engine: 'html5', format: 'hls' },
          { engine: 'html5', format: 'dash' },
          { engine: 'html5', format: 'progressive' },
        ],
      },
      provider: {
        partnerId: import.meta.env.VITE_PARTNER_ID,
        uiConfId: import.meta.env.VITE_UI_CONF_ID,
      },
      streaming: {
        trackEmsgEvents: false,
      },
      targetId: 'player-parent',
      ui: {
        disable: true,
      },
    }

    window.Player = playerInstance?.setup(ovpObj)
    window.Player?.enableAdaptiveBitrate()

    window.Player?.addEventListener(window.Player?.Event.PLAYER_STATE_CHANGED as keyof PlayerEvents, (event) => {
      state.playerState = event.payload.newState
    })

    window.Player?.addEventListener(window.Player?.Event.LOADED_DATA as keyof PlayerEvents, () => {
      if (window.Player?.muted) {
        window.Player.muted = false
      }

      if (window.Player?.volume === 0) {
        window.Player.volume = 1
      }
    })
  }

  script.onerror = (err) => {
    console.error('Erro ao carregar o script:', err)
  }

  const rootElement = document.getElementById('app')
  rootElement!.insertBefore(script, rootElement!.firstChild)
}

/**
 * Loads media into the player.
 * @returns {Promise<void>} A promise that resolves when the media is loaded.
 */
const load = async (): Promise<void> => {
  if (window.Player) {
    try {
      await window.Player.loadMedia({ entryId: import.meta.env.VITE_CONTENT_ID })
        .then(async () => {
          console.log('loaded.')
        })
        .catch((error) => {
          console.error('error:', error)
        })
    } catch (error) {
      console.error('loadMedia error::', error)
    }
  } else {
    console.error('window.Player is not initialized.')
  }
}

/**
 * Plays the media.
 */
const play = () => {
  window.Player?.play()
  state.playingState = true
}

/**
 * Pauses the media.
 */
const pause = () => {
  window.Player?.pause()
  state.playingState = false
}

/**
 * Destroys the player instance.
 * @returns {Promise<void>} A promise that resolves when the player is destroyed.
 */
const destroy = async (): Promise<void> => {
  await window.Player?.destroy()

  window.Player = null
}

/**
 * Gets the current playback time of the media.
 * @returns {number} The current playback time in seconds.
 */
const getCurrentTime = (): number => {
  return window.Player?.currentTime ?? 0
}

/**
 * Gets the duration of the media.
 * @returns {Promise<number>} A promise that resolves with the duration of the media in seconds.
 */
const getVideoDuration = async (): Promise<number> => {
  return new Promise((resolve) => {
    const duration = window.Player?.duration ?? 0
    if (duration > 0 && !isNaN(duration)) {
      resolve(duration)
    }
  })
}

export default {
  init,
  load,
  play,
  pause,
  getCurrentTime,
  getVideoDuration,
  state,
  destroy,
}
