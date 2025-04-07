import { useEffect, useRef, useState } from 'react';

interface MermaidComponentProps {
  code: string;
  id?: string;
}

export default function MermaidComponent({ code, id = 'mermaid-diagram' }: MermaidComponentProps) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const mermaidInstanceRef = useRef<any>(null);

  useEffect(() => {
    // 只在组件首次挂载时加载mermaid
    if (!mermaidInstanceRef.current) {
      import(/* webpackChunkName: "mermaid" */ 'mermaid')
        .then((mermaidModule) => {
          const mermaid = mermaidModule.default;
          mermaid.initialize({
            startOnLoad: false,
            // 设置主题为中性，减少CSS体积
            theme: 'neutral',
            // 禁用不需要的图表类型以减小体积
            flowchart: { useMaxWidth: true },
            securityLevel: 'strict',
          });
          mermaidInstanceRef.current = mermaid;
          renderDiagram(mermaid);
        })
        .catch((error) => {
          console.error('加载Mermaid库失败:', error);
          setError('无法加载图表渲染库');
        });
    } else {
      // 如果已经加载过，直接使用缓存的实例
      renderDiagram(mermaidInstanceRef.current);
    }
  }, []);

  useEffect(() => {
    // 仅当code变化且mermaid已加载时重新渲染
    if (mermaidInstanceRef.current && code) {
      renderDiagram(mermaidInstanceRef.current);
    }
  }, [code]);

  const renderDiagram = async (mermaid: any) => {
    if (!code.trim()) {
      setSvg('');
      return;
    }

    try {
      const { svg } = await mermaid.render(id, code);
      setSvg(svg);
      setError('');
    } catch (error) {
      console.error('Mermaid渲染失败:', error);
      setError('图表语法错误，请检查您的代码');
    }
  };

  if (error) {
    return (
      <div className="p-4 text-sm text-destructive bg-destructive/10 rounded-md">
        <p className="font-medium">渲染错误</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-container flex items-center justify-center w-full h-full"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 使用mermaid渲染的SVG
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
