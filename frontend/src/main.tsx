import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import AuthProviderWithHistory from './auth/AuthProviderWithHistory'
import Profile from './components/Profile';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Managers from './components/Managers';
import Baristas from './components/Baristas';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "baristas",
        element: <Baristas />,
      },
      {
        path: "managers",
        element: <Managers />,
      },
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProviderWithHistory>
      <RouterProvider router={router} />
    </AuthProviderWithHistory>
  </React.StrictMode>
)
