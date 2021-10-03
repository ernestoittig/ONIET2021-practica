import { useUserController } from '@lib/user-state';
import React, { useState } from 'react';

const App: React.FC = () => {
  const userController = useUserController();
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogin = async () => {
    setLoading(true);
    try {
      await userController.logIn('john@example.com', 'password123');
    } catch (e) {
      alert(JSON.stringify(e));
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    setLoading(true);
    void userController.logOut().then(() => setLoading(false));
  };

  return (
    <>
      <pre>
        <code>
          {'User: '}
          {JSON.stringify(userController.current, null, 2)}
        </code>
      </pre>
      <button disabled={loading} onClick={handleLogin}>
        Log In
      </button>
      <button disabled={loading} onClick={handleLogout}>
        Log Out
      </button>
    </>
  );
};

export default App;
