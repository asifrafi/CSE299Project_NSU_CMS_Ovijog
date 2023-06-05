import React, { useEffect, useState } from 'react';
import { Card, Header } from 'semantic-ui-react';
import cookie from 'js-cookie';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import CardComplainResolved from '../components/Review/CardComplainResolved';

function ResolvedComplains({ user }) {
  const [complains, setComplains] = useState([]);

  useEffect(() => {
    (async () => {
      const token = cookie.get('token');

      let res;

      try {
        if (user.typeOfUser !== 'System-Admin') {
          res = await axios.get(
            `${baseUrl}/api/v1/review/myReviewComplainsClosed`,
            {
              headers: { Authorization: token },
            }
          );
        } else {
          res = await axios.get(
            `${baseUrl}/api/v1/complain/allResolvedComplains`,
            {
              headers: { Authorization: token },
            }
          );
        }

        setComplains(res.data.complains);
      } catch (error) {
        console.log(error);
        ('Error Searching Complains');
      }
    })();
  }, [complains]);

  if (complains) {
    return (
      <div>
        <Card.Group>
          {complains.map((complain) => (
            <CardComplainResolved
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
    return <Header>No Resolved Complains</Header>;
  }
}

export default ResolvedComplains;
