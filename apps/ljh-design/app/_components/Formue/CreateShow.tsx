'use client';
import { useFormCreate } from '@/app/_hook/query/useFormue';
import useUsers from '@/app/_hook/useUser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateShow = () => {
  const router = useRouter();
  const { user, loading } = useUsers({ redirects: true });
  const { mutate: createForm, isPending } = useFormCreate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (loading) return <></>;
  if (!user) {
    router.push('/sign-in');
    return <></>;
  }

  const handleSubmit = () => {
    createForm(
      {
        json: {
          title,
          description,
          data: { form: { title, items: [] } },
        },
      },
      {
        onSuccess: () => {
          router.push('/board/formue');
        },
      },
    );
  };

  return (
    <div data-testid="create-show">
      <h2>创建新作品</h2>
      <div>
        <input placeholder="作品标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          placeholder="作品描述"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="button" onClick={handleSubmit} disabled={isPending}>
          创建
        </button>
      </div>
    </div>
  );
};

export default CreateShow;
