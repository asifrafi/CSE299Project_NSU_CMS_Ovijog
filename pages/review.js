import Link from 'next/link';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Card, Divider, Grid, Image, Modal } from 'semantic-ui-react';
import cookie from 'js-cookie';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import CardReview from '../components/Review/CardReview';

function Review({ user }) {
  const [complains, setComplains] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [modalData, setModalData] = useState({});

  useEffect(() => {
    (async () => {
      const token = cookie.get('token');

      let res;

      try {
        if (user.typeOfUser !== 'System-Admin') {
          res = await axios.get(`${baseUrl}/api/v1/review/myReviewComplains`, {
            headers: { Authorization: token },
          });
        } else {
          res = await axios.get(`${baseUrl}/api/v1/complain`, {
            headers: { Authorization: token },
          });
        }

        //console.log(res.data.complains[0].reviewer);
        setComplains(res.data.complains);
        //console.log(complains);
      } catch (error) {
        console.log(error);
        ('Error Searching Complains');
      }
    })();
  }, [complains]);

  var buttonName = ['Create Complain', 'Complain Against Me'];
  if (complains) {
    return (
      <div>
        <Grid>
          <Grid.Column textAlign="center">
            <Button.Group size="massive">
              <Link href="/resolved-complains">
                <Button
                  color="purple"
                  icon="hand point up outline"
                  content="Resolved Complains"
                />
              </Link>
            </Button.Group>
          </Grid.Column>
        </Grid>

        <Divider />

        <Card.Group>
          {complains.map((complain) => (
            <CardReview
              key={complain._id}
              user={user}
              complain={complain}
              setComplains={setComplains}
            />
          ))}
        </Card.Group>
      </div>
    );
  } else {
    return (
      <div>
        <Grid>
          <Grid.Column textAlign="center">
            <Button.Group size="massive">
              <Link href="/resolved-complains">
                <Button
                  color="purple"
                  icon="hand point up outline"
                  content="Resolved Complains"
                />
              </Link>
            </Button.Group>
          </Grid.Column>
        </Grid>

        <Divider />

        <>You made no complain</>
      </div>
    );
  }
}

export default Review;
