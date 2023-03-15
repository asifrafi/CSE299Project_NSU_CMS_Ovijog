import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Button,
  Message,
  Segment,
  TextArea,
  Divider,
  Dropdown,
} from 'semantic-ui-react';
import ImageDropDiv from '../components/Common/ImageDropDiv';
import { registerUserTwo } from '../utils/authUser';
import uploadPic from '../utils/upload-pic-to-cloudinary';

function signupTwo() {
  const [user, setUser] = useState({
    RFID: '',
    phoneNumber: '',
    typeOfUser: '',
  });

  const { RFID, phoneNumber, typeOfUser } = user;

  const handleChange = (e, result) => {
    const { name, value, files } = result || e.target;

    if (name === 'media') {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setUser({ ...user, [name]: value });
  };

  const userType = [
    {
      key: 'Student',
      text: 'Student',
      value: 'Student',
    },
    {
      key: 'Faculty',
      text: 'Faculty',
      value: 'Faculty',
    },
    {
      key: 'Admin-Staff',
      text: 'Admin-Staff',
      value: 'Admin-Staff',
    },
    {
      key: 'Non-Faculty',
      text: 'Non-Faculty',
      value: 'Non-Faculty',
    },
  ];

  const [errorMessage, setErrorMessage] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const inputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    let profilePicUrl;

    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }

    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMessage('Error Uploading Image');
    }

    await registerUserTwo(user, profilePicUrl, setErrorMessage, setFormLoading);
  };

  useEffect(() => {
    const isUser = Object.values({
      RFID,
      phoneNumber,
      typeOfUser,
      media,
    }).every((item) => Boolean(item));

    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  });

  return (
    <>
      <Message
        color="teal"
        attached
        header={'Get Started with NSU Ovijog'}
        icon={'settings'}
        content={'Continue creating the Account'}
      />
      <Form
        loading={formLoading}
        error={errorMessage != null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="Opps!"
          content={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />
        <Segment>
          <ImageDropDiv
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />
          <Form.Input
            label="RFID"
            placeholder="RFID"
            name="RFID"
            value={RFID}
            onChange={handleChange}
            fluid
            icon="id card outline"
            iconPosition="left"
            required
          />

          <Form.Input
            label="Phone Number"
            placeholder="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleChange}
            fluid
            icon="phone"
            iconPosition="left"
            required
          />

          <Form.Dropdown
            label="Type Of User"
            placeholder="Type Of User"
            name="typeOfUser"
            selection
            onChange={handleChange}
            options={userType}
            value={user.typeOfUser}
            required
          />

          <Divider hidden />
          <Button
            icon="signup"
            content="Sign Up"
            type="submit"
            color="orange"
            disabled={submitDisabled}
          />
        </Segment>
      </Form>
    </>
  );
}

export default signupTwo;
