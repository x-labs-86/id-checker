import { fromObject } from "@nativescript/core";

export function onLoaded(args) {
  const page = args.object;

  const contextData = {
    ...args.context,
    onClose: function (args) {
      const button = args.object;
      button.closeBottomSheet({});
    },
  };
  const context = fromObject(contextData);
  page.bindingContext = context;
}
