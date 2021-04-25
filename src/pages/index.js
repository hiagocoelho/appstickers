import Head from 'next/head';
import styled from 'styled-components';

import { Form } from '../components/Form';

const Container = styled.div`
  /* background-color: #303030; */
  background-image: linear-gradient(#312244, #272640);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export default function Home() {
  return (
    <Container>
      <Head>
        <title>App Stickers</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <Form />
    </Container>
  )
}
