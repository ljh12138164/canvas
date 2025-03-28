import Maps from './map';

const Watcher = ({
  startTime,
  endTime,
}: { startTime: Date | undefined; endTime: Date | undefined }) => {
  return <Maps startTime={startTime} endTime={endTime} />;
};

export default Watcher;
