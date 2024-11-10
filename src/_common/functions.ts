export const checkMasterPassword = () => {
  const password = prompt(
    '기능 개선 작업 진행 중입니다. 비밀번호를 입력하세요.',
  );

  if (password !== '12345') {
    alert('개발팀만 사용할 수 있습니다.');
    return false;
  }

  return true;
};
