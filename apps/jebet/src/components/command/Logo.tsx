import { LOGO_URL } from '@/lib/echart';
import styled from 'styled-components';
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
      <Image src={LOGO_URL} alt="logo" height={height} width={height} />
    </Container>
  );
};

export default Logo;
