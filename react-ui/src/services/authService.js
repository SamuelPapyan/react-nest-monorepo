export default class AuthService {
    static async login(formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/staff/login", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async signUp(formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/auth/signup", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async getProfile() {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/staff/me", {
                method: 'GET',
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

    static async sendPasswordRecoveryMail(email) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/staff/reset`, {
                method: 'POST',
                body: JSON.stringify({email: email}),
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async resetPassword(id, password) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/staff/reset/${id}`, {
                method: 'PUT',
                body: JSON.stringify({password: password}),
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async validateResetLink(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/staff/reset/validate/${id}`, {
                method: 'GET',
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }
}