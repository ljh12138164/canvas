import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import styled from 'styled-components';
const LoadinContain = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const Loading = (
  <LoadinContain>
    <Loader2 className='animate-spin' size={32} />
  </LoadinContain>
);

export default function Suspensed({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={Loading}>{children}</Suspense>;
}
