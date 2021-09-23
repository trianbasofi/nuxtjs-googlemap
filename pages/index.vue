<template>
  <div class="flex justify-center">
    <div class="xl:w-1/2 lg:w-1/2 md:w-full sm:w-full">
      <GmapMap
        :center="coordinates"
        :zoom="zoom"
        map-type-id="terrain"
        style="width:100%; height: 200%"
      >
        <gmap-custom-marker :marker="coordinates">
          <img src="~/assets/img/pin.png">
        </gmap-custom-marker>
      </GmapMap>

      <div class="mx-5 mt-5">
        <div class="grid grid-flow-col">
          <div>
            <p class="text-2xl">
              Current Information
            </p>
          </div>
          <div class="flex items-center justify-center">
            <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-full" @click="reWatch">
              {{ BtnTxt }}
            </button>
          </div>
        </div>
        <p class="font-light">
          More or less {{ coordinates.accuracy }} meters.
        </p>
        <p class="font-light">
          Update at : {{ coordinates.timestamp }}
        </p>
        <p class="break-words">
          Address : {{ address }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import GmapCustomMarker from '~/node_modules/vue2-gmap-custom-marker'

export default {
  components: {
    'gmap-custom-marker': GmapCustomMarker
  },
  data () {
    return {
      map: null,
      address: null,
      latlng: null,
      watchId: null,
      zoom: 20,
      BtnTxt: 'Repoint',
      coordinates: {}
    }
  },
  mounted () {
    // this.getLatLng()
    this.Watch()
  },
  methods: {
    // async getLatLng () {
    //   await this.$watchLocation({
    //     enableHighAccuracy: true,
    //     timeout: 5000,
    //     maximumAge: 0
    //   })
    //     .then((coordinates) => {
    //       console.log(coordinates)
    //       this.coordinates = coordinates
    //       this.latlng = coordinates.lat + ',' + coordinates.lng
    //       this.getAddress(this.latlng)
    //     })
    //     .catch((error) => {
    //       console.info(error)
    //     })
    // },
    Watch () {
      this.watchId = navigator.geolocation.watchPosition(
        (coordinates) => {
          // console.log(coordinates)
          const date = new Date(coordinates.timestamp)
          const hours = date.getHours()
          const minutes = '0' + date.getMinutes()
          const seconds = '0' + date.getSeconds()

          this.coordinates = {
            timestamp: hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2),
            accuracy: coordinates.coords.accuracy,
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude
          }
          this.latlng = coordinates.coords.latitude + ',' + coordinates.coords.longitude
          this.getAddress(this.latlng)
          console.info(coordinates.coords)
        },
        error => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 2000 }
      )
    },
    reWatch () {
      this.BtnTxt = 'Repointing...'
      navigator.geolocation.clearWatch(this.watchId)
      this.coordinates = { accuracy: 0, lat: 0, lng: 0 }
      this.latlng = '0,0'
      this.zoom = 20
      this.Watch()
      this.BtnTxt = 'Repoint'
    },
    async getAddress (latlng) {
      await this.$axios.$get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${process.env.GOOGLE_MAPS_API_KEY}`)
        .then((response) => {
          if (response.status === 'OK') {
            this.address = response.results[0].formatted_address
          } else {
            this.address = 'Masalah saat melakukan permintaan data'
          }
        })
        .catch((error) => {
          console.info(error)
        })
    }
  }
}
</script>
