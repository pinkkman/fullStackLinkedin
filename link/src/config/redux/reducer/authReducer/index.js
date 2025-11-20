import {loginUser, registerUser} from "@/config/redux/action/authAction";


const initialState={
    user:[],
    isError:false,
    isLoading:false,
    isSuccess:false,
    loggedIn:false,
    message:"",
    profileFetched:false,
    connections:[],
    connectionRequest:[]
}

const authSlice=createSlice({
name:"auth",
    initialState,
    reducers:{
    reset:{
        reset:()=>initialState,
    handleLoginUser:(state)=>{
state.message="hello"
}
    },
        extraReducers:(builder)=>{
        builder
            .addCase(loginUser.pending,(state)=>{
                state.isLoading=true;
                    state.message="Knocking the door"
        })
            .addCase(loginUser.fullfilled,(state,action)=>{
                state.isLoading=false;
                state.isError=false;
                state.isSuccess=true;
                state.loggedIn=true;
                state.message="login is successful"
            })
            .addCase(loginUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload
            })


            .addCase(registerUser.pending,(state)=>{
                state.isLoading=true;
                state.message="registering you"
            })
            .addCase(registerUser.fullfiled,(state,action)=>{
state.isLoading=true;
state.loggedIn=true;
state.isSuccess=true;
state.isError=false;
state.message="logged in"
            })
            .addCase(registerUser.rejected,(state,action)=>{
                state.isLoading=false;
                state.isError=true;
                state.message=action.payload
            })
        }
    }

})
export default authSlice.reducers;