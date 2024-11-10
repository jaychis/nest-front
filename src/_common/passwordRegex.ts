export function isValidPasswordFormat(password: string): boolean {
  const regex: RegExp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  return regex.test(password);
}

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const regex: RegExp = /^010\d{8}$/;
  return regex.test(phoneNumber);
};
