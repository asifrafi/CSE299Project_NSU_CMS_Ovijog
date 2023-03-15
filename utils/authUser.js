import axios from 'axios';
import baseUrl from './baseUrl';
import catchErrors from './catchErrors';
import Router from 'next/router';
import cookie from 'js-cookie';

export const registerUser = async (myUser, setError, setLoading) => {
  //setLoading(true);
  console.log(myUser);

  const user = myUser;
  try {
    const res = await axios.post(`${baseUrl}/api/v1/signup`, { user });

    cookie.set('token', res.data);
    Router.push('/signup-two');
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
  setLoading(false);
};

export const registerUserTwo = async (
  myuser,
  myprofilePicUrl,
  setError,
  setLoading
) => {
  //setLoading(true);
  try {
    const token = cookie.get('token');

    const user = myuser;
    const profilePicUrl = myprofilePicUrl;

    //console.log(token, user, profilePicUrl);

    const res = await axios.patch(
      `${baseUrl}/api/v1/signup/second`,
      {
        user,
        profilePicUrl,
      },
      { headers: { Authorization: token } }
    );

    Router.push('/');
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
  setLoading(false);
};

export const loginUser = async (user, setError, setLoading) => {
  setLoading(true);
  try {
    //console.log(user);
    const res = await axios.post(`${baseUrl}/api/v1/login`, { user });

    cookie.set('token', res.data);
    Router.push('/');
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }
  setLoading(false);
};

export const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    Router.push(location);
  }
};

export const logoutUser = (email) => {
  cookie.set('userEmail', email);
  cookie.remove('token');
  Router.push('/login');
  Router.reload();
};

export const registerAccountSysAdmin = async (
  user,
  profilePicUrl,
  setError,
  setFormLoading
) => {
  try {
    const token = cookie.get('token');

    const res = await axios.post(
      `${baseUrl}/api/v1/signup/registerAccountSys`,
      { user, profilePicUrl },
      { headers: { Authorization: token } }
    );

    Router.reload();
    Router.push('/registerAccount');
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }

  setFormLoading(false);
};
