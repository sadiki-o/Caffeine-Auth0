import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router";
import useStore from "../zustandStore/store";

const Profile = () => {
    const { user, isAuthenticated } = useAuth0();
    const role = useStore(state => state.role)
    const navigate = useNavigate()

  return isAuthenticated ? (
    <div className="flex flex-col items-center gap-2 p-2 rounded-md mx-auto max-w-[300px] mt-[10%] bg-gray-200">
        <img src={user?.picture} alt="profile-photo" className="rounded-full w-[100px] h-[100px]" />
        <div><strong>email: </strong>{user?.email}</div>
        <div><strong>name: </strong>{user?.nickname}</div>
        <div><strong>role: </strong>{role}</div>
    </div> 
    ) : (() => {
        navigate("/")
        return null
    })()
  
}

export default Profile