export const checkId = (id: string): boolean => {
  const idRegex = /^[a-z0-9]{6,15}$/; // 6~15자의 영문 소문자와 숫자
  return idRegex.test(id);
};

export const checkPassword = (password: string): boolean => {
  // 8~15자, 영문 대소문자, 숫자, 특수문자 포함
  const pwdRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,15}$/;
  return pwdRegex.test(password);
};

export const checkUsername = (username: string): boolean => {
  // 2~12자, 한글, 영문, 숫자 포함
  const nicknameRegex = /^[가-힣A-Za-z0-9]{2,12}$/;
  return nicknameRegex.test(username);
};
