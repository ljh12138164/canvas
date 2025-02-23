'use client';

import { EnhancedReactRenderer } from '@/app/_components/Proview';

// 示例代码
const exampleCode = `
const Container = styled.div\`
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
\`;

function App() {
  const [value, setValue] = useState('');
  
  return (
    <Container>
      <h1>增强版渲染器</h1>
      <Input 
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="请输入内容"
      />
      <Button type="primary" className="mt-4">
        提交
      </Button>
    </Container>
  );
}
`;

const exampleCss = `
  .mt-4 { margin-top: 1rem; }
`;

export default function PreviewPage() {
  return (
    <div className="container mx-auto p-4">
      <EnhancedReactRenderer
        code={exampleCode}
        css={exampleCss}
        dependencies={
          {
            // 添加额外的依赖
          }
        }
      />
    </div>
  );
}
