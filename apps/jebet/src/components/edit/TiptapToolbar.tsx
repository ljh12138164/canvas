import { useCreateMessage, useGetMessage } from '@/server/hooks/chat';
import chatStore from '@/store/chat';
import { Message } from '@/types/chat';
import { Workspace } from '@/types/workspace';
import { useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tiptap/react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Button } from '../ui/button';
import TiptapButton from './TiptapButton';

interface TiptapToolbar {
  editor: Editor;
  userId: string;
  workspace: Workspace;
  tiptapToolBar: {
    key: string;
    icon: React.ReactNode;
    title: string;
    onClick: () => void;
    active: boolean;
    disabled: boolean;
  }[];
}
const SubmitButton = styled(Button)`
  border-radius: 0;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;
const TiptapToolbar = observer(
  ({ editor, userId, workspace, tiptapToolBar }: TiptapToolbar) => {
    const queryClient = useQueryClient();
    const { messageLoading } = useGetMessage(
      workspace.id,
      userId,
      chatStore.isConnected
    );
    const { createMessage, messagePending } = useCreateMessage(
      workspace.id,
      userId
    );

    return (
      <>
        {tiptapToolBar.map((item) => (
          <TiptapButton {...item} />
        ))}
        <SubmitButton
          variant='ghost'
          className={
            messagePending
              ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 border-l-2 border-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 h-7'
              : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 border-l-2 border-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 h-7'
          }
          disabled={messagePending || messageLoading}
          onClick={() => {
            createMessage(editor.getHTML(), {
              onSuccess: (data) => {
                console.log(data);
                if (chatStore.socket) {
                  chatStore.socket.emit('sendMessage', {
                    id: data.message.id,
                    workspaceId: data.message.workspaceId,
                    message: data.message.message,
                    userId: data.message.userId,
                    created_at: data.message.created_at,
                  });
                  // 设置数据
                  const oldData = queryClient.getQueryData([workspace.id]) as {
                    pageParams: number[];
                    pages: {
                      messages: {
                        data: Message[];
                        count: number;
                        page: number;
                      };
                    }[];
                  };
                  queryClient.setQueryData([workspace.id], {
                    pageParams: oldData.pageParams,
                    pages: [
                      {
                        messages: {
                          data: [
                            ...oldData.pages[0].messages.data,
                            {
                              message: data.message.message,
                              timestamp: new Date(
                                data.message.created_at
                              ).getTime(),
                              userId: data.message.userId,
                              workspaceId: data.message.workspaceId,
                              id: data.message.id,
                            },
                          ],
                          count: oldData.pages[0].messages.count + 1,
                          page: oldData.pages[0].messages.page + 1,
                        },
                      },
                      ...oldData.pages.slice(1),
                    ],
                  });
                }
                editor.commands.clearContent();
              },
            });
          }}
        >
          发送
        </SubmitButton>
      </>
    );
  }
);

export default TiptapToolbar;
