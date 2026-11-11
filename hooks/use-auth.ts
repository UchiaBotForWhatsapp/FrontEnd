"use client";

import { useCallback, useState } from "react";
import { authApi, clearAuthToken } from "@/lib/api-client";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (identifier: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(identifier, password);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(
    async (registrationData: {
      name: string;
      email: string;
      gender: "male" | "female" | "other";
      termsAccepted: boolean;
      password: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await authApi.register(registrationData);

        return response;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    clearAuthToken();
  }, []);

  const googleLogin = useCallback(async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.googleLogin(idToken);
      setUser(response.user);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  return { user, loading, error, login, register, googleLogin, logout };
}