import { createSlice } from '@reduxjs/toolkit'

const anecdoteNotifierSlice = createSlice({
    name: 'anecdoteNotifier',
    initialState: '',
    reducers: {
        notify(state, action) {
            return action.payload
        },
        clearNotification(state, action) {
            return ''
        }
    }
})

export const { notify, clearNotification } = anecdoteNotifierSlice.actions

export const setNotification = (message, time) => {
    return dispatch => {
        dispatch(notify(message))
        setTimeout(() => {
            dispatch(clearNotification())
        }, (time*1000))
    }
}

export default anecdoteNotifierSlice.reducer