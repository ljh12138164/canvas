// import { zValidator } from '@hono/zod-validator';
// import ExcelJS from 'exceljs';
// import { Hono } from 'hono';
// import { z } from 'zod';

// export const xlxs = new Hono().post(
//   '/gender',
//   zValidator(
//     'json',
//     z.object({
//       data: z.string().optional(),
//     }),
//   ),
//   async (c) => {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Sheet1');
//     worksheet.columns = [
//       { header: 'Name', key: 'name', width: 10 },
//       { header: 'Age', key: 'age', width: 10 },
//     ];
//     worksheet.addRows([
//       { name: 'John', age: 30 },
//       { name: 'Jane', age: 25 },
//     ]);
//     c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     c.header('Content-Disposition', 'attachment; filename=myExcelFile.xlsx');
//     await workbook.xlsx.writeFile('导出的文件');
//     return c.json({
//       data: workbook,
//     });
//   },
// );
