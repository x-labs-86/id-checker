import { fromObject } from "@nativescript/core";

export function onLoaded(args) {
  const page = args.object;

  const contextData = {
    ...args.context,
    onClose: function (args) {
      const button = args.object;
      console.log("contextData", button);
      button.closeBottomSheet({
        web: "kang-cahya.com",
      });
    },
  };
  const context = fromObject(contextData);
  page.bindingContext = context;
}
