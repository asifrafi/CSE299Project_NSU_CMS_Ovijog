import React, { useEffect, useState } from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import axios from 'axios';
import cookie from 'js-cookie';
import baseUrl from '../utils/baseUrl';
import calculateTime from '../utils/calculateTime';
import CardComplainAgainst from '../components/Complain/CardComplainAgainstMe';

function complainAgainstMe({ user }) {
  const [complains, setComplains] = useState([]);

  useEffect(() => {
    (async () => {
      const token = cookie.get('token');

      try {
        const res = await axios.get(
          `${baseUrl}/api/v1/complain/complainAgainstMe`,
          {
            headers: { Authorization: token },
          }
        );
        //console.log(res.data);
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
            <CardComplainAgainst
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
    return <div>No Complain Against You</div>;
  }
}

export default complainAgainstMe;
