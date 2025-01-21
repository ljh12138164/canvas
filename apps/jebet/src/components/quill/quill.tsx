import Quill, { type QuillOptions } from 'quill';
import { useEffect, useRef } from 'react';
import { PiTextAa } from 'react-icons/pi';
import styled from 'styled-components';
import './quill.css';
import { Button } from '../ui/button';

const EditContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const QuillEdit = () => {
  const containersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containersRef.current) return;
    const container = containersRef.current;
    const editorContainers = container.appendChild(container.ownerDocument.createElement('div'));
    const options: QuillOptions = {
      theme: 'snow',
    };
    new Quill(editorContainers, options);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, []);
  return (
    <EditContainer>
      <div ref={containersRef} className="ql-custom h-full" />
      <Button disabled={false} size="icon" variant="ghost" onClick={() => {}}>
        <PiTextAa size={24} />
      </Button>
    </EditContainer>
  );
};

export default QuillEdit;
