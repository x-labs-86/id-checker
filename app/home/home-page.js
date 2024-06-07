import { GlobalModel } from "~/global_model";
import { fontAwesomeParser, internet } from "~/global_helper";
import { parseNik } from "~/libs/parsenik";

import { module_caller } from "~/module_caller";

var model = GlobalModel([]);
var context, framePage;

export function onLoaded(args) {
  framePage = args.object.frame;
}

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  context.set("nik", "3471140209790001");
  context.set("isConnected", internet().connected);

  page.bindingContext = context;
}

export function checkNow(args) {
  const page = args.object.page;
  let dataNik = parseNik(parseInt(context.nik));

  page.showBottomSheet({
    view: "~/bottom-sheet/ktp-checker/ktp-checker",
    context: {
      nik: context.nik,
      ...dataNik,
    },
    closeCallback: (args) => {
      // if (args.action == "submit") {
      //   let x = parseNik(parseInt(args.nik));
      //   console.log("x >>> ", x);
      // }
      context.set("nik", "");
      console.log("Close Callback", args);
      // console.log("Close Callback action", args.action);
      // console.log("Bottom Sheet closed");
    },
  });
}

export function showBottomSheet(args) {
  const page = args.object.page;
  const modalViewModulets = "~/bottom-sheet/bottom-sheet";
  page.showBottomSheet({
    view: modalViewModulets,
    context: { name: "kang cahya" },
    closeCallback: (args) => {
      console.log("Close Callback", args);
      console.log("Bottom Sheet closed");
    },
  });
}
