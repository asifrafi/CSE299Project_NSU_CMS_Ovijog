import Link from 'next/link';
import React, { useEffect, useReducer, useState } from 'react';
import { Button, Card, Divider, Grid, Image, Modal } from 'semantic-ui-react';
import cookie from 'js-cookie';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import calculateTime from '../utils/calculateTime';
import CardComplain from '../components/Complain/CardComplain';

function Complain({ user }) {
  const [complains, setComplains] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [modalData, setModalData] = useState({});

  useEffect(() => {
    (async () => {
      const token = cookie.get('token');

      let res;

      try {
        if (user.typeOfUser !== 'System-Admin') {
          res = await axios.get(`${baseUrl}/api/v1/complain/complainByMe`, {
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
    if (user.typeOfUser !== 'System-Admin') {
      return (
        <div>
          <Grid>
            <Grid.Column textAlign="center">
              <Button.Group size="massive">
                <Link href="/create-complain">
                  <Button
                    color="violet"
                    icon="hand point left outline"
                    content={buttonName[0]}
                  />
                </Link>

                <Link href="/complain-against">
                  <Button
                    color="purple"
                    icon="hand point up outline"
                    content={buttonName[1]}
                  />
                </Link>

                <Link href="/past-complain">
                  <Button
                    color="pink"
                    icon="hand point right outline"
                    content="Past Complains"
                  />
                </Link>
              </Button.Group>
            </Grid.Column>
          </Grid>

          <Divider />

          <Card.Group>
            {complains.map((complain) => (
              <CardComplain
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
                <Link href="/create-complain">
                  <Button
                    color="violet"
                    icon="hand point left outline"
                    content={buttonName[0]}
                  />
                </Link>
              </Button.Group>
            </Grid.Column>
          </Grid>

          <Divider />

          <Card.Group>
            {complains.map((complain) => (
              <CardComplain
                key={complain._id}
                user={user}
                complain={complain}
                setComplains={setComplains}
              />
            ))}
          </Card.Group>
        </div>
      );
    }
  } else {
    return (
      <div>
        <Grid>
          <Grid.Column textAlign="center">
            <Button.Group size="Big">
              <Link href="/create-complain">
                <Button
                  color="violet"
                  icon="hand point left outline"
                  content={buttonName[0]}
                />
              </Link>

              <Link href="/complain-against">
                <Button
                  color="purple"
                  icon="hand point up outline"
                  content={buttonName[1]}
                />
              </Link>

              <Link href="/past-complain">
                <Button
                  color="pink"
                  icon="hand point right outline"
                  content="Past Complains"
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

export default Complain;
