import { Link, useLocation } from "react-router-dom"
import { CgProfile } from 'react-icons/cg'
import { TbUsers } from 'react-icons/tb'
import { VscPerson } from 'react-icons/vsc'
import { useAuth0 } from "@auth0/auth0-react"
import useStore from "../zustandStore/store"

const BottomNavigation = () => {
    const { isAuthenticated } = useAuth0()
    const role = useStore(state => state.role)
    const location = useLocation()

    return isAuthenticated ? (
        <div className={`flex flex-wrap overflow-y-scroll ${role === "barista" ? "justify-center" : "justify-evenly"} fixed bottom-0 h-20 w-[100vw] bg-[#e2e4e6] shadow-black shadow-xl`}>
            
            {/* admin links */}
            {role === "admin" &&
                (
                    <>
                        <div className="hover:cursor-pointer flex flex-col items-center justify-center text-neutral-600 font-bold">
                            <VscPerson color={`${location.pathname.split("/").includes("baristas") ? "#1f2937" : "#6f7070"}`} size={30} />
                            <Link className={`${location.pathname.split("/").includes("baristas") ? "text-gray-800" : "#6f7070"}`} to="/baristas">Baristas</Link>
                        </div>
                        <div className="hover:cursor-pointer flex flex-col items-center justify-center text-neutral-600 font-bold">
                            <VscPerson color={`${location.pathname.split("/").includes("managers") ? "#1f2937" : "#6f7070"}`} size={30} />
                            <Link className={`${location.pathname.split("/").includes("managers") ? "text-gray-800" : "#6f7070"}`} to="/managers">Managers</Link>
                        </div>
                    </>
                )
            }
            {/* manager link */}
            {role === "manager" &&
                (
                    <div className="hover:cursor-pointer flex flex-col items-center justify-center text-neutral-600 font-bold">
                        <VscPerson color={`${location.pathname.split("/").includes("baristas") ? "#1f2937" : "#6f7070"}`} size={30} />
                        <Link className={`${location.pathname.split("/").includes("baristas") ? "text-gray-800" : "#6f7070"}`} to="/baristas">Baristas</Link>
                    </div>
                )
            }
            {/* shared profile link among all roles */}
            <div className="hover:cursor-pointer flex flex-col items-center justify-center text-neutral-600 font-bold">
                <CgProfile color={`${location.pathname.split("/").includes("profile") ? "#1f2937" : "#6f7070"}`} size={30} />
                <Link className={`${location.pathname.split("/").includes("profile") ? "text-gray-800" : "#6f7070"}`} to="/profile">Profile</Link>
            </div>
        </div>
    ) : null
}

export default BottomNavigation