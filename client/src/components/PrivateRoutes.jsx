import { Navigate, Outlet, useNavigate } from "react-router-dom";
import {useSelector} from "react-redux"

const PrivateRoutes = ()=>{
    const isAuthenticated = useSelector((state)=> state.auth.isAuthenticated)

    return (
        isAuthenticated ? <Outlet/> : <Navigate to="/login" />
    )
}

export default PrivateRoutes