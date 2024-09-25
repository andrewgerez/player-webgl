import Blits from '@lightningjs/blits'
import { getDimensions, getTextWidth } from '@/services/dimensions-service'

const { width, height } = getDimensions()

export default Blits.Component('Home', {
  template: `
    <Element :w="$width" :h="$height" :color="{top: '#807C7D', bottom: '#5B5859', }">
      <Text :x="$textX" :y="$height/2" color="#EBE6D8" content="Press enter to start player" />
    </Element>
  `,
  state() {
    const text = 'Press enter to start player'
    const fontSize = 24
    const textWidth = getTextWidth(text, fontSize)
    const textX = (width - textWidth) / 2

    return {
      width,
      height,
      textX,
    }
  },
  input: {
    enter() {
      this.$router.to('/player')
    },
  },
})
