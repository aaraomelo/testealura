<template>
  <div id="app">
    <v-container>
      <v-row>
        <v-col
          v-for="(model, i) in models"
          :key="i"
        >
          <window 
            :model="model"
          ></window>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Window from '../components/Window';
import { mapGetters } from 'vuex'

export default {
  middleware: 'models',
  components: {
    Window
  },
  methods:{
    
  },
  computed: mapGetters({
    models: 'models/getModels'
  }), 
  mounted () {

  },
  data () {
    return {
    }
  }
}
</script>

