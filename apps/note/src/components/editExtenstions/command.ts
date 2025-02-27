import { Extension, type Range } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import type { Editor } from '@tiptap/vue-3';

export default Extension.create({
  name: 'commandsPop',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: {
            command: ({
              editor,
              range,
            }: {
              editor: Editor;
              range: Range;
            }) => void;
          };
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
