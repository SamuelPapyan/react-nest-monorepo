export default class StaffService {
    static async getAllStaffs() {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/staff", {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async getStaffById(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/staff/${id}`,{
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async addStaff(formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/staff", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async updateStaff(id, formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/staff/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async deleteStaff(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/staff/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }

    static async searchStaff(query) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/staff?q=" + query, {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }
}