import { useAuth0 } from '@auth0/auth0-react';

export function useLoginWizard() {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return {
    handleLogin,
  };
}
