import React, { useEffect, useState } from 'react';
import { Card, Grid, Image, Header, Label } from 'semantic-ui-react';

import baseUrl from '../utils/baseUrl';
import axios from 'axios';
import cookie from 'js-cookie';

function User() {
  const [users, setUser] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const token = cookie.get('token');

        const res = await axios.get(`${baseUrl}/api/v1/user`, {
          headers: { Authorization: token },
        });

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
        ('Error Searching Users');
      }
    })();
  }, [users]);

  if (users) {
    return (
      <div>
        <Card.Group>
          {users.map((user) => (
            <Card>
              <Image src={user.image} wrapped ui={false} />
              <Card.Content>
                <Card.Header>{user.name}</Card.Header>
                <Card.Meta>{user.typeOfUser}</Card.Meta>
              </Card.Content>
              <Card.Content>
                <Grid>
                  <Grid.Row textAlign="left">
                    <Label>Email: {user.email}</Label>
                    <Label>RFID: {user.RFID}</Label>
                    <Label>P. NO: {user.phoneNumber}</Label>
                  </Grid.Row>
                </Grid>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </div>
    );
  } else {
    return <div>No User</div>;
  }
}

export default User;
