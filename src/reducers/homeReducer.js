export const homeReducer = (prevState, action) => {
  switch (action.type) {
    case 'SET_POST':
      return {
        ...prevState,
        post: [...prevState.post, ...action.payload],
        isLoading: false,
      };
    case 'CLEAR_POST':
      return {
        ...prevState,
        post: [],
        isLoading: false,
      };

    case 'SET_CATG':
      return {
        ...prevState,
        catg: action.payload,
        isLoading: false,
      };
    case 'SET_PAGE':
      return {
        ...prevState,
        page: action.payload,
        isLoading: false,
      };
    case 'Loading':
      return {
        ...prevState,

        isLoading: action.payload,
      };
    case 'FILTER_STATUS':
      return {
        ...prevState,
        filterEnable: action.payload,
      };
    case 'SET_PROFILE_POST':
      return {
        ...prevState,
        profilePost: [...prevState.profilePost, ...action.payload],
        isLoading: false,
      };
    case 'CLEAR_PROFILE_POST':
      return {
        ...prevState,
        profilePost: [],
        isLoading: false,
      };
    case 'SET_PROFILE_PAGE':
      return {
        ...prevState,
        profilePostPage: action.payload,
        isLoading: false,
      };

    case 'CLEAR_CHAT_USER_INFO':
      return {
        ...prevState,
        chatUserInfo: [],
      };
    case 'SET_CHAT_USER_INFO':
      return {
        ...prevState,
        chatUserInfo: [...prevState.chatUserInfo, action.payload],
      };
    case 'SET_NOTIFICATION_USER':
      return {
        ...prevState,
        notificationUser: [...prevState.notificationUser, action.payload],
      };
    case 'UPDATE_NOTIFICATION_USER':
      return {
        ...prevState,
        notificationUser: [...prevState.notificationUser, ...action.payload],
      };
    case 'CLEAR_NOTIFICATION_USER':
      return {
        ...prevState,
        notificationUser: [...action.payload],
      };
    case 'SET_NOTIFICATION_TOGGLER':
      return {
        ...prevState,
        notificationToggler: action.payload,
      };

    case 'SET_USER':
      return {
        ...prevState,
        user: action.payload,
        isLoading: false,
      };

    // case 'SIGN_OUT':
    //     return {
    //         ...prevState,
    //         isSignout: true,
    //         userToken: null,
    //         loginedUser: null
    //     };
    default:
      return prevState;
  }
};
