<script>
import Matrix from './Matrix'
export default {
  inject: ['provider'],
  render () {
    if(!this.provider.context) return;
    const gl = this.provider.context;
    /*================= Drawing ===========================*/
    const _matrix = new Matrix()
    var dt = this.provider.time-this.provider.time_old;
    _matrix.rotateZ(this.provider.mov_matrix, dt);
    _matrix.rotateY(this.provider.mov_matrix, dt*0.9);
    _matrix.rotateX(this.provider.mov_matrix, dt*0.7);
    this.provider.time_old = this.provider.time;
    gl.clearColor(1, 1, 1, 1);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(this.provider.Mmatrix, false, this.provider.mov_matrix);
    gl.drawElements(gl.TRIANGLES,this.provider.length, gl.UNSIGNED_SHORT, 0);
  }
}
</script>