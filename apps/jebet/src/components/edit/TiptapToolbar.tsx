import { useCreateMessage, useGetMessage } from '@/server/hooks/chat';
import chatStore from '@/store/chat';
import { Message } from '@/types/chat';
import { Workspace } from '@/types/workspace';
import { useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tiptap/react';
import {
  BoldIcon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
} from 'lucide-react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { Button } from '../ui/button';
import TiptapButton from './TiptapButton';
interface TiptapToolbar {
  editor: Editor;
  userId: string;
  workspace: Workspace;
}
const SubmitButton = styled(Button)`
  border-radius: 0;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`;
const TiptapToolbar = observer(
  ({ editor, userId, workspace }: TiptapToolbar) => {
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
    const tiptapToolBar = [
      {
        key: 'bold',
        icon: <BoldIcon />,
        onClick: () => editor.chain().focus().toggleBold().run(),
        active: editor.isActive('bold'),
        disabled: true,
      },
      {
        key: 'italic',
        icon: <ItalicIcon />,
        onClick: () => editor.chain().focus().toggleItalic().run(),
        active: editor.isActive('italic'),
        disabled: true,
      },
      {
        key: 'underline',
        icon: <UnderlineIcon />,
        onClick: () => editor.chain().focus().toggleUnderline().run(),
        active: editor.isActive('underline'),
        disabled: true,
      },
      {
        key: 'strike',
        icon: <StrikethroughIcon />,
        onClick: () => editor.chain().focus().toggleStrike().run(),
        active: editor.isActive('strike'),
        disabled: true,
      },
      {
        key: 'list',
        icon: <ListIcon />,
        onClick: () => editor.chain().focus().toggleBulletList().run(),
        active: editor.isActive('list'),
        disabled: true,
      },
      {
        key: 'ordered-list',
        icon: <ListOrderedIcon />,
        onClick: () => editor.chain().focus().toggleOrderedList().run(),
        active: editor.isActive('ordered-list'),
        disabled: true,
      },
      {
        key: 'undo',
        icon: <UndoIcon />,
        onClick: () => editor.chain().focus().undo().run(),
        active: editor.isActive('undo'),
        disabled: editor.can().undo(),
      },
      {
        key: 'redo',
        icon: <RedoIcon />,
        onClick: () => editor.chain().focus().redo().run(),
        active: editor.isActive('redo'),
        disabled: editor.can().redo(),
      },
    ];
    return (
      <>
        {tiptapToolBar.map((item) => (
          <TiptapButton {...item} />
        ))}
        <SubmitButton
          variant='outline'
          className='rounded-none'
          disabled={messagePending || messageLoading}
          onClick={() => {
            createMessage(editor.getHTML(), {
              onSuccess: (data) => {
                console.log(data);
                if (chatStore.socket) {
                  chatStore.socket.emit('sendMessage', {
                    workspaceId: workspace.id,
                    message: editor.getHTML(),
                    userId: userId,
                    timestamp: new Date().getTime(),
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
                            {
                              content: data.message.message,
                              timestamp: new Date(
                                data.message.created_at
                              ).getTime(),
                              userId: data.message.userId,
                              workspaceId: data.message.workspaceId,
                              id: data.message.id,
                            },
                            ...oldData.pages[0].messages.data,
                          ],
                          count: oldData.pages[0].messages.count + 1,
                          page: oldData.pages[0].messages.page + 1,
                        },
                      },
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
