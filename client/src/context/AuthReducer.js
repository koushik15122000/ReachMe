const AuthReducer = (state,action) =>{
    switch (action.type) {
        case "LOGIN_START":
            return{
                user:null,
                isFetching:true,
                error:null
            };
        case "LOGIN_SUCCESS":
            return{
                user:action.payload,
                isFetching:false,
                error:null
            };
        case "LOGIN_FAILURE":
            return{
                user:null,
                isFetching:false,
                error:action.payload
            };
        case "LOGIN_NO_USER":
            return{
                user:null,
                isFetching:false,
                error:null
            };
        case "LOGOUT":
            return{
                user:null,
                isFetching:false,
                error:null
            };

        default:
            return state;
    }
}
export default AuthReducer;

