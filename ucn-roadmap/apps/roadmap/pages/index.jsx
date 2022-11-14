import styled from 'styled-components';
import { useState } from 'react';

const Container = styled.div`
  background-color: ${(props) => props.BgColor};
`;

const Index = () => {
  const [bgColor, setBgColor] = useState('red');

  const setColor = () => {
    setBgColor('green');
  };

  return (
    <Container BgColor={bgColor}>
      Hello
      <button onClick={() => setColor()}>Click me</button>
    </Container>
  );
};

export default Index;
