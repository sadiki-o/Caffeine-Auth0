import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { User } from "../types/types"
import { blockManagerForAdmin, getManagers, unblockManagerForAdmin } from "../utils/ApiMethods"
import useStore from "../zustandStore/store"
import Loader from "./Loader"
import UserComponent from "./UserComponent"


const Managers = () => {
    const navigate = useNavigate()
    const { isAuthenticated, isLoading } = useAuth0()
    const [managers, setManagers] = useState<User[]>()
    const [token, role] = useStore(state => [state.token, state.role])

    const refreshManagers = () => {
        getManagers(token!)
                .then(res => {
                    setManagers(res);
                })
    }

    useEffect(() => {
        if (!isLoading) {
            isAuthenticated && role === "admin" ? getManagers(token!)
                .then(res => {
                    setManagers(res);
                }) : navigate("/")
        }

    }, [isAuthenticated, isLoading])

    return !managers ? <Loader /> : (
        <div className="flex flex-col flex-wrap mx-auto max-w-[500px] mt-5">
            {managers?.map(el => <UserComponent refreshUsers={refreshManagers} key={el.user_id} blocked={el.blocked} user_id={el.user_id} name={el.name} email={el.email} picture={el.picture} blockUser={blockManagerForAdmin} unblockUser={unblockManagerForAdmin} />)}
        </div>
    )

}

export default Managers
