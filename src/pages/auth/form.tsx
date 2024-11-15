import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import {
  auth,
  signInWithGoogle,
  logout,
  exportCollection,
  setAdminRole,
} from "../../firebase/client";

import { useEffect, useState } from "react";

type User = {
  displayName: string | null;
};
const Form: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check for custom claims to verify admin role
        const tokenResult = await currentUser.getIdTokenResult();
        setIsAdmin(!!tokenResult.claims.admin); // true if user has admin role
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return unsubscribe; // Clean up the subscription on unmount
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error signing in:", error.message);
      } else {
        console.error("Error signing in:", error);
      }
    }
  };

  const [uid, setUid] = useState("");
  const [status, setStatus] = useState("");

  const handleAssignAdmin = async () => {
    try {
      setStatus("Assigning admin role...");
      const result = await setAdminRole({ uid });
      setStatus((result.data as { message: string }).message); // Message returned from the Firebase function
    } catch (error) {
      setStatus(`Error: ${(error as any).message}`);
      console.error("Error assigning admin role:", error);
    }
  };
  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.displayName}</p>
          <button onClick={logout}>Logout</button>
          <button onClick={() => exportCollection("submissions")}>
            Export CSV
          </button>

          <h3>Assign Admin Role</h3>
          <input
            type="text"
            placeholder="User UID"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
          />
          <button onClick={handleAssignAdmin}>Assign Admin Role</button>
          {status && <p>{status}</p>}
        </>
      ) : (
        <>
          <button onClick={() => signInWithGoogle()}>
            Sign in with Google
          </button>

          <h3>Log in</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </>
      )}
    </div>
  );
};

export default Form;
