import { useEffect, useState } from 'react';
// import { convertFileSrc } from '@tauri-apps/api/tauri';

function App() {
  const [isProduction, setIsProduction] = useState(false);

  useEffect(() => {
    // 检测是否为生产环境
    // 在开发环境中使用localhost，在生产环境中使用本地文件
    const isProd = process.env.NODE_ENV === 'production';
    setIsProduction(isProd);
  }, []);

  if (isProduction) {
    // 生产环境：加载本地静态文件
    return (
      <div className="tauri-container">
        <iframe
          src="index.html"
          style={{
            width: '100%',
            height: '100vh',
            border: 'none',
          }}
          title="Next.js Application"
        />
      </div>
    );
  }

  // 开发环境：加载开发服务器
  return (
    <div className="tauri-container">
      <iframe
        src="http://localhost:8400"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
        }}
        title="Next.js Application"
      />
    </div>
  );
}

export default App;
