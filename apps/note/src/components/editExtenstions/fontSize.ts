import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (options: { size: string }) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}
export const FontSizeExtension = Extension.create({
  name: "fontSize",
  // 添加选项
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  // 添加全局属性
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            renderHTML: (attrs) => {
              return attrs.fontSize ? { fontSize: attrs.fontSize } : {};
            },
          },
        },
      },
    ];
  },
  // 添加命令
  addCommands() {
    return {
      setFontSize:
        ({ size }) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: size }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
