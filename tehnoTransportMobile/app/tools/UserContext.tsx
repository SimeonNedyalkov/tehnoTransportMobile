import { createContext, useContext, useEffect, useState } from "react";

const USERURL = "http://192.168.1.6:3000/user/getUser";

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
        const photoURL =
          "http://192.168.1.6:3000/" +
          data.photoURL.split("http://localhost:3000/")[1];
        data.photoURL = photoURL;
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
