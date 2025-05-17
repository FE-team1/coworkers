type NumericString = `${number}`;
type groupId = number | NumericString;
type taskId = number | NumericString;

const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_KAKAO: '/oauth/signup/kakao',
  MYPAGE: '/mypage',
  EDITGROUP: '/editgroup',
  NOGROUP: '/nogroup',
  ADDGROUP: '/addgroup',
  JOINGROUP: '/joingroup',
  MYHISTORY: '/myhistory',
  ARTICLES: {
    BASE: '/articles',
    NEW: '/articles/new',
  },

  getGroupPath: (groupId: groupId) => `${groupId}`,
  getGroupTaskListPath: (groupId: groupId) => `${groupId}/tasklist`,
  getGroupTaskDetailPath: (groupId: groupId, taskId: taskId) => `${groupId}/${taskId}`,
};

export default PATHS;
