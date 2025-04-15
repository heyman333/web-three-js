import React from "react";
import styled from "styled-components";
import { MainScene } from "./components/MainScene";

function App() {
  return (
    <Wrapper>
      <MainScene />
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.main`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;
