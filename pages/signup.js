import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Button,
  Message,
  Segment,
  Divider,
  Header,
} from 'semantic-ui-react';
import axios from 'axios';

import {
  HeaderMessage,
  FooterMessage,
} from '../components/Common/WelcomeMessage';

import baseUrl from '../utils/baseUrl';
import { registerUser } from '../utils/authUser';

function SingUp() {
  const [user, setUser] = useState({
    name: '',
    password: '',
  });

  const { name, password } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [email, setEmail] = useState('');
  const [userEmailLoading, setUserEmailLoading] = useState(false);
  const [userEmailAvailable, setUserEmailAvailable] = useState(false);

  useEffect(() => {
    email === '' ? setUserEmailAvailable(false) : checkEmail();
  }, [email]);

  const checkEmail = async () => {
    //console.log(email);
    setUserEmailLoading(true);
    let res;
    try {
      res = await axios.get(`${baseUrl}/api/v1/signup/${email}`);
      //console.log(res);

      if (errorMessage != null) setErrorMsg(null);

      const checkEmail = email.split('@');
      //console.log(res.data);
      if (res.data == 'Available' && checkEmail[1] === 'northsouth.edu') {
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

  useEffect(() => {
    const isUser = Object.values({
      name,
      email,
      password,
    }).every((item) => Boolean(item));

    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    //console.log(user);
    await registerUser(user, setErrorMessage, setFormLoading);
  };

  return (
    <>
      <HeaderMessage />
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
            placeholder="NSU Email"
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

          <Divider hidden />
          <Button
            icon="angle double right"
            content="  Next"
            type="submit"
            color="orange"
            disabled={submitDisabled || !userEmailAvailable}
          />
        </Segment>
      </Form>

      <Divider />

      <FooterMessage />
    </>
  );
}

export default SingUp;
