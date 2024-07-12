import { createSlice } from '@reduxjs/toolkit'

const bloglistNotificationSlice = createSlice({
    name: 'notifications',
    initialState: {text:null, success:false},
    reducers: {
        setNotification(state, action) {
            return {text: action.payload.text, success: action.payload.success}
        },
        clearNotification(state, action) {
            return {text: null, success: false}
        }
    }
})

export const { setNotification, clearNotification } = bloglistNotificationSlice.actions

export const showNotification = (info, time) => {
    return dispatch => {
        dispatch(setNotification(info))
        setTimeout(() => {
            dispatch(clearNotification())
        }, (time*1000))
    }
}

export default bloglistNotificationSlice.reducer