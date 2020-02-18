<template>
  <v-container>

    <v-file-input
        label="Arquivo object"
        filled
        prepend-icon="mdi-file"
        @change="processObject"
    ></v-file-input>

     <v-file-input
        label="Arquivo binary"
        filled
        prepend-icon="mdi-file"
        @change="processBin"
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

import ModelService from "../services/ModelService"

export default {
  data(){
    return {
      loading: false,
      model:{
        fileObject: '',
        binName: ''
      },
      fileBin: '',
    }
    
  },
  methods:{
    async processObject(file){
      var fileObject = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      this.model.fileObject = JSON.parse(fileObject)
    },
    
    async processBin(file){
      this.fileBin = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },

    async sendModel(){
      this.loading = true
      var array = new Uint8Array(this.fileBin)
      const formData = new FormData()
      formData.append('file', new Blob([`{"array": [${array.toString()}]}`], {type : 'application/json'} ))
      let res = await ModelService.uploadBin(formData)
      this.model.binName = res.data.file.filename
      await ModelService.uploadObj(this.model)
      this.loading = false
    }

  }
}
</script>>

