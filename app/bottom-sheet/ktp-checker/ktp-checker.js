import { fromObject } from "@nativescript/core";
import { getRandomNumber } from "~/global_helper";

export function onLoaded(args) {
  const page = args.object;

  page.on("shownInBottomSheet", (args) => {
    console.log("shownInBottomSheet >>> ", args.context);
    console.log("shownInBottomSheet", args.context.nik);
    setupContext(args.context);

    // override bottom-sheet plugin context reset after opening
    // https://github.com/nativescript-community/ui-material-components/blob/577b92c21b4e67e906787d518373bd967bc21dee/src/bottomsheet/bottomsheet.ios.ts#L455
    page.bindingContext = bindingContext;
  });
  // page.bindingContext = new KtpCheckerModel();
}

let bindingContext;
function setupContext(openContext) {
  bindingContext = fromObject({
    ...openContext,
    loading: false,
    toggleLoading() {
      bindingContext.loading = !bindingContext.loading;
      this.set("loading", bindingContext.loading);
      console.log("loading >> ", this.get("loading"));
    },

    onSubmit(args) {
      const button = args.object;

      bindingContext.toggleLoading();

      setTimeout(() => {
        bindingContext.toggleLoading();

        const newData = { action: "submit", ...button.bindingContext };
        button.closeBottomSheet(newData);
      }, getRandomNumber(1000, 3500));

      console.log("onSubmit bro...");
    },

    onClose(args) {
      const button = args.object;

      const newData = { action: "close", ...button.bindingContext };
      button.closeBottomSheet(newData);
    },
  });
}
