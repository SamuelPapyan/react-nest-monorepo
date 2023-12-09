export default class UserService {
    static async getAllUsers() {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/users",{
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

    static async getUserById(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/users/${id}`,{
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

    static async addUser(formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/users", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async updateUser(id, formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err)
            });
        });
    }

    static async deleteUser(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/users/${id}`, {
                method: 'DELETE',
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
}