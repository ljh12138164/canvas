import {
  useCreateMessage,
  useGetMessage,
  useUploadImage,
} from '@/server/hooks/chat';
import chatStore from '@/store/chat';
import { Message } from '@/types/chat';
import { Workspace } from '@/types/workspace';
import { useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tiptap/react';
import { ImageIcon, Upload, X } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import EditorButton from '../command/EditorButton';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
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
const TiptapToolbarContainer = styled.div`
  display: flex;
  gap: 5px;
`;
const ImageButton = styled(Button)`
  width: 32px;
  height: 100%;
`;
const UploadContainer = styled.section`
  position: relative;
  display: flex;
  border: 1px solid var(--gray-3);
  border-radius: 4px;
  padding: 1rem;
  width: 50%;
  height: 14rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
`;
const PreviewImage = styled.img`
  width: 10rem;
  height: 10rem;
  object-fit: contain;
  border-radius: 4px;
`;
// const UplaodFooter = styled(DialogFooter)`
//   display: flex;
//   justify-content: flex-end;
// `;
// const CropperContainer = styled.div`
//   width: 12rem;
//   height: 12rem;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;
const TiptapToolbar = observer(
  ({ editor, userId, workspace, tiptapToolBar }: TiptapToolbar) => {
    // 裁剪图片
    // const [crop, setCrop] = useState<Crop>({
    //   unit: 'px',
    //   x: 0,
    //   y: 0,
    //   width: 100,
    //   height: 100,
    // });
    // const [open, setOpen] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);
    const queryClient = useQueryClient();
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const { messageLoading } = useGetMessage(
      workspace.id,
      userId,
      chatStore.isConnected
    );
    const { createMessage, messagePending } = useCreateMessage(
      workspace.id,
      userId
    );
    const { uploadImage, uploadImagePending } = useUploadImage(
      workspace.id,
      userId
    );
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) {
        toast.error('文件大小不能超过10M');
        return;
      }
      setFile(file);
      e.target.value = '';
    };
    return (
      <>
        <TiptapToolbarContainer>
          {tiptapToolBar.map((item) => (
            <TiptapButton
              title={item.title}
              key={item.key}
              onClick={item.onClick}
              icon={item.icon}
              active={item.active}
              disabled={item.disabled}
            />
          ))}
        </TiptapToolbarContainer>
        <Dialog>
          <DialogTrigger>
            <EditorButton title='插入图片'>
              <ImageButton variant='ghost'>
                <ImageIcon />
              </ImageButton>
            </EditorButton>
          </DialogTrigger>
          {/* 裁剪图片 */}
          <DialogContent className='w-full px-12 transition-all'>
            <DialogHeader>
              <DialogTitle>插入图片</DialogTitle>
            </DialogHeader>
            <section className='flex items-center justify-center w-full'>
              <UploadContainer onClick={() => fileRef.current?.click()}>
                {!file ? (
                  <p className='flex items-center gap-2'>
                    <Upload></Upload>
                    上传文件
                  </p>
                ) : (
                  <p className='flex items-center gap-2 h-full '>
                    {/* {open ? (
                      <CropperContainer onClick={(e) => e.stopPropagation()}>
                        <ReactCrop
                          className='w-[12rem] h-[12rem] overflow-hidden'
                          crop={crop}
                          onChange={(c) => {
                            setCrop(c);
                          }}
                        >
                          <PreviewImage
                            src={URL.createObjectURL(file)}
                            alt='用户上传的图片'
                            className='w-full h-full object-contain'
                          />
                        </ReactCrop>
                      </CropperContainer>
                    ) : ( */}
                    <PreviewImage
                      src={URL.createObjectURL(file)}
                      alt='用户上传的图片'
                      className='w-full h-full object-contain'
                    />
                    {/* )} */}
                  </p>
                )}
                {file && (
                  <div
                    className='absolute top-0 right-0 p-2 '
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    {/* {!open && ( */}
                    <X className='border rounded-full hover:bg-zinc-100 transition-all hover:dark:bg-zinc-800'></X>
                    {/* )} */}
                  </div>
                )}
              </UploadContainer>
              <input
                hidden
                type='file'
                ref={fileRef}
                onChange={handleFileChange}
                accept='image/*,application/pdf'
              />
            </section>
            {/* {file && (
              <UplaodFooter>
                {file.type.startsWith('image/') && (
                  <>
                    <Button variant='outline' onClick={() => setOpen(!open)}>
                      {open ? '取消裁剪' : '裁剪'}
                    </Button>
                    {open && (
                      <Button
                        variant='outline'
                        onClick={() => {
                          const canvas = document.createElement('canvas');
                          const ctx = canvas.getContext('2d');
                          canvas.width = crop.width;
                          canvas.height = crop.height;

                          const fileReader = new FileReader();
                          fileReader.readAsDataURL(file);
                          fileReader.onload = () => {
                            const image = new Image();
                            image.onload = () => {
                              ctx?.drawImage(
                                image,
                                crop.x + 1,
                                crop.y + 1,
                                crop.width - 2,
                                crop.height - 2,
                                0,
                                0,
                                crop.width,
                                crop.height
                              );
                              // 裁剪图片
                              canvas.toBlob((blob) => {
                                if (!blob) return;
                                setFile(
                                  new File([blob], `${file.name}.jpg`, {
                                    type: 'image/jpeg',
                                    lastModified: new Date().getTime(),
                                  })
                                );
                              }, 'image/jpeg');
                            };
                            image.src = fileReader.result as string;
                          };
                          setOpen(false);
                        }}
                      >
                        完成
                      </Button>
                    )}
                  </>
                )}
                <Button>发送</Button>
              </UplaodFooter>
            )} */}
            <DialogFooter>
              <div className='flex items-center gap-2'>
                <DialogClose asChild>
                  <Button hidden variant='outline' ref={closeRef}>
                    取消
                  </Button>
                </DialogClose>
                <Button
                  disabled={uploadImagePending}
                  onClick={() => {
                    if (uploadImagePending) return;
                    if (!file) return;
                    uploadImage(file, {
                      onSuccess: (data) => {
                        if (chatStore.socket) {
                          chatStore.socket.emit('sendMessage', {
                            id: data.message.id,
                            workspaceId: data.message.workspaceId,
                            message: data.message.message,
                            userId: data.message.userId,
                            type: data.message.type,
                            created_at: data.message.created_at,
                          });
                          // 设置数据
                          const oldData = queryClient.getQueryData([
                            workspace.id,
                          ]) as {
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
                                      message: data.message.message,
                                      timestamp: new Date(
                                        data.message.created_at
                                      ).getTime(),
                                      userId: data.message.userId,
                                      workspaceId: data.message.workspaceId,
                                      id: data.message.id,
                                      type: data.message.type,
                                    },
                                    ...oldData.pages[0].messages.data,
                                  ],
                                  count: oldData.pages[0].messages.count + 1,
                                  page: oldData.pages[0].messages.page + 1,
                                },
                              },
                              ...oldData.pages.slice(1),
                            ],
                          });
                          closeRef.current?.click();
                          setFile(null);
                          toast.success('发送成功');
                        }
                      },
                      onError: (error) => {
                        toast.error(error.message);
                      },
                    });
                  }}
                >
                  发送
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <SubmitButton
          variant='ghost'
          className={
            messagePending
              ? 'bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 border-l-2 border-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 h-7'
              : 'hover:bg-zinc-100  border-l-2 border-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-700 h-7'
          }
          disabled={messagePending || messageLoading}
          onClick={() => {
            if (messagePending || messageLoading) return;
            if (editor.getText().trim() === '') {
              toast.dismiss();
              toast.error('请输入内容');
              return;
            }
            createMessage(editor.getHTML(), {
              onSuccess: (data) => {
                if (chatStore.socket) {
                  chatStore.socket.emit('sendMessage', {
                    id: data.message.id,
                    workspaceId: data.message.workspaceId,
                    message: data.message.message,
                    userId: data.message.userId,
                    type: data.message.type,
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
                  // 更新数据
                  queryClient.setQueryData([workspace.id], {
                    pageParams: oldData.pageParams,
                    pages: [
                      {
                        messages: {
                          data: [
                            {
                              message: data.message.message,
                              timestamp: new Date(
                                data.message.created_at
                              ).getTime(),
                              userId: data.message.userId,
                              workspaceId: data.message.workspaceId,
                              id: data.message.id,
                              type: data.message.type,
                            },
                            ...oldData.pages[0].messages.data,
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
