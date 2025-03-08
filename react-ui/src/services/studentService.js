export default class StudentService {
    static async getAllStudents() {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students", {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
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
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async getStudentByUsername(username) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/username/${username}`, {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN)
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
                body: formData,
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
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
                body: formData,
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
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
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
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
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
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
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }

    static async login(username, password) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students/login", {
                method: 'POST',
                body: JSON.stringify({username, password}),
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json"
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static async getProfile() {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/auth/profile", {
                method: 'GET',
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN)
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
            fetch(process.env.REACT_APP_API_URL + `/students/send_mail`, {
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
            fetch(process.env.REACT_APP_API_URL + `/students/reset/${id}`, {
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
            fetch(process.env.REACT_APP_API_URL + `/students/reset/validate/${id}`, {
                method: 'GET',
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async getWorkshops() {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/workshops`, {
                method: 'GET',
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async registerToWorkshop(username, workshopId) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/workshops/${workshopId}`, {
                method: 'PUT',
                body: JSON.stringify({username: username}),
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }

    static async unregisterToWorkshop(username, workshopId) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/workshops/${workshopId}`, {
                method: 'DELETE',
                body: JSON.stringify({username: username}),
                headers:{
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }
    static async getRegisteredWorkshops(student) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students/workshops?studentName=" + student, {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }
    static async getStudentsByCoach(coach) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students/coach/" + coach, {
                headers:{
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN)
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }
}