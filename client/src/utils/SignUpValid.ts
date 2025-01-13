import { useState, useEffect, useCallback } from "react";
import { debounce } from "./debounce";
import { checkId, checkPassword, checkNickname } from "./validCheck";
import { SignUp } from "../pages/Signup";

interface inputValid {
  idValid: boolean;
  passwordValid: boolean;
  nicknameValid: boolean;
  passwordsMatch: boolean;
}

export const useSignUpValidation = (inputVal: SignUp) => {
  const [isAuth, setIsAuth] = useState<inputValid>({
    idValid: true,
    passwordValid: true,
    nicknameValid: true,
    passwordsMatch: true,
  });

  const validateInputs = useCallback(
    debounce((inputVal: SignUp) => {
      const idValid = checkId(inputVal.id);
      const passwordValid = checkPassword(inputVal.password);
      const nicknameValid = checkNickname(inputVal.nickname);
      const passwordsMatch = inputVal.password === inputVal.passwordCheck;

      setIsAuth({
        idValid,
        passwordValid,
        nicknameValid,
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
