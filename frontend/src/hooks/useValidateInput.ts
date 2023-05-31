import { useAppDispatch } from "@/src/hooks/useReduxHooks";
import { useCallback, useMemo, useState } from "react";
import { ICourseForm } from "../interfaces/Course.type";
import { setFormValue } from "../store/reducers/CourseFormSlice";

const useValidateInput = (
  validation: (value: string) => boolean,
  fieldValue: string
) => {
  const dispatch = useAppDispatch();
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = useMemo(
    () => validation(fieldValue),
    [validation, fieldValue]
  );
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target;
      const newValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
      dispatch(
        setFormValue({ name: name as keyof ICourseForm, value: newValue })
      );
    },
    [dispatch, setFormValue]
  );

  const inputBlurHandler = () => {
    setIsTouched(true);
  };

  const result = useMemo(
    () => ({
      value: fieldValue,
      isValid: valueIsValid,
      hasError,
      valueChangeHandler,
      inputBlurHandler,
    }),
    [fieldValue, valueIsValid, isTouched, valueChangeHandler, inputBlurHandler]
  );

  return result;
};
export default useValidateInput;
