import { fromObject } from "@nativescript/core";

export function onLoaded(args) {
  const page = args.object;
  var context = fromObject({
    loading: false,
    onSubmit: function (args) {
      const button = args.object;

      context.set("loading", true);

      setTimeout(() => {
        context.set("loading", false);
        console.log("loading 2 >> ", context.get("loading"));

        const newData = { action: "submit", ...button.bindingContext };
        button.closeBottomSheet(newData);
      }, 1000);

      console.log("onSubmit bro...");

      console.log("loading >> ", context.get("loading"));
    },
    onClose: function (args) {
      const button = args.object;

      const newData = { action: "close", ...button.bindingContext };
      button.closeBottomSheet(newData);
    },
  });
  page.bindingContext = context;
}

/* export function onLoaded(args) {
  const page = args.object;
  context = fromObject({
    loading: false,
  });
  page.bindingContext = context;
}

export function onSubmit(args) {
  const button = args.object;

  context.set("loading", true);

  setTimeout(() => {
    context.set("loading", false);
  }, 3000);

  console.log("onSubmit bro...");
  const newData = { action: "submit", ...button.bindingContext };
  button.closeBottomSheet(newData);
}

export function onClose(args) {
  const button = args.object;

  const newData = { action: "close", ...button.bindingContext };
  button.closeBottomSheet(newData);
}
 */
