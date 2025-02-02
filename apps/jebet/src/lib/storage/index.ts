/**
 * 根据比特数转换为MB
 * @param size 比特数
 * @returns MB
 */
export function bitToMB(size: number): string {
  if (size > 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(2)}MB`;
  }
  if (size > 1024) {
    return `${(size / 1024).toFixed(2)}KB`;
  }
  return `${size}B`;
}

/**
 * ## 下载文件
 * @param file 文件路径
 * @param name 文件名
 */
export function downloadFile(file: string, name: string, type: string) {
  const a = document.createElement('a');
  a.href = file;
  a.download = `${name}.${type}`;
  a.click();
  a.remove();
}

/**
 * 检查文件是否是图片
 * @param type 文件类型
 * @returns 是否是图片
 */
export function checkIsImage(type: string): boolean {
  return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].includes(type);
}
