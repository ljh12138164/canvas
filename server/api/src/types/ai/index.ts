type ImageGenerationParams = {
  prompt: string; // 图片的文本提示
  negative_prompt?: string; // 省略的内容说明，默认为无
  number_of_images?: 1 | 2 | 3 | 4; // 图片数量，默认值为 4
  aspect_ratio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9'; // 宽高比，默认值为 '1:1'
  safety_filter_level?: 'block_low_and_above' | 'block_medium_and_above' | 'block_only_high'; // 安全性过滤级别
  person_generation?: 'dont_allow' | 'allow_adult'; // 人物生成选项
};
