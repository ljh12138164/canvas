'use client';

import * as Babel from '@babel/standalone';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

interface EnhancedReactRendererProps {
  code: string;
  css?: string;
  dependencies?: Record<string, any>;
}

export const EnhancedReactRenderer: React.FC<EnhancedReactRendererProps> = ({
  code,
  css,
  dependencies = {},
}) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const defaultScope = {
      React,
      styled,
      useState: React.useState,
      useEffect: React.useEffect,
      useMemo: React.useMemo,
      useCallback: React.useCallback,
      ...dependencies,
    };

    try {
      // 添加样式
      if (css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        return () => style.remove();
      }

      // 转换代码
      const transformed = Babel.transform(code, {
        presets: ['react', 'typescript'],
        plugins: ['transform-modules-commonjs'],
      }).code;

      // 创建组件
      const func = new Function(
        ...Object.keys(defaultScope),
        `
          ${transformed}
          return typeof App !== 'undefined' ? App : null;
        `,
      );

      const Component = func(...Object.values(defaultScope));
      setComponent(() => Component);
      setError(null);
    } catch (err) {
      console.error('编译错误:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, [code, css, dependencies]);

  if (error) {
    return (
      <div className="error-boundary">
        <h3>编译错误</h3>
        <pre>{error.message}</pre>
      </div>
    );
  }

  if (!Component) {
    return <div>加载中...</div>;
  }

  return (
    <ErrorBoundary>
      <Component />
    </ErrorBoundary>
  );
};

// 错误边界组件
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="runtime-error">
          <h3>运行时错误</h3>
          <pre>{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
