import { GlobalModel } from "~/global_model";
import { fontAwesomeParser, connectivity } from "~/global_helper";

import { module_caller } from "~/module_caller";

var model = GlobalModel([]);
var context, framePage;
var menus = [
  {
    icon: fontAwesomeParser("f2c2"),
    class: "far",
    name: "KTP Checker",
    moduleName: "ktp-checker",
    description: " Mengecek dan Memvalidasi Nomor KTP",
    view: "~/bottom-sheet/ktp-checker/ktp-checker",
    row: 0,
    col: 1,
  },
  /* {
    icon: fontAwesomeParser("f2c2"),
    class: "far",
    name: "ATM Number",
    moduleName: "atm-number",
    description: "Melakukan validasi nomor Rekening",
    view: "~/bottom-sheet/bottom-sheet",
    row: 0,
    col: 2,
  },
  {
    icon: fontAwesomeParser("f2c2"),
    class: "far",
    name: "Bank",
    moduleName: "bank",
    description: "Melakukan validasi nomor KTP",
    view: "~/bottom-sheet/bottom-sheet",
    row: 0,
    col: 3,
  },
  {
    icon: fontAwesomeParser("f2c2"),
    class: "far",
    name: "Cellular Number",
    moduleName: "cellular-number",
    description: "Melakukan validasi nomor HP",
    view: "~/bottom-sheet/bottom-sheet",
    row: 0,
    col: 4,
  }, */
];

export function onLoaded(args) {
  framePage = args.object.frame;
}

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  context.set("menus", menus);
  context.set("isConnected", connectivity().connected);

  page.bindingContext = context;
}

export function onItemTap(args) {
  let itemIndex = args.index;
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  const page = args.object.page;
  const moduleName = itemTapData.moduleName;
  const modalViewModule = itemTapData.view;

  module_caller(moduleName, page, modalViewModule);
  // page.showBottomSheet({
  //   view: modalViewModule,
  //   context: {
  //     moduleName: itemTapData.moduleName,
  //     isResult: true,
  //     name: "kang cahya",
  //     nik: "3208080407950001",
  //   },
  //   closeCallback: (args) => {
  //     if (args.action == "submit") {
  //       let x = parseNik(parseInt(args.nik));
  //       console.log("x >>> ", x);
  //     }
  //     console.log("Close Callback", args);
  //     console.log("Close Callback action", args.action);
  //     console.log("Bottom Sheet closed");
  //   },
  // });
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
