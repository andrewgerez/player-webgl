import Blits from '@lightningjs/blits'
import Home from '@/pages/home/index'
import Player from '@/pages/player/index'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [
    { path: '/', component: Home },
    { path: '/player', component: Player },
  ],
})
