'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getClientCookie, deleteClientCookie } from '@/lib/cookie/client';
import { Membership, User } from '@/types/user';
import { getUser } from '@/api/user';

interface UserContextType {
  user: User | null;
  email: string | null;
  memberships: Membership[] | null;
  fetchUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [memberships, setMemberships] = useState<Membership[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    const accessToken = getClientCookie('accessToken');

    if (!accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await getUser();
      const { id, nickname, image, email, memberships } = response.data;
      setUser({ id, nickname, image });
      setEmail(email);
      setMemberships(memberships);
    } catch {
      setUser(null);
      setEmail(null);
      setMemberships(null);
      deleteClientCookie('accessToken');
      deleteClientCookie('refreshToken');
    }
    setIsLoading(false);
  }, [setUser, setEmail]);

  const logoutUser = useCallback(async () => {
    setIsLoading(true);
    setUser(null);
    setEmail(null);
    setMemberships(null);
    setIsLoading(false);
  }, [setUser, setEmail, setMemberships]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ user, email, memberships, fetchUser, logoutUser, isLoading, setUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
