import {useState, useEffect, useCallback} from "react";
import {debounce} from "./debounce";
import {checkId, checkPassword, checkUsername} from "./validCheck";
import {SignUp} from "../components/commons/auth/SignUp";

interface inputValid {
  idValid: boolean;
  passwordValid: boolean;
  usernameValid: boolean;
  passwordsMatch: boolean;
}

export const useSignUpValidation = (inputVal: SignUp) => {
  const [isAuth, setIsAuth] = useState<inputValid>({
    idValid: true,
    passwordValid: true,
    usernameValid: true,
    passwordsMatch: true,
  });

  const validateInputs = useCallback(
    debounce((inputVal: SignUp) => {
      const idValid = checkId(inputVal.user_id);
      const passwordValid = checkPassword(inputVal.password);
      const usernameValid = checkUsername(inputVal.username);
      const passwordsMatch = inputVal.password === inputVal.passwordCheck;

      setIsAuth({
        idValid,
        passwordValid,
        usernameValid,
        passwordsMatch,
      });
    }, 700),
    []
  );

  useEffect(() => {
    validateInputs(inputVal);
  }, [inputVal]);

  return isAuth;
};
