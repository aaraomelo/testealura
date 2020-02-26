

class gltfReader{

    constructor(model){

        var obj = model.object

        var bufferViewNormals  = obj.bufferViews[0]
        var bufferViewVertices = obj.bufferViews[1]
        var bufferViewIndices  = obj.bufferViews[2]

        const arrayBuffer = Uint8Array.from(model.bin.array)
            .subarray(0,2).buffer;

        this.vertArray = new Float32Array(arrayBuffer.slice(
            bufferViewVertices.byteOffset,
            bufferViewVertices.byteOffset
                +bufferViewVertices.byteLength));

        this.normArray = new Float32Array(arrayBuffer.slice(
            bufferViewNormals.byteOffset,
            bufferViewNormals.byteOffset
                +bufferViewNormals.byteLength));

        this.IndArray = new Uint16Array(arrayBuffer.slice(
            bufferViewIndices.byteOffset,
            bufferViewIndices.byteOffset
                +bufferViewIndices.byteLength));
    }
}

export default gltfReader