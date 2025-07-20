import { useState } from "react";

const useForm = (initialData, validate) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.form) {
      setErrors((prev) => ({ ...prev, [name]: "", form: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = validate(formData);
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const resetForm = () => {
    setFormData(initialData);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleChange,
    validateForm,
    setFormData,
    resetForm,
  };
};

export default useForm;
