import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User } from "../types/types";
import { blockBaristaForManager, getBaristas, unblockBaristaForManager } from "../utils/ApiMethods";
import useStore from "../zustandStore/store";
import Loader from "./Loader";
import UserComponent from "./UserComponent";


const Baristas = () => {
    const navigate = useNavigate()
    const { isAuthenticated, isLoading } = useAuth0()
    const [baristas, setBaristas] = useState<User[]>()
    const [token, role] = useStore(state => [state.token, state.role])

    const refreshBaristas = () => {
        getBaristas(token!)
                .then(res => {
                    setBaristas(res);
                })
    }

    useEffect(() => {
        if (!isLoading) {
            isAuthenticated && role === "admin" || role === "manager"? getBaristas(token!)
                .then(res => {
                    setBaristas(res);
                }) : navigate("/")
        }

    }, [isAuthenticated, isLoading])

    return !baristas ? <Loader /> : (
        <div className="flex flex-col flex-wrap mx-auto max-w-[500px] mt-5">
            {baristas?.map(el => <UserComponent refreshUsers={refreshBaristas} key={el.user_id} blocked={el.blocked} user_id={el.user_id} name={el.name} email={el.email} picture={el.picture} blockUser={blockBaristaForManager} unblockUser={unblockBaristaForManager} />)}
        </div>
    )

}

export default Baristas;