import StudentService from "./studentService";
import UserService from "./userService"
import WorkshopsService from './workshopsService'

export default class DashboardServices {
    static async getDashboardData() {
        const students = await StudentService.getAllStudents();
        const staff = await UserService.getAllUsers();
        const workshops = await WorkshopsService.getAllWorkshops();
        const top3BestStudents = await StudentService.getBestStudents(3);

        return {
            studentsCount: students.data.length,
            staffCount: staff.data.length,
            workshopsCount: workshops.data.length,
            bestStudents: top3BestStudents.data
        }
    }
}