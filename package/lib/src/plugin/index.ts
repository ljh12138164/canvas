import { parse } from 'node-html-parser';
import type { PluginOption } from 'vite';

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

  return resources;
}

function preloadAnalyzerPlugin(): PluginOption {
  return {
    name: 'preload-analyzer',
    transformIndexHtml(html) {
      // 分析并收集需要预加载的资源
      const preloadResources = analyzePreloadResources(html);

      return {
        html,
        tags: preloadResources.map((resource) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: resource.url,
            as: resource.type,
          },
          injectTo: 'head',
        })),
      };
    },
  };
}

export { preloadAnalyzerPlugin };
