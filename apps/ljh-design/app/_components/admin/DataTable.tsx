'use client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table';
import { nanoid } from 'nanoid';

interface DataTableProps {
  data:
    | (
        | {
            id: string;
            name: string;
            userId: string;
            created_at: string;
            updated_at: string;
            history: {
              role: 'user' | 'model';
              imagePrompt?: string | undefined;
              parts: {
                text: string;
              }[];
              type: 'text' | 'image';
            }[];
          }
        | {
            id: string;
            name: string;
            created_at: string;
            updated_at?: string | undefined;
            json: string;
            height: number;
            image: string;
            url?: string | undefined;
            isTemplate?: boolean | undefined;
            width: number;
            userId: string;
          }
        | {
            showId: string;
            userId: string;
            created_at: string;
            updated_at?: string | undefined;
          }
        | {
            id: string;
            created_at: string;
            options: string;
            userId: string;
            name: string;
            clone: boolean;
          }
        | {
            id: string;
            title: string;
            userId: string;
            created_at: string;
            updated_at?: string | undefined;
            explanation: string;
            relativeTheme: string;
            tags: string;
            type: 'template' | 'material';
            relativeMaterial: string;
            clone: number;
          }
        | {
            id: string;
            name: string;
            image?: string | undefined;
            account: string;
            created_at: string;
          }
      )[]
    | undefined;
  columns: {
    key: string;
    label: string;
    render?: (value: any, record: Record<string, any>) => React.ReactNode;
  }[];
  caption?: string;
}

const DataTable = ({ data, columns, caption }: DataTableProps) => {
  const renderCell = (record: Record<string, any>, column: (typeof columns)[0]) => {
    if (column.render) {
      return column.render(record[column.key], record);
    }
    return record[column.key] || '-';
  };

  return (
    <div className="rounded-md border">
      <Table>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length && data?.length > 0 ? (
            data?.map((record, index) => (
              <TableRow key={nanoid()}>
                {columns.map((column) => (
                  <TableCell key={`${index}-${column.key}`}>{renderCell(record, column)}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-4">
                暂无数据
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
