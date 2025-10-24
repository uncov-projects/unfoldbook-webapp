import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const AuthButtons = () => {
  const { loginWithRedirect, logout, isAuthenticated, user, getAccessTokenSilently } = useAuth0();

  const syncUserWithBackend = async () => {
    try {
      const token = await getAccessTokenSilently(); // 👈 Get Auth0 Access Token
      const res = await fetch('http://localhost:4000//api/users/googleLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 👈 Send token to backend
        },
        body: JSON.stringify({
          email: user.email,
          name: user.name,
          picture: user.picture,
        }),
      });

      const data = await res.json();
      console.log('User synced with backend:', data);
    } catch (err) {
      console.error('Error syncing user:', err);
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) syncUserWithBackend();
  }, [isAuthenticated]);

  return (
    <div>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>Login</button>
      ) : (
        <>
          <p>Welcome, {user.name}</p>
          <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default AuthButtons;
