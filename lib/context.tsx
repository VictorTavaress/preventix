import React, { createContext, useContext, useState } from "react";

interface FormContextType {
  formData: Record<string, any>;
  updateFormData: (newData: any) => void;
}

const FormContext = createContext<FormContextType | null>(null);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState({});

  const updateFormData = (newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error("useForm must be used inside FormProvider");
  return context;
};
