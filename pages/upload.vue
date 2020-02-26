<template>
  <v-container>
    <v-file-input
        label="Arquivo object"
        filled
        prepend-icon="mdi-file"
        @change="getObj"
    ></v-file-input>
     <v-file-input
        label="Arquivo binary"
        filled
        prepend-icon="mdi-file"
        @change="getBin"
    ></v-file-input>
    <v-btn
      class="ma-2"
      color="secondary"
      :loading="loading"
      :disabled="loading"
      @click="sendModel"
    >
      Enviar
    </v-btn>
  </v-container>
</template>

<script>
export default {
  data(){
    return {
      obj: null,
      bin: null,
      loading: false,
    }
  },
  methods:{
    getObj(file){
      this.obj = file
    },
    getBin(file){
      this.bin = file
    },
    async sendModel(){
      this.loading = true
      await this.$store.dispatch(
        'models/upload',
        {
          obj: this.obj,
          bin: this.bin
        }
      )
      this.loading = false
    }
  }
}
</script>>

