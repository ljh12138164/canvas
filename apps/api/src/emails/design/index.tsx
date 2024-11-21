import { Button, Html } from '@react-email/components';
interface EmailProps {
  url: string;
  firstName: string;
}

export function EmailTemplate(props: EmailProps) {
  const { url, firstName } = props;

  return (
    <Html lang='zh'>
      <Button href={url}>点击我 {firstName}</Button>
    </Html>
  );
}
