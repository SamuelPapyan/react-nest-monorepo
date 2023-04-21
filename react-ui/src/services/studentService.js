//require('dotenv').config();

export default class StudentService {
    static async getAllStudents(){
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students").then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        });
    }

    static async getStudentById(id){
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/${id}`).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static async addStudent(formData){
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + "/students", {
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
            })
        })
    }

    static async updateStudent(id, formData){
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
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

    static async deleteStudent(id){
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/${id}`, {
                method: 'DELETE',
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            })
        })
    }
}