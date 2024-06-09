import { ApplicationSettings, Utils } from "@nativescript/core";
import { GlobalModel } from "~/global_model";
import {
  init__tables,
  getRandomNumber,
  internet,
  getCurrentTime,
  loadMyAdMob,
  myHttpClient,
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

  context.set("nik", ""); // 3471140209790001
  context.set("loading", false);
  context.set("loadingMessage", defaultLoadingMessage);
  context.set("isLostConnectionMessage", false);
  _checkConnectivity();
  _loadXLabsApps();

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
            closeCallback: (args) => {},
          });
          _sqliteInsert({
            input: context.get("nik"),
            response: dataNik.valid
              ? JSON.stringify(dataNik)
              : JSON.stringify({}),
            valid: dataNik.valid ? 1 : 0,
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

export function onSwipe(args) {
  if (args.direction === 4) {
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

export function openAbout(args) {
  const page = args.object.page;

  _loadXLabsApps();

  const bottomSheetContext = {
    items: context.appItems,
    heightListView: context.appHeightListView,
  };

  page.showBottomSheet({
    view: "~/bottom-sheet/about/about",
    context: bottomSheetContext,
    closeCallback: (args) => {},
  });
}

export function openDisclaimer(args) {
  const page = args.object.page;

  page.showBottomSheet({
    view: "~/bottom-sheet/disclaimer/disclaimer",
  });
}

export function openUrl(args) {
  if (args.object && args.object.url) {
    Utils.openUrl(args.object.url);
  }
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
  SQL__select("history", "*", "WHERE input='" + data.input + "'").then(
    (result) => {
      if (result && result.length === 0) {
        let dataInsert = [
          { field: "input", value: data.input },
          { field: "service_type", value: "KTP-CHECKER" },
          { field: "response_type", value: "JSON" },
          { field: "response", value: data.response },
          { field: "checking_status", value: data.valid },
          { field: "created_date", value: getCurrentTime() },
        ];
        SQL__insert("history", dataInsert);
      }
    }
  );
}

function _loadXLabsApps() {
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const lastFetchDate = ApplicationSettings.getString("lastFetchDate", "");
  const cachedData = ApplicationSettings.getString("cachedData", "");

  if (lastFetchDate === today && cachedData) {
    const data = JSON.parse(cachedData);
    context.set("appHeightListView", (data.length + 1) * 80);
    context.set("appItems", data);
  } else {
    myHttpClient("https://x-labs.my.id/api/apps", "GET").then((res) => {
      if (res && res.data.length) {
        context.set("appHeightListView", (res.data.length + 1) * 80);
        context.set("appItems", res.data);
        ApplicationSettings.setString("lastFetchDate", today);
        ApplicationSettings.setString("cachedData", JSON.stringify(res.data));
      } else {
        context.set("appHeightListView", 80);
        context.set("appItems", false);
      }
    });
  }
}
