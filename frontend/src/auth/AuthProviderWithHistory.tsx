import { Auth0Provider } from "@auth0/auth0-react";
import { AppState } from '@auth0/auth0-react';
import {history} from "../utils/history";


const AuthProviderWithHistory = ({ children }: {children?: JSX.Element[] | JSX.Element}) => {

    const domain = import.meta.env.VITE_REACT_APP_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_REACT_APP_AUTH0_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REACT_APP_AUTH0_CALLBACK_URL;
    const audience = import.meta.env.VITE_REACT_APP_AUDIENCE
  
    const onRedirectCallback = (appState?: AppState) => {
      history.push(
        appState && appState.returnTo ? appState.returnTo : window.location.pathname
      );
    };
  
    if (!(domain && clientId)) {
      return null;
    }
  
    return (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        redirectUri={redirectUri}
        onRedirectCallback={onRedirectCallback}
        scope="read:current_user update:current_user_metadata"
        audience={audience}
      >
        {children}
      </Auth0Provider>
    );
}

export default AuthProviderWithHistory
