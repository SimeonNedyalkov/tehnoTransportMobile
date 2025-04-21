import { createContext, useContext, useEffect, useState } from "react";

const USERURL = "https://tehno-transport-b.onrender.com/user/getUser";

export const UserContext = createContext<any>(null);
interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
}
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(USERURL, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("User not authenticated");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log("User fetch error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
