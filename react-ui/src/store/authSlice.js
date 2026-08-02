import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        studentToken: localStorage.getItem(process.env.REACT_APP_STUDENT_TOKEN) || null,
        studentUser: null,
        staffToken: localStorage.getItem(process.env.REACT_APP_ADMIN_TOKEN) || null,
        staffUser: null
    },
    reducers: {
        setStudentCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.studentUser = user
            state.studentToken = token;
            localStorage.setItem(process.env.REACT_APP_STUDENT_TOKEN, token)
        },
        setStaffCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.staffUser = user
            state.staffToken = token;
            localStorage.setItem(process.env.REACT_APP_ADMIN_TOKEN, token)
        },
        studentLogout: (state) => {
            state.studentUser = null
            state.studentToken = null;
            localStorage.removeItem(process.env.REACT_APP_STUDENT_TOKEN)
        },
        staffLogout: (state) => {
            state.staffUser = null
            state.staffToken = null;
            localStorage.removeItem(process.env.REACT_APP_ADMIN_TOKEN)
        }
    }
})

export const { setStudentCredentials, setStaffCredentials, studentLogout, staffLogout } = authSlice.actions;
export default authSlice.reducer;