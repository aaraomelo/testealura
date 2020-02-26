<template>
  <div id="app">
    <center>
      <my-canvas
        style="width: 400px; height: 400px;"
        :model="model"
      >
        <my-box></my-box>
      </my-canvas>
    </center>
  </div>
</template>

<script>
import MyCanvas from './MyCanvas';
import MyBox from './MyBox';
export default {
  components: {
    MyCanvas,
    MyBox
  },
  props: { 
    model: Object
  }
}
</script>

