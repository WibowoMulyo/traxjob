import { useState, useCallback } from "react";

type ValidationRules<T> = Partial<Record<keyof T, (value: any) => string | null>>;

export function useFormState<T extends Record<string, any>>(
  initialState: T,
  validationRules?: ValidationRules<T>
) {
  const [values, setValues] = useState<T>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback((field: keyof T) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues(prev => ({ ...prev, [field]: e.target.value }));
    if (touched[field as string]) {
      const rule = validationRules?.[field];
      const error = rule ? rule(e.target.value) : null;
      setErrors(prev => ({ ...prev, [field]: error || "" }));
    }
  }, [touched, validationRules]);

  const handleBlur = useCallback((field: keyof T) => () => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const rule = validationRules?.[field];
    const error = rule ? rule(values[field]) : null;
    setErrors(prev => ({ ...prev, [field]: error || "" }));
  }, [values, validationRules]);

  const validate = useCallback(() => {
    if (!validationRules) return true;
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    for (const field in validationRules) {
      const rule = validationRules[field];
      const error = rule ? rule(values[field]) : null;
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialState);
    setErrors({});
    setTouched({});
  }, [initialState]);

  return { values, errors, touched, handleChange, handleBlur, validate, reset };
}
