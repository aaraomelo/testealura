<template>
  <div class="my-canvas-wrapper">
    <canvas ref="my-canvas"></canvas>
    <slot></slot>
  </div>
</template>

<script>
import gltfReader from './gltfReader'
import Matrix from './Matrix'
export default {
  props: { 
    model: Object
  },
  data() {
    return {
      provider: {
        context: null,
        Mmatrix: null,
        mov_matrix : [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1],
        time: 0,
        time_old: 0,
        length: 0
      }
    }
  },
  provide () {
    return {
      provider: this.provider
    }
  },
  mounted () {
    setInterval(() => {
      this.provider.time += 16e-3;
    }, 16);
    const gl = this.$refs['my-canvas'].getContext('webgl')
    const width = this.$refs['my-canvas'].parentElement.clientWidth
    const height = this.$refs['my-canvas'].parentElement.clientHeight
    this.provider.context = gl;
    this.$refs['my-canvas'].width = width
    this.$refs['my-canvas'].height = height
    gl.viewport(0.0, 0.0, width, height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    /*============ Defining and storing the geometry =========*/
    const model = new gltfReader(this.model)
    var vertices = model.vertArray
    var normals = model.normArray
    var indices = model.IndArray
    this.provider.length = indices.length;
    // Create and store data into vertex buffer
    var vertex_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // Create and store data into normal buffer
    var normal_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    // Create and store data into index buffer
    var index_buffer = gl.createBuffer ();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    /*=================== Shaders =========================*/
      var vertCode = `
        attribute vec3 position;
        uniform mat4 Pmatrix;
        uniform mat4 Vmatrix;
        uniform mat4 Mmatrix;
        attribute vec3 normal;
        varying vec3 vNormal;

        void main(void) { 
          gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);
          vNormal = normal;
        }
      `;
      var fragCode = `
        precision mediump float;
        varying vec3 vNormal;
        void main(void) {
            gl_FragColor = vec4(vNormal, 1.);
        }
      `;
      // Compling shaders
      var vertShader = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertShader, vertCode);
      gl.compileShader(vertShader);
      var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragShader, fragCode);
      gl.compileShader(fragShader);
      var shaderProgram = gl.createProgram();
      gl.attachShader(shaderProgram, vertShader);
      gl.attachShader(shaderProgram, fragShader);
      gl.linkProgram(shaderProgram);
      /* ====== Associating attributes to vertex shader =====*/
      var Pmatrix = gl.getUniformLocation(shaderProgram, "Pmatrix");
      var Vmatrix = gl.getUniformLocation(shaderProgram, "Vmatrix");
      this.provider.Mmatrix = gl.getUniformLocation(shaderProgram, "Mmatrix");

      gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
      var position = gl.getAttribLocation(shaderProgram, "position");
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false,0,0) ;
      // Position
      gl.enableVertexAttribArray(position);
      gl.bindBuffer(gl.ARRAY_BUFFER, normal_buffer);
      var normal = gl.getAttribLocation(shaderProgram, "normal");
      gl.vertexAttribPointer(normal, 3, gl.FLOAT, false,0,0) ;
      // Normal
      gl.enableVertexAttribArray(normal);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
      gl.useProgram(shaderProgram);
      /*==================== MATRIX =====================*/
      const _matrix = new Matrix()
      var proj_matrix = _matrix.get_projection(40, width/height, 1, 100);
      gl.uniformMatrix4fv(Pmatrix, false, proj_matrix);
      var view_matrix = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
      view_matrix[14] = view_matrix[14]-3;//zoom
      gl.uniformMatrix4fv(Vmatrix, false, view_matrix);
      /*================= Drawing ===========================*/
      gl.clearColor(1, 1, 1, 1);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniformMatrix4fv(this.provider.Mmatrix, false, this.provider.mov_matrix);
      gl.drawElements(gl.TRIANGLES,this.provider.length, gl.UNSIGNED_SHORT, 0);

  }
}
</script>