'use client';
import React, { useEffect, useState } from 'react';
import { Codes, transformCode } from '../_lib';

const Page = () => {
  const result = transformCode(Codes);
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode>(null);

  useEffect(() => {
    try {
      // 修改：确保生成的是一个有效的React函数组件
      const DynamicComponent = (props: any) => {
        // 在这个作用域内，所有的React Hooks都可以正常使用
        // eslint-disable-next-line no-new-func
        const ComponentCreator = new Function(
          'React',
          'useState',
          'useEffect',
          'useRef',
          'useContext',
          'props',
          `
          return function DynamicInnerComponent(props) {
            ${result}
          }
          `,
        );

        return ComponentCreator(
          React,
          React.useState,
          React.useEffect,
          React.useRef,
          React.useContext,
          props,
        )(props);
      };
      //  设置渲染组件
      setRenderedComponent(<DynamicComponent />);
    } catch (error) {
      console.error('执行代码时出错:', error);
      setRenderedComponent(<div>执行代码时出错: {String(error)}</div>);
    }
  }, [result]);

  return (
    <div>
      <h2>转换后的代码:</h2>
      {/* <pre>{result}</pre> */}

      <h2>执行结果:</h2>
      <div>{renderedComponent}</div>
    </div>
  );
};

export default Page;
