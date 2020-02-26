import axios from 'axios'
const uri = '/api/models/'

export default {
    error({error}){
        console.log(error);
    },
    GET({dispatch}, {url, data = {}}){
        return new Promise((resolve, reject) => {
            axios.get(`${uri}${url}`, data)
              .then(response => resolve(response.data))
              .catch(error => dispatch('error', {error}));
        });
    },
    POST({dispatch}, {url, data = {}}){
        return new Promise((resolve, reject) => {
            axios.post(`${uri}${url}`, data)
              .then(response => resolve(response.data))
              .catch(error => dispatch('error', {error}));
        });
    },
    async upload({dispatch}, {obj, bin}){
        const fileObject = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsText(obj);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => dispatch('error', {error});
        });
        const fileObj = JSON.parse(fileObject)
        const fileBinArrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(bin);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => dispatch('error', {error});
        });
        const fileBinArray = new Uint8Array(fileBinArrayBuffer)
        const formData = new FormData()
        formData.append(
            'file', new Blob(
                [`{"array": [${fileBinArray.toString()}]}`],
                {type : 'application/json'} 
            )
        )
        const res = await dispatch('POST', {
            url:'bin/upload', 
            data: formData 
        })
        await dispatch('POST', { 
            url:'obj/upload', 
            data: {
                fileObject: fileObj, 
                binName: res.file.filename 
            }
        })
    },
    async download({dispatch, commit}) {
        commit('clear')
        const res = await dispatch('GET', {url: 'obj'})
        res.forEach(async element  => {
            commit('add', {
                object: element.fileObject, 
                bin: await dispatch('GET', { 
                    url: `bin/${element.binName}
                `}) 
            })
        });
    }
}