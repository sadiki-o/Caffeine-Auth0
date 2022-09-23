import { FC, useEffect } from 'react'
import './App.css'
import Header from './components/Header'
import { useAuth0 } from "@auth0/auth0-react";
import BottomNavigation from './components/BottomNavigation';
import jwt from 'jwt-decode'
import { Outlet } from 'react-router';
import useStore from './zustandStore/store';



const App: FC = ()  => {
  const [setToken, setRole] = useStore(state => [ state.setToken, state.setRole])
  const { getAccessTokenSilently, user } = useAuth0();

  useEffect(() => {
    const setUserMetadata = async () => {
        try {
          const accessToken = await getAccessTokenSilently();

          setToken(accessToken)

          console.log(accessToken)
          

          const p = jwt(accessToken!) as {permissions: string[]}
          
          // user permissions
          const permissions = p.permissions
          
          permissions.includes("crud:baristas") && permissions.includes("crud:managers") && permissions.includes("delete:users") && permissions.includes("block-unblock:users") ? 
          setRole("admin") : permissions.includes("crud:baristas") && permissions.includes("crud:globalMenu") && permissions.includes("read:detailedDrinks") ?
          setRole("manager") : permissions.includes("read:detailedDrinks") ?
          setRole("barista") : null

    
        } catch(e: any) {
          console.log(e.message);
        }
        
    };
    
    setUserMetadata()
    
  }, [getAccessTokenSilently, user?.sub]);

  return (
    <>
      <Header />
      <Outlet />
      <BottomNavigation />
    </>
  )
}

export default App
