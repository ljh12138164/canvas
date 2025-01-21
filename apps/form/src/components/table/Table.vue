<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { valueUpdater } from '@/lib/index';
import { cn } from '@/lib/utils';
import type { Form } from '@/types';
import type {
  ColumnFiltersState,
  ExpandedState,
  // RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table';
import { FlexRender, createColumnHelper, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table';
import dayjs from 'dayjs';
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { h, ref } from 'vue';
import TooltipComponent from '../common/TooltipComponent.vue';
import DropdownAction from './DropdownAction.vue';
// import DropdownAction from './DropdownAction.vue'

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

const props = defineProps<{
  data: Form[];
}>();

const columnHelper = createColumnHelper<Form>();

// 表单的显示
const columns = [
  columnHelper.accessor('name', {
    enablePinning: true,
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          class: 'flex items-center max-w-40',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['名称', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      );
    },
    cell: ({ row }) =>
      h(TooltipComponent, {
        content: row.getValue('name') as string,
        class: 'capitalize',
      }),
  }),
  columnHelper.accessor('description', {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          class: 'flex items-center max-w-40',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['描述', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      );
    },
    cell: ({ row }) => {
      const description = (row.getValue('description') || '---') as string;
      return h(
        'div',
        {
          class: ' max-w-40 truncate whitespace-nowrap overflow-hidden text-ellipsis',
        },
        h(TooltipComponent, { content: description }),
      );
    },
  }),
  columnHelper.accessor('update_at', {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          class: 'flex items-center ml-auto max-w-40',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['更新时间', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      );
    },
    cell: ({ row }) => {
      const formatted = dayjs(row.getValue('update_at')).format('YYYY-MM-DD HH:mm:ss');
      return h('div', { class: 'text-right' }, h(TooltipComponent, { content: formatted }));
    },
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'ghost',
          class: 'flex items-center ml-auto max-w-40',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => ['创建时间', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })],
      );
    },
    cell: ({ row }) => {
      const formatted = dayjs(row.getValue('created_at')).format('YYYY-MM-DD HH:mm:ss');
      return h('div', { class: 'text-right' }, h(TooltipComponent, { content: formatted }));
    },
  }),
  columnHelper.display({
    id: 'actions',
    enableHiding: false,
    header: () => h('div', { class: 'text-right' }, '操作'),
    cell: ({ row }) => {
      const payment = row.original;
      return h(
        'div',
        { class: 'relative', variant: 'ghost' },
        h(DropdownAction, {
          payment,
        }),
      );
    },
  }),
];

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

const table = useVueTable({
  data: props.data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: (updaterOrValue) => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: (updaterOrValue) => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
    get expanded() {
      return expanded.value;
    },
    columnPinning: {
      left: ['status'],
    },
  },
});
const keyof = {
  name: '名称',
  description: '描述',
  update_at: '更新时间',
  created_at: '创建时间',
};
</script>

<template>
  <div class="w-full">
    <div class="flex gap-2 items-center py-4">
      <Input
        class="max-w-sm"
        placeholder="搜索名字"
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)"
      />
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            过滤 <ChevronDown class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table
              .getAllColumns()
              .filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :checked="column.getIsVisible()"
            @update:checked="
              (value) => {
                column.toggleVisibility(!!value);
              }
            "
          >
            {{ keyof[column.id as keyof typeof keyof] }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div class="rounded-md border">
      <!-- @vue-ignore -->
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              :data-pinned="header.column.getIsPinned()"
              :class="
                cn(
                  { 'sticky bg-background/95': header.column.getIsPinned() },
                  header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0'
                )
              "
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell
                  v-for="cell in row.getVisibleCells()"
                  :key="cell.id"
                  :data-pinned="cell.column.getIsPinned()"
                  :class="
                    cn(
                      { 'sticky bg-background/95': cell.column.getIsPinned() },
                      cell.column.getIsPinned() === 'left'
                        ? 'left-0'
                        : 'right-0'
                    )
                  "
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ row.original }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              暂无数据
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  </div>
</template>
