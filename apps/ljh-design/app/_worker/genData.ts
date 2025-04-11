import dayjs from 'dayjs';
import type { DashboardListResponseType } from '../_hook/query/useAdmin';
/**
 * ## 生成数据
 * @param data 日期数组
 * @param userData 用户数据
 * @returns
 */
self.onmessage = (e: MessageEvent<{ data: string[]; userData: DashboardListResponseType }>) => {
  const { data, userData } = e.data;
  if (!userData || !userData) {
    self.postMessage({
      filterData: [],
      totalUser: 0,
      totalLike: 0,
      totalCollect: 0,
      totalDesign: 0,
      totalTemplate: 0,
      totalBoard: 0,
      totalMaterial: 0,
    });
    return;
  }
  const totalUser = userData.length;
  const totalLike = userData
    // @ts-ignore
    .map((item) => item.show.map((item) => item.upvotes.length).reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
  const totalCollect = userData
    // @ts-ignore
    .map((item) => item.show.map((item) => item.collections.length).reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
  const totalDesign = userData.map((item) => item.show.length).reduce((a, b) => a + b, 0);
  const totalTemplate = userData
    .map((item) => item.board.filter((item) => item.isTemplate).length)
    .reduce((a, b) => a + b, 0);
  const totalBoard = userData
    .map((item) => item.board.filter((item) => !item.isTemplate).length)
    .reduce((a, b) => a + b, 0);
  const totalMaterial = userData.map((item) => item.material.length).reduce((a, b) => a + b, 0);

  const filterData = data
    .map((Cooutedate) => {
      return userData.map((item) => {
        const show = item.show.filter(
          (show) => dayjs(show.created_at).format('YYYY-MM-DD') === Cooutedate,
        );
        const board = item.board.filter(
          (board) =>
            dayjs(board.created_at).format('YYYY-MM-DD') === Cooutedate && !board.isTemplate,
        );
        const templates = item.board.filter(
          (board) =>
            dayjs(board.created_at).format('YYYY-MM-DD') === Cooutedate && board.isTemplate,
        );

        const material = item.material.filter(
          (material) => dayjs(material.created_at).format('YYYY-MM-DD') === Cooutedate,
        );

        const upvotes = item.upvotes.filter(
          (upvote) => dayjs(upvote.created_at).format('YYYY-MM-DD') === Cooutedate,
        );

        const collections = item.collections.filter(
          (collection) => dayjs(collection.created_at).format('YYYY-MM-DD') === Cooutedate,
        );

        return {
          date: Cooutedate,
          templates: templates.length,
          material: material.length,
          board: board.length,
          upvotes: upvotes.length,
          collections: collections.length,
          show: show.length,
        };
      });
    })
    .reduce((acc, curr) => {
      const sum = curr.reduce(
        (acc, curr) => {
          return {
            date: curr.date,
            templates: acc.templates + curr.templates,
            material: acc.material + curr.material,
            board: acc.board + curr.board,
            upvotes: acc.upvotes + curr.upvotes,
            collections: acc.collections + curr.collections,
            show: acc.show + curr.show,
          };
        },
        {
          date: '',
          templates: 0,
          material: 0,
          board: 0,
          upvotes: 0,
          collections: 0,
          show: 0,
        },
      );
      return acc.concat(sum);
    }, []);
  self.postMessage({
    filterData,
    totalUser,
    totalLike,
    totalCollect,
    totalDesign,
    totalTemplate,
    totalBoard,
    totalMaterial,
  });
};
