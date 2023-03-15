import React, { useEffect } from 'react';
import { Container, Divider, Image, Item } from 'semantic-ui-react';
import Router from 'next/router';

function index({ user }) {
  useEffect(() => {
    document.title = `Welcome, ${user.name}`;
  });

  useEffect(() => {
    if (!user.typeOfUser) Router.push('signup-two');
  });

  return (
    <div>
      <Container>
        <Image src={user.image} size="small" circular />

        <Divider />

        <Item>
          <Item.Content>
            <Item.Header as="h2">{user.name}</Item.Header>
            <Item.Description>RFID: {user.RFID}</Item.Description>
            <Item.Description>Category: {user.typeOfUser}</Item.Description>
            <Item.Description>Phone No: {user.phoneNumber}</Item.Description>
          </Item.Content>
        </Item>
      </Container>
    </div>
  );
}

export default index;
