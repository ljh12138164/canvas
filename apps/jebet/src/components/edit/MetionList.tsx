import { nanoid } from 'nanoid';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export default forwardRef(function MetionList(props, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    // @ts-ignore
    const item = props.items[index] as string;

    if (item) {
      // @ts-ignore
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      // @ts-ignore
      (selectedIndex + props.items.length - 1) % props.items.length,
    );
  };

  const downHandler = () => {
    // @ts-ignore
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };
  // @ts-ignore
  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    // @ts-ignore
    onKeyDown: ({ event }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div className="dropdown-menu">
      {/* @ts-ignore */}
      {props.items.length ? (
        // @ts-ignore
        props.items.map((item, index) => (
          <button type="button" className={index === selectedIndex ? 'is-selected' : ''} key={nanoid()} onClick={() => selectItem(index)}>
            {item}
          </button>
        ))
      ) : (
        <div className="item">无结果</div>
      )}
    </div>
  );
});
