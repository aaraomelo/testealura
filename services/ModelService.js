import axios from 'axios'

const url = '/api/models/'


class ModelService {

    static getModelBin(filename){
        return axios.get(`${url}${'bin/'}${filename}`)
    }

    static uploadBin(formData){
        return axios.post(`${url}${'bin/upload'}`, formData)
    }

    static uploadObj(model){
        return axios.post(`${url}${'obj/upload'}`,{
            model 
        })
    }

    static getModelsObj(){
        return new Promise(async (resolve, reject) => {
            try{
                const res = await axios.get(`${url}${'obj'}`)
                const data = res.data
                resolve(
                    data.map(model => ({
                        ...model,
                        createdAt: new Date(model.createdAt)
                    }))
                )
            }catch(err){
                reject(err)
            }
        })
    }
}

export default ModelService