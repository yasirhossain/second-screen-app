import { ANONYMOUS_USER } from '../helpers/constants';
import { auth } from '../modules/firebase';

const setSelf = (user) => {
  localStorage.setItem('seismicChatUser', JSON.stringify(user));
};

export const updateSelf = (user) => {
  localStorage.setItem('seismicChatUser', JSON.stringify(user));
  //getSelf(user);
};

export const getSelf = (user) => {
  const firebaseUser = user;
  const localUser = JSON.parse(localStorage.getItem('seismicChatUser'));

  // Returning User Who Has Not Signed In
  // User info is pulled from local storage
  if (localUser !== null && firebaseUser === null) {
    //console.log("This is a returning user who has not signed in.");
    //setCurrentUser(JSON.parse(localUser));
    return localUser;
  }
  // Returning User Who Has Signed In
  // User info is pulled from Firebase
  else if (localUser !== null && firebaseUser !== null) {
    //console.log("This is a returning signed in user.");

    let parsedLocalUser = localUser;
    let tempUser = null;

    if (parsedLocalUser.avatarUrl === undefined) {
      tempUser = {
        ...firebaseUser,
        avatarUrl: ANONYMOUS_USER.avatarUrl,
        chatName: ANONYMOUS_USER.chatName,
        devices: ANONYMOUS_USER.devices,
        role: ANONYMOUS_USER.role,
        preferences: ANONYMOUS_USER.preferences,
      };
    } else {
      tempUser = {
        ...firebaseUser,
        avatarUrl: parsedLocalUser.avatarUrl,
        chatName: parsedLocalUser.chatName,
        devices: parsedLocalUser.devices,
        role: parsedLocalUser.role,
        preferences: parsedLocalUser.preferences,
      };
    }
    setSelf(tempUser);
    return tempUser;
  }
  // New User
  // Anonymous user is created
  else {
    //console.log("This is a new user");
    setSelf(ANONYMOUS_USER);
    return ANONYMOUS_USER;
  }
};
