export default class WorkshopsService {
    static async getAllWorkshops() {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/workshops", {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async getWorkshopById(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/workshops/${id}`,{
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async addWorkshop(formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/workshops", {
                method: 'POST',
                body: formData,
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async updateWorkshop(id, formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/workshops/${id}`, {
                method: 'PUT',
                body: formData,
                headers: {
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async deleteWorkshop(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/workshops/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }

    static async searchWorkshops(query) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/workshops?q=" + query, {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }
}