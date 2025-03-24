import type { GetAnswerResponseType } from '@/app/_hook/query/useAnswer';
import { useUser } from '@/app/_store/auth';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import AvatarImage from '../AvatarImage';
interface RenderProps {
  answer: GetAnswerResponseType[number];
}

export default function Render({ answer }: RenderProps) {
  const { user } = useUser();
  const showQuillRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!showQuillRef.current) return;
    const container = showQuillRef.current;
    container.innerHTML = answer.answer;
    return () => {
      container.innerHTML = '';
    };
  }, [answer.answer]);

  return (
    <div className="flex flex-col  p-4 bg-white rounded-lg shadow-xs border border-gray-200">
      {/* 评论者信息 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <AvatarImage
            userInfo={answer.profiles!}
            src={answer.profiles?.image || ''}
            alt="用户头像"
            width={30}
            height={30}
            priority
          />
        </div>
        <div>
          <div className="font-medium text-gray-900">
            {answer.profiles?.name || '用户'}{' '}
            {user?.user.user_metadata.name === answer.profiles?.name && '（你）'}
          </div>
          <div className="text-sm text-gray-500">
            {dayjs(answer.created_at).format('YYYY年MM月DD日 HH:mm:ss')}
          </div>
        </div>
      </div>

      {/* 评论内容 */}
      <div className="mt-2 text-gray-700">
        <div ref={showQuillRef} className="prose max-w-none" />
      </div>
      {/* <Separator className="my-2" /> */}
    </div>
  );
}
