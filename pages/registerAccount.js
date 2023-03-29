import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Button,
  Message,
  Segment,
  TextArea,
  Divider,
  Header,
} from 'semantic-ui-react';
import axios from 'axios';
import ImageDropDiv from '../components/Common/ImageDropDiv';
import uploadPic from '../utils/upload-pic-to-cloudinary';
import baseUrl from '../utils/baseUrl';
import { registerAccountSysAdmin } from '../utils/authUser';

function RegisterAccount() {
  const [user, setUser] = useState({
    name: '',
    password: '',
    RFID: '',
    phoneNumber: '',
    typeOfUser: '',
  });

  const { name, password, RFID, phoneNumber, typeOfUser } = user;

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
      key: 'Helper',
      text: 'Helper',
      value: 'Helper',
    },
    {
      key: 'System-Admin',
      text: 'System-Admin',
      value: 'System-Admin',
    },
  ];

  const [showPassword, setShowPassword] = useState(false);
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

    await registerAccountSysAdmin(
      user,
      profilePicUrl,
      setErrorMessage,
      setFormLoading
    );
  };

  useEffect(() => {
    const isUser = Object.values({
      name,
      email,
      password,
      RFID,
      phoneNumber,
      typeOfUser,
      media,
    }).every((item) => Boolean(item));

    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  });

  const [email, setEmail] = useState('');
  const [userEmailLoading, setUserEmailLoading] = useState(false);
  const [userEmailAvailable, setUserEmailAvailable] = useState(false);

  useEffect(() => {
    email === '' ? setUserEmailAvailable(false) : checkEmail();
  }, [email]);

  const checkEmail = async () => {
    console.log(email);
    setUserEmailLoading(true);
    let res;
    try {
      res = await axios.get(`${baseUrl}/api/v1/signup/${email}`);
      //console.log(res);

      if (errorMessage != null) setErrorMsg(null);

      const checkEmail = email.split('@');
      //console.log(res.data);
      if (res.data == 'Available') {
        setUserEmailAvailable(true);
        //console.log(email);
        setUser((prev) => ({ ...prev, email: email }));
        //console.log(user);
      }
    } catch (error) {
      setErrorMessage('Email Not Accepted');
      setUserEmailAvailable(false);
    }
    setUserEmailLoading(false);
  };

  return (
    <>
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
        <Segment color="purple">
          <Form.Input
            label="Name"
            placeholder="Name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
            required
          />

          <Form.Input
            loading={userEmailLoading}
            error={!userEmailAvailable}
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              let mm = e.target.value.split('@');
              if (mm[1] == 'northsouth.edu') setUserEmailAvailable(true);
              else setUserEmailAvailable(false);
            }}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
            required
          />

          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: 'eye',
              circular: true,
              link: true,
              onClick: () => setShowPassword(!showPassword),
            }}
            iconPosition="left"
            type={showPassword ? 'text' : 'password'}
            required
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

          <ImageDropDiv
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />

          <Divider hidden />
          <Button
            icon="angle double right"
            content="Register"
            type="submit"
            color="orange"
            disabled={submitDisabled || !userEmailAvailable}
          />
        </Segment>
      </Form>
    </>
  );
}

export default RegisterAccount;
