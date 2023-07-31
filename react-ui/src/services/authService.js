export default class AuthService {
    static async login(formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/auth/login", {
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

    static async getProfile(authToken) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/auth/profile", {
                method: 'GET',
                headers:{
                    'Authorization': "Bearer " + authToken
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }
}