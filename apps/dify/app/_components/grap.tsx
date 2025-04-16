'use client';

import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import mermaid from 'mermaid';
import { useEffect, useState } from 'react';

export default function Grap() {
  const [code, setCode] = useState(
    'graph TD\n    A[Client] --> B[Load Balancer]\n    B --> C[Server01]\n    B --> D[Server02]',
  );
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  // 加载图表初始化
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        background: '#FFFFFF',
        primaryColor: '#000000',
        primaryBorderColor: '#000000',
        primaryTextColor: '#000000',
        secondaryColor: '#FFFFFF',
        secondaryBorderColor: '#000000',
        secondaryTextColor: '#000000',
        tertiaryColor: '#FFFFFF',
        tertiaryBorderColor: '#000000',
        tertiaryTextColor: '#000000',
        noteBkgColor: '#FFFFFF',
        noteBorderColor: '#000000',
        noteTextColor: '#000000',
        nodeBkg: '#FFFFFF',
        nodeBorder: '#000000',
        nodeTextColor: '#000000',
        mainBkg: '#FFFFFF',
        lineColor: '#000000',
        textColor: '#000000',
        labelColor: '#000000',
        edgeLabelBackground: '#FFFFFF',
        clusterBkg: '#FFFFFF',
        clusterBorder: '#000000',
        titleColor: '#000000',
        arrowheadColor: '#000000',
        relationLabelColor: '#000000',
        nodeBorderWidth: '1px',
        fontFamily: 'arial',
        fontSize: '18px',
      },
      er: {
        diagramPadding: 20,
        layoutDirection: 'TB',
        minEntityWidth: 100,
        minEntityHeight: 75,
        entityPadding: 15,
        stroke: '#000000',
        fill: '#FFFFFF',
        fontSize: 18,
      },
    });
    updateDiagram();
  }, []);

  const updateDiagram = async (codes?: string) => {
    try {
      const abc = await mermaid.render('mermaid-diagram', codes ?? code);
      setSvg(abc.svg);
      setError('');
    } catch (error) {
      console.error('渲染失败:', error);
      setError('图表语法错误，请检查您的代码');
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    updateDiagram(newCode);
  };

  // 导出SVG
  const handleExportSvg = () => {
    const svgData = encodeURIComponent(svg);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'mermaid-diagram.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col">
        <textarea
          value={code}
          onChange={handleCodeChange}
          className="w-full h-40 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg font-mono text-sm bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none mb-4"
          placeholder="输入Mermaid语法..."
          spellCheck="false"
        />
        {error && <div className="text-red-500 mt-2 mb-4">{error}</div>}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all hover:shadow-xl sticky top-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base">生成的图表</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportSvg}>
                导出SVG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const element = document.querySelector('.mermaid-output');
                  if (element) {
                    const scale = 2; // 增加分辨率
                    html2canvas(element as HTMLElement, {
                      scale: scale, // 使用2倍缩放来提高分辨率
                      backgroundColor: '#FFFFFF', // 确保背景为白色
                      logging: false,
                      useCORS: true, // 允许跨域
                      allowTaint: true, // 允许污染
                      imageTimeout: 0, // 不超时
                    }).then((canvas) => {
                      const link = document.createElement('a');
                      link.download = 'mermaid-diagram.png';
                      link.href = canvas.toDataURL('image/png', 1.0); // 使用最高质量
                      link.click();
                    });
                  }
                }}
              >
                导出PNG
              </Button>
            </div>
          </div>
          <div
            className="mermaid-output flex items-center justify-center min-h-[400px]"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>
    </div>
  );
}
