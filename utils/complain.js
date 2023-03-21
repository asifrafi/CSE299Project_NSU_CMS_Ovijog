import axios from 'axios';
import baseUrl from './baseUrl';
import catchErrors from './catchErrors';
import Router from 'next/router';
import cookie from 'js-cookie';
// this is the part that gets authorization connected
export const createComplain = async (
  complain,
  evidence,
  setError,
  setLoading
) => {
  try {
    const token = cookie.get('token');

    const res = await axios.post(
      `${baseUrl}/api/v1/complain/createComplain`,
      { complain, evidence },
      { headers: { Authorization: token } }
    );

    Router.reload();
  } catch (error) {
    const errorMsg = catchErrors(error);
    setError(errorMsg);
  }

  setLoading(false);
};

export const createComment = async (
  complainId,
  user,
  text,
  setComments,
  setText
) => {
  try {
    const token = cookie.get('token');

    const res = await axios.patch(
      `${baseUrl}/api/v1/complain/comment/${complainId}`,
      { text },
      { headers: { Authorization: token } }
    );

    const newComment = {
      _id: res.data,
      commenter: user,
      text,
      date: Date.now(),
    };

    setComments((prev) => [newComment, ...prev]);

    setText('');
  } catch (error) {
    alert(catchErrors(error));
  }
};

export const EditComplain = async (
  user,
  complain,
  editComplain,
  evidence,
  setErrorMessage,
  setFormLoading,
  setComplains
) => {
  try {
    const token = cookie.get('token');

    const res = await axios.patch(
      `${baseUrl}/api/v1/complain/editMyComplain/${complain._id}`,
      { user, complain, editComplain, evidence },
      { headers: { Authorization: token } }
    );

    Router.reload();
  } catch (error) {
    const errorMsg = catchErrors(error);
    setErrorMessage(errorMsg);
  }
};
