import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import baseUrl from '../utils/baseUrl';
import ImageDropDiv from '../components/Common/ImageDropDiv';
import uploadPic from '../utils/upload-pic-to-cloudinary';
import { createComplain } from '../utils/complain';

import {
  Form,
  Message,
  Search,
  Segment,
  List,
  Image,
  Divider,
  Label,
  Button,
  Grid,
} from 'semantic-ui-react';

function CreateComplain({ user }) {
  const [complain, setComplain] = useState({
    title: '',
    complaintext: '',
  });

  const { title, complaintext } = complain;

  const [complainer, setComplainer] = useState('');
  const [complainerID, setComplainerID] = useState('');
  const [complainerLoading, setComplainerLoading] = useState(false);
  const [complainerResults, setComplainerResults] = useState([]);

  const complainerHandleChange = async (e) => {
    const { value } = e.target;
    setComplainer(value);
    setComplainerLoading(true);

    try {
      const token = cookie.get('token');

      const res = await axios.get(`${baseUrl}/api/v1/user/${value}`, {
        headers: { Authorization: token },
      });

      if (res.data.length === 0) return setComplainerLoading(false);

      setComplainerResults(res.data);
    } catch (error) {
      console.log(error);
      ('Error Searching');
    }

    setComplainerLoading(false);
  };

  const [faulty, setFaulty] = useState('');
  const [faultyID, setFaultyID] = useState('');
  const [faultyLoading, setFaultyLoading] = useState(false);
  const [faultyResults, setFaultyResults] = useState([]);

  const faultyHandleChange = async (e) => {
    const { value } = e.target;
    setFaulty(value);
    setFaultyLoading(true);

    try {
      const token = cookie.get('token');

      const res = await axios.get(`${baseUrl}/api/v1/user/${value}`, {
        headers: { Authorization: token },
      });

      if (res.data.length === 0) return setFaultyLoading(false);

      setFaultyResults(res.data);
    } catch (error) {
      console.log(error);
      ('Error Searching');
    }

    setFaultyLoading(false);
  };

  const [reviewer, setReviewer] = useState('');
  const [reviewerID, setReviewerID] = useState('');
  const [reviewerLoading, setReviewerLoading] = useState(false);
  const [reviewerResults, setReviewerResults] = useState([]);

  const reviewerHandleChange = async (e) => {
    const { value } = e.target;
    setReviewer(value);
    setReviewerLoading(true);

    try {
      const token = cookie.get('token');

      const res = await axios.get(`${baseUrl}/api/v1/user/reviewer/${value}`, {
        headers: { Authorization: token },
      });

      if (res.data.length === 0) return setReviewerLoading(false);

      setReviewerResults(res.data);
    } catch (error) {
      console.log(error);
      ('Error Searching');
    }

    setReviewerLoading(false);
  };

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

  const inputRef = useRef();

  const [errorMessage, setErrorMessage] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const handleChange = (e, result) => {
    const { name, value, files } = e.target || result;

    if (name === 'media') {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setComplain({ ...complain, [name]: value });
  };

  useEffect(() => {
    if (faultyID && reviewerID) {
      if (user.typeOfUser !== 'System-Admin')
        setComplain((prev) => ({ ...prev, complainer: user._id }));
      else setComplain((prev) => ({ ...prev, complainer: complainerID }));
      setComplain((prev) => ({ ...prev, faulty: faultyID }));
      setComplain((prev) => ({ ...prev, reviewer: reviewerID }));
    }
  }, [faultyID, reviewerID]);

  const handleSubmit = async (e) => {
    e.preventDefault(true);
    setFormLoading(true);

    let evidence;

    if (media !== null) {
      evidence = await uploadPic(media);
    }

    if (media !== null && !evidence) {
      setFormLoading(false);
      return setErrorMessage('Error uploading Image');
    }

    await createComplain(complain, evidence, setErrorMessage, setFormLoading);
  };

  useEffect(() => {
    const isComplain = Object.values({
      title,
      complaintext,
      faultyID,
      reviewerID,
      media,
    }).every((item) => Boolean(item));

    isComplain ? setSubmitDisabled(false) : setSubmitDisabled(true);
  });

  if (user.typeOfUser !== 'System-Admin') {
    return (
      <>
        <Message
          color="teal"
          attached
          header="Lodge Complain"
          icon="envelope"
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
            <Form.Input
              label="Title"
              placeholder="Title"
              name="title"
              value={title}
              onChange={handleChange}
              fluid
              required
            />
            <Form.TextArea
              label="Complain"
              placeholder="Detailed Complain"
              name="complaintext"
              value={complaintext}
              onChange={handleChange}
              fluid
              required
            />
            <Label as="h4"> Faulty </Label>
            <Search
              label="Faulty"
              onBlur={() => {
                faultyResults.length > 0 && setFaultyResults([]);
                faultyLoading && setFaultyLoading(false);
              }}
              loading={faultyLoading}
              value={faulty}
              resultRenderer={ResultRenderer}
              results={faultyResults}
              onSearchChange={faultyHandleChange}
              minCharacters={1}
              onResultSelect={(e, data) => {
                setFaulty(data.result.name);
                setFaultyID(data.result._id);
                console.log(faultyID);
              }}
              fluid
            />

            <Divider hidden />

            <Label as="h4"> Reviewer </Label>
            <Search
              label="Reviewer"
              onBlur={() => {
                reviewerResults.length > 0 && setReviewerResults([]);
                reviewerLoading && setReviewerLoading(false);
              }}
              loading={reviewerLoading}
              value={reviewer}
              resultRenderer={ResultRenderer}
              results={reviewerResults}
              onSearchChange={reviewerHandleChange}
              minCharacters={1}
              onResultSelect={(e, data) => {
                setReviewer(data.result.name);
                setReviewerID(data.result._id);
              }}
              fluid
            />

            <Divider hidden />

            <ImageDropDiv
              mediaPreview={mediaPreview}
              setMediaPreview={setMediaPreview}
              setMedia={setMedia}
              inputRef={inputRef}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
              handleChange={handleChange}
            />
          </Segment>

          <Divider hidden />
          <Grid>
            <Grid.Column textAlign="center">
              <Button
                icon="send"
                content="Submit"
                type="submit"
                color="orange"
                disabled={submitDisabled}
              />
            </Grid.Column>
          </Grid>
        </Form>
      </>
    );
  } else {
    return (
      <>
        <Message
          color="teal"
          attached
          header="Lodge Complain"
          icon="envelope"
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
            <Form.Input
              label="Title"
              placeholder="Title"
              name="title"
              value={title}
              onChange={handleChange}
              fluid
              required
            />
            <Form.TextArea
              label="Complain"
              placeholder="Detailed Complain"
              name="complaintext"
              value={complaintext}
              onChange={handleChange}
              fluid
              required
            />

            <Divider hidden />

            <Label as="h4"> Complainer </Label>
            <Search
              label="Complainer"
              onBlur={() => {
                complainerResults.length > 0 && setComplainerResults([]);
                complainerLoading && setComplainerLoading(false);
              }}
              loading={complainerLoading}
              value={complainer}
              resultRenderer={ResultRenderer}
              results={complainerResults}
              onSearchChange={complainerHandleChange}
              minCharacters={1}
              onResultSelect={(e, data) => {
                setComplainer(data.result.name);
                setComplainerID(data.result._id);
              }}
              fluid
            />

            <Divider hidden />

            <Label as="h4"> Accused </Label>
            <Search
              label="Faulty"
              onBlur={() => {
                faultyResults.length > 0 && setFaultyResults([]);
                faultyLoading && setFaultyLoading(false);
              }}
              loading={faultyLoading}
              value={faulty}
              resultRenderer={ResultRenderer}
              results={faultyResults}
              onSearchChange={faultyHandleChange}
              minCharacters={1}
              onResultSelect={(e, data) => {
                setFaulty(data.result.name);
                setFaultyID(data.result._id);
                console.log(faultyID);
              }}
              fluid
            />

            <Divider hidden />

            <Label as="h4"> Reviewer </Label>
            <Search
              label="Reviewer"
              onBlur={() => {
                reviewerResults.length > 0 && setReviewerResults([]);
                reviewerLoading && setReviewerLoading(false);
              }}
              loading={reviewerLoading}
              value={reviewer}
              resultRenderer={ResultRenderer}
              results={reviewerResults}
              onSearchChange={reviewerHandleChange}
              minCharacters={1}
              onResultSelect={(e, data) => {
                setReviewer(data.result.name);
                setReviewerID(data.result._id);
              }}
              fluid
            />

            <Divider hidden />

            <ImageDropDiv
              mediaPreview={mediaPreview}
              setMediaPreview={setMediaPreview}
              setMedia={setMedia}
              inputRef={inputRef}
              highlighted={highlighted}
              setHighlighted={setHighlighted}
              handleChange={handleChange}
            />
          </Segment>

          <Divider hidden />
          <Grid>
            <Grid.Column textAlign="center">
              <Button
                icon="send"
                content="Submit"
                type="submit"
                color="orange"
                disabled={submitDisabled}
              />
            </Grid.Column>
          </Grid>
        </Form>
      </>
    );
  }
}

const ResultRenderer = ({ _id, image, name }) => {
  return (
    <List key={_id}>
      <List.Item>
        <Image src={image} alt="ProfilePic" avatar />
        <List.Content header={name} as="a" />
      </List.Item>
    </List>
  );
};

export default CreateComplain;
