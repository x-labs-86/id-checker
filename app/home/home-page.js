import { GlobalModel } from "~/global_model";
import {
  init__tables,
  getRandomNumber,
  internet,
  getCurrentTime,
  loadMyAdMob,
} from "~/global_helper";
import { parseNik } from "~/libs/parsenik";
import { SQL__select, SQL__insert, SQL__truncate } from "~/sql_helper";

var model = GlobalModel([]);
var context,
  framePage,
  defaultLoadingMessage = "Proses pengecekan...";

export function onLoaded(args) {
  framePage = args.object.frame;

  setTimeout(() => {
    loadMyAdMob();
  }, 2000);
}

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  context.set("nik", "3471140209790001");
  context.set("loading", false);
  context.set("loadingMessage", defaultLoadingMessage);
  context.set("isLostConnectionMessage", false);
  // SQL__truncate("history");
  _checkConnectivity();

  page.bindingContext = context;
}

export function checkNow(args) {
  context.set("loading", true);
  _checkConnectivity();

  const timeToCheckConnection = internet().connected
    ? 100
    : getRandomNumber(2500, 6000);

  context.set(
    "loadingMessage",
    internet().connected
      ? defaultLoadingMessage
      : "Sedang mengecek jaringan internet..."
  );
  setTimeout(() => {
    if (internet().connected) {
      context.set("loadingMessage", defaultLoadingMessage);
      context.set("isLostConnectionMessage", false);
      setTimeout(() => {
        context.set("loadingMessage", "PENGECEKAN SELESAI");

        const page = args.object.page;
        let dataNik = parseNik(parseInt(context.nik));

        setTimeout(() => {
          context.set("loading", false);
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
              // context.set("nik", "");
              console.log("Close Callback", args);
              // console.log("Close Callback action", args.action);
              // console.log("Bottom Sheet closed");
            },
          });
          _sqliteInsert({
            input: context.get("nik"),
            response: JSON.stringify(dataNik),
          });
        }, 1000);
      }, getRandomNumber(1000, 5000));
    } else {
      context.set("loading", false);
      context.set("loadingMessage", defaultLoadingMessage);
      _checkConnectivity();
    }
  }, timeToCheckConnection);
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

export function onSwipe(args) {
  // console.log("onSwipe", args);
  if (args.direction === 4) {
    console.log("swipe up");
    goToHistory();
  }
}

export function goToHistory() {
  framePage.navigate({
    moduleName: "history/history-page",
    animated: true,
    transition: { name: "slideTop" },
  });
}

export function goToAbout() {
  framePage.navigate({
    moduleName: "about/about-page",
    animated: true,
    transition: { name: "fade" },
  });
}

function _checkConnectivity() {
  context.set("isConnected", internet().connected);
  context.set(
    "isLostConnectionMessage",
    !context.isConnected && !context.loading
  );
}

function _sqliteInsert(data) {
  init__tables();

  console.log(data);

  SQL__select("history").then((result) => {
    if (result && result.length === 0) {
      let dataInsert = [
        { field: "input", value: data.input },
        { field: "service_type", value: "KTP-CHECKER" },
        { field: "response_type", value: "JSON" },
        { field: "response", value: data.response },
        { field: "checking_status", value: 1 },
        { field: "created_date", value: getCurrentTime() },
      ];

      SQL__insert("history", dataInsert);
    }
    console.log("history >>> ", result);
  });
}
