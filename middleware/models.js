import ModelService from '../services/ModelService'

export default async function ({ store }) {
    let resobj = await getModelsObj()
    var Models = []
    for(var i= 0; i < resobj.length; i++){
        var resbin = await getModelBin(resobj[i].binName)
        Models.push({object: resobj[i].fileObject, bin: resbin })
    }
    store.commit('models/setModels', Models)  
}

async function getModelsObj(){
    return await ModelService.getModelsObj()
}

async function getModelBin(filename){
    return await ModelService.getModelBin(filename)
}