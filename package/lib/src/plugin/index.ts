import { parse } from 'node-html-parser';
import type { PluginOption } from 'vite';
import type { AnalyzePreloadResourcesOption } from './type';
// import type { AnalyzePreloadResourcesOption } from './type';

interface PreloadResource {
  url: string;
  type: 'style' | 'script' | 'font' | 'image';
  priority?: 'high' | 'low';
}

/**
 * ### 分析预加载资源
 * @param html
 * @returns
 */
function analyzePreloadResources(html: string): PreloadResource[] {
  const resources: PreloadResource[] = [];

  // 解析 HTML 字符串
  // const parser = new DOMParser();
  // const doc = parser.parseFromString(html, 'text/html');
  const root = parse(html);
  // 分析 CSS 文件
  const styleLinks = root.querySelectorAll('link[rel="stylesheet"]');
  styleLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      resources.push({
        url: href,
        type: 'style',
        priority: 'high', // CSS 通常是高优先级
      });
    }
  });

  // 分析 JavaScript 文件
  const scripts = root.querySelectorAll('script[src]');
  scripts.forEach((script) => {
    const src = script.getAttribute('src');
    if (src) {
      resources.push({
        url: src,
        type: 'script',
        priority: script.hasAttribute('async') ? 'low' : 'high',
      });
    }
  });

  // 分析字体文件
  const fontLinks = root.querySelectorAll('link[rel="preload"][as="font"]');
  fontLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      resources.push({
        url: href,
        type: 'font',
        priority: 'high',
      });
    }
  });

  // 分析关键图片
  const images = root.querySelectorAll('img[loading="eager"]');
  images.forEach((img) => {
    const src = img.getAttribute('src');
    if (src) {
      resources.push({
        url: src,
        type: 'image',
        priority: 'high',
      });
    }
  });

  // 分析分包配置
  // const moduleProload = root.querySelectorAll('link[rel=modulepreload]');
  // moduleProload.forEach((module) => {
  //   const href = module.getAttribute('href');
  //   if (href) {
  //     resources.push({
  //       url: href,
  //       type: 'script',
  //       priority: module.hasAttribute('async') ? 'low' : 'high',
  //     });
  //   }
  // });

  return resources;
}

function preloadAnalyzerPlugin(options: AnalyzePreloadResourcesOption): PluginOption {
  return {
    name: 'preload-analyzer',
    enforce: 'post',
    transformIndexHtml: {
      enforce: 'post', // transformIndexHtml 钩子也需要在后置阶段执行
      transform(html) {
        // 分析并收集需要预加载的资源
        const preloadResources = analyzePreloadResources(html);

        // 检查URL是否匹配异步加载的chunks
        const isAsyncChunk = (url: string) => {
          return options?.async?.some((chunk) => url.includes(chunk)) ?? false;
        };
        // 删除分包的应用、
        return {
          html,
          tags: preloadResources.map((resource) => ({
            tag: 'link',
            attrs: {
              rel: 'preload',
              href: resource.url,
              as: resource.type,
              priority: resource.priority,
              ...(isAsyncChunk(resource.url) ? { async: '' } : {}),
              crossorigin: resource.type === 'script' || resource.type === 'style' ? '' : undefined,
            },
            injectTo: 'head',
          })),
        };
      },
    },
  };
}

export { preloadAnalyzerPlugin };
