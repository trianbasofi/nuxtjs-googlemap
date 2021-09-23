import Vue from 'vue'
import VueGeolocation from '~/node_modules/vue-browser-geolocation/src'
import * as VueGoogleMaps from '~/node_modules/vue2-google-maps/src/main'

Vue.use(VueGeolocation)
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLE_MAPS_API_KEY
  }
  // If you intend to programmatically custom event listener code
  // (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  // instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  // you might need to turn this on.
  // autobindAllEvents: false,

  // If you want to manually install components, e.g.
  // import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  // Vue.component('GmapMarker', GmapMarker)
  // then disable the following:
  // installComponents: true,
})
