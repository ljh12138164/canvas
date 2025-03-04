import { to } from 'await-to-js';
import React, { useEffect, useMemo, useState } from 'react';
import { transformCode } from '../_lib';

export const useTranform = (customComponents: Record<string, any>, code: string) => {
  const customComponentsName = useMemo(() => Object.keys(customComponents), [customComponents]);
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode>(null);

  useEffect(() => {
    (async () => {
      try {
        const [err, result] = await to(transformCode(code, customComponentsName));
        if (err) throw err;
        const DynamicComponent = (props: any) => {
          const ComponentCreator = new Function(
            'React',
            'customComponents',
            'props',
            result?.componentName
              ? `
             "use strict";
              const {${Object.keys(React).join(', ')}} = React;
              const {${Object.keys(customComponents).join(', ')}} = customComponents;
              ${result.code}
              return ${result.componentName};
            `
              : `
              return function DynamicInnerComponent(props) {
                const {${Object.keys(React).join(', ')}} = React;
                const {${Object.keys(customComponents).join(', ')}} = customComponents;
                ${result.code}
              }
            `,
          );
          return ComponentCreator(React, customComponents, props)(props);
        };
        setRenderedComponent(<DynamicComponent />);
      } catch (error) {
        console.error('执行代码时出错:', error);
        setRenderedComponent(<div>执行代码时出错:</div>);
      }
    })();
  }, [code]);
  return renderedComponent;
};
