const regex: RegExp =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export function isValidPasswordFormat(password: string): boolean {
  return regex.test(password);
}
