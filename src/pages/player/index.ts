import Blits from '@lightningjs/blits'
import PlayerManager from '@/services/player-service'
import { getDimensions } from '@/services/dimensions-service'
import { delay, secondsToMsSs } from '@/utils/timeout'

const { width, height } = getDimensions()

export default Blits.Component('Player', {
  template: `
    <Element>
      <Element
        mount="{y:1}"
        h="150"
        :w="$width"
        :y="$height"
        :color="{top: 'transparent', bottom: '#444'}"
        :alpha.transition="$controlsVisibility"
      >
        <Element x="450" y="-70">
          <Element w="60" h="60" :effects="[$shader('radius', {radius:16})]">
            <Element y="12" x="14" w="32" h="32" :src="$playing ? 'assets/player/pause.svg' : 'assets/player/play.svg'" />
          </Element>
    
          <Element x="60" y="14">
            <Text :content="$currentTime" size="25" />
            <Text x="70" size="25" content="/" />
            <Text x="85" size="25" :content="$duration" />
          </Element>
    
          <Element x="330" y="70">
            <Text size="25" content="The content will initialize in: " />
            <Text x="320" size="25" :content="$bootTime" />
          </Element>
    
          <Element>
            <Element y="22" x="230" w="740" h="10" color="#ffffff80" :effects="[$shader('radius', {radius:4})]">
              <Element
                h="10"
                :w.transition="{value: $progress, d: 100, f: 'ease-in-out'}"
                :effects="[$shader('radius', {radius:8})]"
                color="#E9674A"
              />
              <Element h="22" w="10" y="-6" color="#EBE6D8" :effects="[$shader('radius', { radius: 3 })]" :x="$progress" />
            </Element>
          </Element>
        </Element>
      </Element>
    </Element>
  `,
  state() {
    return {
      width,
      height,
      controlsVisibility: 1,
      progressLength: 1520,
      progress: 0,
      currentTime: '00:00',
      duration: '00:00',
      playing: false,
      hideTimeout: null,
      bootTime: 10,
    }
  },
  hooks: {
    focus() {
      this.$emit('clearBackground')
    },
    unfocus() {
      this.$emit('changeBackground')
    },
    async init() {
      await PlayerManager.init()
    },
    async ready() {
      await delay(9000, () => {
        this.bootTime--
      })

      await PlayerManager.load()

      this.$setInterval(async () => {
        if (this.duration === '00:00') {
          const duration = await PlayerManager.getVideoDuration();
          this.duration = secondsToMsSs(duration);
          this.progressChunkSize = this.progressLength / duration;
        }

        const currentTime = PlayerManager.getCurrentTime()
        this.currentTime = secondsToMsSs(currentTime)
        this.progress = Math.round(currentTime * this.progressChunkSize)
      }, 1000)
      this.play()
    },
    async destroy() {
      await PlayerManager.destroy()
    },
  },
  input: {
    enter() {
      this.play()
    },
    up() {
      this.showControls(1)
    },
    down() {
      this.showControls(0)
    },
  },
  methods: {
    play() {
      this.showControls(1)
      // this.hideTimeout = this.$setTimeout(() => this.showControls(0), 3000)
      
      if (PlayerManager.state.playingState) {
        PlayerManager.pause()
        this.playing = false
      } else {
        PlayerManager.play()
        this.playing = true
      }
    },
    showControls(v) {
      this.$clearTimeout(this.hideTimeout)
      this.controlsVisibility = v
    },
  },
})
