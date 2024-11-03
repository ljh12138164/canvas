import styled from "styled-components";

interface ContainerProps {
  width?: number;
  height?: number;
}
const Container = styled.div<ContainerProps>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
`;
const Logo = ({ width = 100, height = 100 }: ContainerProps) => {
  return (
    <Container width={width} height={height}>
      <Image src="/logo.png" alt="logo" />
    </Container>
  );
};

export default Logo;
