export const AUTH_ERROR_MESSAGES = {
  nickname: {
    required: '이름을 입력해 주세요.',
    tooLong: '이름은 10글자 이하로 작성해 주세요.',
    duplicated: '이미 사용 중인 이름입니다.',
  },
  email: {
    required: '이메일을 입력해 주세요.',
    invalid: '올바른 이메일 형식이 아닙니다.',
    duplicated: '이미 사용 중인 이메일입니다.',
  },
  password: {
    required: '비밀번호를 입력해 주세요.',
    invalid:
      '비밀번호는 8자 이상 20자 이하이며 영문자, 숫자, 특수문자(!@#$%^&*)만 사용할 수 있습니다.',
  },
  passwordConfirmation: {
    required: '비밀번호를 입력해 주세요.',
    notMatch: '비밀번호가 일치하지 않습니다.',
  },
};
