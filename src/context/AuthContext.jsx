import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [signupForm, setSignupForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [resetForm, setResetForm] = useState({
    email: "",
    otp: ["", "", "", ""],
    newPassword: "",
  });

  return (
    <AuthContext.Provider
      value={{
        signupForm,
        setSignupForm,
        resetForm,
        setResetForm,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
