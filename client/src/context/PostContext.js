import {createContext,useState} from 'react'
const INITIAL_STATE={
    postFetching:false
};
export const PostContext = createContext(INITIAL_STATE);
export const PostContextProvider = ({children}) =>{
    const[state,setState] = useState(INITIAL_STATE)
    return (
        <PostContext.Provider value={{postFetching:state.postFetching,setState}}>
            {children}
        </PostContext.Provider>
    )
}
