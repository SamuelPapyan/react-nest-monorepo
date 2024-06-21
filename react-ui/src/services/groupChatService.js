export default class GroupChatService {
    static async getGroupChatsByOwner(ownerId) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/group_chat/owner/${ownerId}`, {
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

    static async getGroupChatById(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/group_chat/${id}`, {
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

    static async addGroupChat(formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/group_chat`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN),
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        })
    }

    static async updateGroupChat(id, formData) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/group_chat/${id}`, {
                method: 'PUT',
                body: JSON.stringify(formData),
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN),
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        })
    }

    static async deleteGroupChat(id) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/group_chat/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': "application/json",
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN),
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        })
    }

    static async getGroupChatsByStudent(studentId) {
        return new Promise((resolve, reject)=>{
            fetch(process.env.REACT_APP_API_URL + `/students/group_chats/${studentId}`, {
                headers: {
                    'Authorization': "Bearer " + window.localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN),
                }
            }).then(res=>{
                resolve(res.json());
            }).catch(err=>{
                reject(err);
            });
        })
    }
}