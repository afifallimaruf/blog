import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

function OnlyAdminRoute() {
    const { currentUser } = useSelector((state)=> state.user)
    return (
        currentUser && currentUser.isAdmin ? <Outlet /> : <Navigate to="/sign-in" />
    )
}

export default OnlyAdminRoute