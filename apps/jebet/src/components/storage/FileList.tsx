import { X } from 'lucide-react';
import {
  AiOutlineFile,
  AiOutlineFileGif,
  AiOutlineFileImage,
  AiOutlineFileMarkdown,
} from 'react-icons/ai';
import { LuFileAudio, LuFileJson, LuFileVideo } from 'react-icons/lu';
import {
  TbFileTypeBmp,
  TbFileTypeCss,
  TbFileTypeCsv,
  TbFileTypeDoc,
  TbFileTypeDocx,
  TbFileTypeHtml,
  TbFileTypeJpg,
  TbFileTypeJs,
  TbFileTypeJsx,
  TbFileTypePdf,
  TbFileTypePhp,
  TbFileTypePng,
  TbFileTypePpt,
  TbFileTypeRs,
  TbFileTypeSql,
  TbFileTypeSvg,
  TbFileTypeTs,
  TbFileTypeTsx,
  TbFileTypeTxt,
  TbFileTypeVue,
  TbFileTypeXls,
  TbFileTypeXml,
  TbFileTypeZip,
} from 'react-icons/tb';
import styled from 'styled-components';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { bitToMB } from '@/lib/storage';

const FileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 60px;
  border: 1px solid #e2e8f0;
`;
const CloseFile = styled.button`
  position: absolute;
  top: 0;
  right: 0;
`;
const IconContainer = styled.span`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
export const FileIcons = (fileType: string, size: number = 10) => {
  if (fileType === 'jpg' || fileType === 'png')
    return <TbFileTypePng className={`h-${size} w-${size}`} />;
  if (fileType === 'mp3')
    return <LuFileAudio className={`h-${size} w-${size}`} />;
  if (fileType === 'wav')
    return <LuFileAudio className={`h-${size} w-${size}`} />;
  if (fileType === 'ogg')
    return <LuFileAudio className={`h-${size} w-${size}`} />;
  if (fileType === 'mp4')
    return <LuFileVideo className={`h-${size} w-${size}`} />;
  if (fileType === 'jpeg')
    return <TbFileTypeJpg className={`h-${size} w-${size}`} />;
  if (fileType === 'gif')
    return <AiOutlineFileGif className={`h-${size} w-${size}`} />;
  if (fileType === 'pdf')
    return <TbFileTypePdf className={`h-${size} w-${size}`} />;
  if (fileType === 'json')
    return <LuFileJson className={`h-${size} w-${size}`} />;
  if (fileType === 'js')
    return <TbFileTypeJs className={`h-${size} w-${size}`} />;
  if (fileType === 'ts')
    return <TbFileTypeTs className={`h-${size} w-${size}`} />;
  if (fileType === 'tsx')
    return <TbFileTypeTsx className={`h-${size} w-${size}`} />;
  if (fileType === 'jsx')
    return <TbFileTypeJsx className={`h-${size} w-${size}`} />;
  if (fileType === 'css')
    return <TbFileTypeCss className={`h-${size} w-${size}`} />;
  if (fileType === 'html')
    return <TbFileTypeHtml className={`h-${size} w-${size}`} />;
  if (fileType === 'txt')
    return <TbFileTypeTxt className={`h-${size} w-${size}`} />;
  if (fileType === 'md')
    return <AiOutlineFileMarkdown className={`h-${size} w-${size}`} />;
  if (fileType === 'zip')
    return <TbFileTypeZip className={`h-${size} w-${size}`} />;
  if (fileType === 'doc')
    return <TbFileTypeDoc className={`h-${size} w-${size}`} />;
  if (fileType === 'docx')
    return <TbFileTypeDocx className={`h-${size} w-${size}`} />;
  if (fileType === 'ppt')
    return <TbFileTypePpt className={`h-${size} w-${size}`} />;
  if (fileType === 'pptx')
    return <TbFileTypePpt className={`h-${size} w-${size}`} />;
  if (fileType === 'xls')
    return <TbFileTypeXls className={`h-${size} w-${size}`} />;
  if (fileType === 'xlsx')
    return <TbFileTypeXls className={`h-${size} w-${size}`} />;
  if (fileType === 'csv')
    return <TbFileTypeCsv className={`h-${size} w-${size}`} />;
  if (fileType === 'xml')
    return <TbFileTypeXml className={`h-${size} w-${size}`} />;
  if (fileType === 'json')
    return <LuFileJson className={`h-${size} w-${size}`} />;
  if (fileType === 'vue')
    return <TbFileTypeVue className={`h-${size} w-${size}`} />;
  if (fileType === 'rs')
    return <TbFileTypeRs className={`h-${size} w-${size}`} />;
  if (fileType === 'php')
    return <TbFileTypePhp className={`h-${size} w-${size}`} />;
  if (fileType === 'bmp')
    return <TbFileTypeBmp className={`h-${size} w-${size}`} />;
  if (fileType === 'svg')
    return <TbFileTypeSvg className={`h-${size} w-${size}`} />;
  if (fileType === 'sql')
    return <TbFileTypeSql className={`h-${size} w-${size}`} />;
  return <AiOutlineFile className={`h-${size} w-${size}`} />;
};

const fileTypeIcon = (file: File) => {
  const fileType = file.name.split('.').pop();
  const fileTypes = file.type.split('/')[0];
  const icons = FileIcons(fileType || '');
  switch (fileTypes) {
    case 'image':
      if (fileType === 'jpg' || fileType === 'png')
        return <TbFileTypePng className='h-10 w-10' />;
      if (fileType === 'jpeg') return <TbFileTypeJpg className='h-10 w-10' />;
      if (fileType === 'gif') return <AiOutlineFileGif className='h-10 w-10' />;
      return <AiOutlineFileImage className='h-10 w-10' />;
    case 'video':
      return <LuFileVideo className='h-10 w-10' />;
    case 'audio':
      if (fileType === 'mp3') return <LuFileAudio className='h-10 w-10' />;
      if (fileType === 'wav') return <LuFileAudio className='h-10 w-10' />;
      if (fileType === 'ogg') return <LuFileAudio className='h-10 w-10' />;
      if (fileType === 'mp4') return <LuFileVideo className='h-10 w-10' />;
      return <LuFileAudio className='h-10 w-10' />;
    case 'application':
      return icons;
    case 'text':
      return icons;
    default:
      return icons;
  }
};

const Filelist = ({
  file,
  setFile,
}: {
  file: File | null;
  setFile?: (file: File | null) => void;
}) => {
  if (!file) return null;
  const sizeStr = bitToMB(file.size);
  return (
    <FileContainer>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className='grid grid-cols-[50px_1fr_50px] items-center justify-center  w-full gap-2'>
              <IconContainer className='w-20 '>
                {fileTypeIcon(file)}
              </IconContainer>
              <span className='text-sm flex-1'>{file?.name}</span>
              <span className='text-sm w-5'>{sizeStr}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            {file.type.startsWith('image') && (
              <img src={URL.createObjectURL(file)} alt={file?.name} />
            )}
            {file.type.startsWith('video') && (
              <video src={URL.createObjectURL(file)} />
            )}
            {file.type.startsWith('audio') && (
              <audio src={URL.createObjectURL(file)} />
            )}
            {file.type.startsWith('application') && <p>{file?.name}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {setFile && (
        <CloseFile onClick={() => setFile(null)}>
          <X />
        </CloseFile>
      )}
    </FileContainer>
  );
};

export default Filelist;
