import { supabase } from '@/app/_lib/supabase';
// useFormue.ts - 表单相关的钩子函数
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// 获取表单详情
export const useFormShow = (id?: string) => {
  return useQuery({
    queryKey: ['formue', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('formue')
        .select('*, user: profiles(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

// 添加评论
export const useFormComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ json }: { json: { id: string; content: string } }) => {
      const { error } = await supabase.from('comments').insert({
        form_id: json.id,
        content: json.content,
      });
      if (error) throw error;
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['formue', variables.json.id],
      });
      toast.success('评论已添加');
    },
    onError: (error) => {
      toast.error('添加评论失败');
      console.error(error);
    },
  });
};

// 创建表单
export const useFormCreate = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ json }: { json: any }) => {
      const { data, error } = await supabase.from('formue').insert(json).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['formues'] });
      toast.success('创建成功');
      router.push(`/board/formue/${data.id}`);
    },
    onError: (error) => {
      toast.error('创建失败');
      console.error(error);
    },
  });
};

// 编辑表单
export const useFormEdit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, json }: { id: string; json: any }) => {
      const { error } = await supabase.from('formue').update(json).eq('id', id);
      if (error) throw error;
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formue', variables.id] });
      toast.success('更新成功');
    },
    onError: (error) => {
      toast.error('更新失败');
      console.error(error);
    },
  });
};

// 发布表单
export const useFormPublish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from('formue').update({ status: 'published' }).eq('id', id);
      if (error) throw error;
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formue', variables.id] });
      toast.success('发布成功');
    },
    onError: (error) => {
      toast.error('发布失败');
      console.error(error);
    },
  });
};

// 复制表单
export const useFormCopy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // 获取原表单数据
      const { data: originalForm, error: fetchError } = await supabase
        .from('formue')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // 创建新表单（复制）
      const { data, error } = await supabase
        .from('formue')
        .insert({
          ...originalForm,
          id: undefined, // 让数据库生成新ID
          title: `${originalForm.title} (复制)`,
          status: 'draft',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formues'] });
      toast.success('复制成功');
    },
    onError: (error) => {
      toast.error('复制失败');
      console.error(error);
    },
  });
};

// 点赞表单
export const useFormUpvote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from('upvotes').insert({ form_id: id });
      if (error) throw error;
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formue', variables.id] });
      toast.success('点赞成功');
    },
    onError: (error) => {
      toast.error('点赞失败');
      console.error(error);
    },
  });
};

// 收藏表单
export const useFormCollect = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { error } = await supabase.from('collections').insert({ form_id: id });
      if (error) throw error;
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formue', variables.id] });
      toast.success('收藏成功');
    },
    onError: (error) => {
      toast.error('收藏失败');
      console.error(error);
    },
  });
};

// 导入所需的依赖
import { useRouter } from 'next/navigation';
