import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  user: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setUser: any;
}

// Fornecendo valores padrão para o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null); // Novo estado para o e-mail

  return (
    <AuthContext.Provider value={{ token, user, setToken, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
