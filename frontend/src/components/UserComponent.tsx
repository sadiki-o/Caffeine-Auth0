import { useState } from "react"
import { User } from "../types/types"
import useStore from "../zustandStore/store"
import {FaArrowUp} from "react-icons/fa"
import { deleteUserForAdmin } from "../utils/ApiMethods"

const UserComponent = ({
    user_id,
    email,
    name,
    picture,
    blocked,
    blockUser,
    unblockUser,
    refreshUsers }: User) => {

    const [accordionOpen, setAccordionOpen] = useState<boolean>(false)
    const [blocked_, setBlocked] = useState<boolean>(blocked)
    const [token, role] = useStore(state => [state.token, state.role])

    const blockU = () => {
        blockUser(token!, user_id)
        .then(res => {
            console.log(res);
            if(res) {
                setBlocked(true)
                alert("blocked successfully")
            }else {
                alert("an error occured, try again!")
            }
        }).catch(err => {
            alert("an error occured, try again!")
        })
    }

    const unblockU = () => {
        unblockUser(token!, user_id)
        .then(res => {
            console.log(res);
            if(res){
                setBlocked(false)
                alert("unblocked successfully")
            }else {
                alert("an error occured, try again!")
            }
        }).catch(err => {
            alert("an error occured, try again!")
        })
    }


    const deleteU = () => {
        deleteUserForAdmin(token!, user_id)
        .then(res => {
            if(res) {
                alert("deleted successfully")
                refreshUsers!()
            }else {
                alert("an error occured, try again!")
            }
        }).catch(err => {
            alert("an error occured, try again!")
        })
    }

    return (
        <div className="flex flex-col w-full">
            <div
                className="flex justify-between items-center hover:cursor-pointer h-10 bg-gray-300 pr-2"
                onClick={() => {
                    setAccordionOpen(!accordionOpen)
                }}>
                <div className="flex gap-3 items-center">
                    <img className="h-10" src={picture} alt="profile picture" />
                    <div>{name}</div>
                </div>
                <FaArrowUp size={20} color="#6e6e6e" className={`${accordionOpen ? "rotate-180 transition-all ease-in-out duration-300" : ""} `} />
            </div>
            <div className={`p-2 ${accordionOpen ? " bg-[#cccccc] " : "h-0"} transition-all ease-out duration-700`}>
                <div className={`flex flex-col transition-all ease-out ${accordionOpen ? "visible" : "hidden"}`}>
                    <p className=""><span className="font-bold underline">user_id : </span> {user_id}</p>
                    <p className=""><span className="font-bold underline">name : </span> {name}</p>
                    <p className=""><span className="font-bold underline">email : </span> {email}</p>

                    <div className="w-full flex justify-between sm:justify-evenly my-3">
                        <button
                            onClick={blockU}
                            disabled={blocked_ ? true : false} 
                            className={`${blocked_ ? "opacity-30" : "hover:bg-orange-700"} bg-orange-500 text-white font-bold py-2 px-4 rounded`}>Block</button>
                        <button 
                            onClick={unblockU}
                            disabled={!blocked_ ? true : false} 
                            className={`${!blocked_ ? "opacity-30" : "hover:bg-green-700"}  bg-green-500 text-white font-bold py-2 px-4 rounded`}>Unblock</button>
                        {role === "admin" ? (
                            <button 
                                onClick={deleteU}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                        ) : null}
                    </div>
                </div>

            </div>
        </div>
    )
}


export default UserComponent;