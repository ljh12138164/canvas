import styled from 'styled-components';
import logo from '@/assets/image/logo.jpg';

interface ContainerProps {
  height?: number;
}
const Container = styled.div<ContainerProps>`
  width: 100%;
  height: ${({ height }) => height}px;
  cursor: pointer;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const Logo = ({ height = 50 }: ContainerProps) => {
  return (
    <Container height={height}>
      <Image src={logo} alt='logo' />
    </Container>
  );
};

export default Logo;
