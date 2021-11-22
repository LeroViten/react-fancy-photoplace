import firebase from '../../firebase/config';
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { updateUserProfile, authStateChange, authSignOut } from './authReducer';

export const authSignUpUser =
  ({ username, email, password }) =>
  async (dispatch, getState) => {
    // newer way as of november 2021:
    try {
      // const auth = getAuth(firebase);
      // const { user } = await createUserWithEmailAndPassword(
      //   auth,
      //   email,
      //   password
      // );
      // const updatedUser = await updateProfile(auth.currentUser, {
      //   displayName: username,
      // });
      await firebase.auth().createUserWithEmailAndPassword(email, password);

      const user = await firebase.auth().currentUser;

      await user.updateProfile({
        displayName: nickname,
      });

      dispatch(
        updateUserProfile({ userId: user.uid, username: user.displayName })
      );
    } catch (err) {
      console.log(err.message);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    // newer way as of november 2021:
    try {
      // const auth = getAuth(firebase);
      // const { user } = await signInWithEmailAndPassword(auth, email, password);
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      dispatch(
        updateUserProfile({ userId: user.uid, username: user.displayName })
      );
    } catch (err) {
      console.log(err.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  // newer way as of november 2021:
  try {
    // const auth = getAuth();
    // signOut(auth);
    await firebase.auth().signOut();
    dispatch(authSignOut());
  } catch (err) {
    console.log(err.message);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  // const auth = getAuth(firebase);
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/firebase.User
  //     const updatedUserProfile = {
  //       username: user.displayName,
  //       userId: user.uid,
  //     };
  await firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      const userUpdateProfile = {
        username: user.displayName,
        userId: user.uid,
      };

      dispatch(authStateChange({ isAuth: true }));
      dispatch(updateUserProfile(userUpdateProfile));
      // dispatch(updateUserProfile(updatedUserProfile));
      // dispatch(authStateChange({ isAuth: true }));
    } else {
      // User is signed out
      console.log('Authenticate first!');
    }
  });
};
