import {configureStore} from "@reduxjs/toolkit"
import authReducer from "@/config/redux/reducer/authReducer";


export const store=configureStore({
    reducer:{
        auth:authReducer
    }
})