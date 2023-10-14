export default class StudentService {
    static async getAllStudents() {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students", {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }

    static async getStudentById(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/${id}`, {
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

    static async addStudent(formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students", {
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
            })
        })
    }

    static async updateStudent(id, formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/${id}`, {
                method: 'PUT',
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
            })
        })
    }

    static async deleteStudent(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/${id}`, {
                method: 'DELETE',
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static async searchStudents(query) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students?q=" + query, {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }

    static async getBestStudents(count) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students?best=true&count=" + count, {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem('REACT_NEST_MONOREPO_AUTH_TOKEN')
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }
}