import { FC } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import useStore from "../zustandStore/store"


const Header: FC = () => {
  const {loginWithRedirect, isLoading, logout, user} = useAuth0()
  const [setRole, setToken] = useStore(state => [state.setRole, state.setToken])
  const navigate = useNavigate()

  return (
    <div className="flex justify-between items-center h-16 bg-[#8e8e8e50] shadow-sm px-2 md:p-6">
        <Link to="/">
          <img src="./logo.png" className="text-[#e2e8f0] font-bold w-20 md:w-32 h-14" />
        </Link>
        <div className="flex justify-between gap-5">
            { !isLoading && user ? (
              <button  
                onClick={(e) => {
                  e.preventDefault()
                  localStorage.clear()
                  logout()
                  setRole(undefined); setToken("")
                  navigate("/")              
                }} 
                className="hover:text-red-500 text-lg font-bold text-red-400 p-2 rounded-full border-2 border-[#b4b0b1]"
              >
                Logout
              </button>
            ) : (
            <>
              <button  
                onClick={() => loginWithRedirect()} 
                className="hover:text-slate-400 text-lg font-bold text-slate-500"
              >
                Login
              </button>
            </>
            )}
        </div>
    </div>
  )
}

export default Header