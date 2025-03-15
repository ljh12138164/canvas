import { parse } from 'node-html-parser';
import type { PluginOption } from 'vite';
// import type { AnalyzePreloadResourcesOption } from './type';
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
function analyzePreloadResources(html: string): (PreloadResource & { headType?: string })[] {
  const resources: (PreloadResource & {
    headType?: 'link' | 'script' | 'font' | 'image' | 'vendor';
  })[] = [];

  // 解析 HTML 字符串
  const root = parse(html);
  // 分析 CSS 文件
  const styleLinks = root.querySelectorAll('link[rel="stylesheet"]');
  styleLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href) {
      resources.push({
        url: href,
        type: 'style',
        headType: 'link',
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
        headType: 'script',
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
        headType: 'font',
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
        headType: 'image',
      });
    }
  });

  // 分析分包配置
  const moduleProload = root.querySelectorAll('link[rel=modulepreload]');
  moduleProload.forEach((module) => {
    const href = module.getAttribute('href');
    if (href) {
      resources.push({
        url: href,
        type: 'script',
        headType: 'vendor',
      });
    }
  });

  return resources;
}

function preloadAnalyzerPlugin(): PluginOption {
  return {
    name: 'preload-analyzer',
    enforce: 'post',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        // 分析并收集需要预加载的资源
        const preloadResources = analyzePreloadResources(html);
        // 使用 node-html-parser 处理 HTML
        const root = parse(html);
        // rel="modulepreload"
        const modulepreloads = root.querySelectorAll('link[rel="modulepreload"]');
        modulepreloads.forEach((link) => link.remove());
        const newhtml = root.toString();
        return {
          html: newhtml,
          tags: preloadResources.map((resource) => ({
            tag: resource?.headType === 'vendor' ? 'script' : 'link',
            attrs: {
              rel: 'preload',
              href: resource.url,
              as: resource.type,
              async: resource?.headType === 'vendor',
            },
            injectTo: 'head',
          })),
        };
      },
    },
  };
}

export { preloadAnalyzerPlugin };
