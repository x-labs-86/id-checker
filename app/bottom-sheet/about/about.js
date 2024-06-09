import { fromObject } from "@nativescript/core";

import { GlobalModel } from "~/global_model";
import { myHttpClient } from "~/global_helper";
import { Utils, ApplicationSettings } from "@nativescript/core";

export function onLoaded(args) {
  const page = args.object;

  page.on("shownInBottomSheet", (args) => {
    setupContext(args.context);
    page.bindingContext = bindingContext;
  });
}

let bindingContext;
function setupContext(openContext) {
  bindingContext = fromObject({
    ...openContext,
    rateNow() {
      Utils.openUrl(
        "https://play.google.com/store/apps/details?id=com.kang.cahya.apps.idchecker"
      );
    },
    reportNow() {
      Utils.openUrl(
        "mailto:kangcahyakeren@gmail.com?subject=Bugs Report - ID CheckER Apps"
      );
    },
    openUrl(args) {
      if (args.object && args.object.url) {
        Utils.openUrl(args.object.url);
      }
    },
    onItemTap(args) {
      let itemTap = args.view;
      let itemTapData = itemTap.bindingContext;

      Utils.openUrl(itemTapData.playstore_url);
    },
    onClose(args) {
      const button = args.object;

      // const newData = { action: 'close', ...button.bindingContext };
      button.closeBottomSheet(button.bindingContext);
    },
  });
}

// export function onNavigatingTo(args) {
//   const page = args.object;

//   context = model;

//   _loadData();

//   page.bindingContext = context;
// }

// export function rateNow() {
//   Utils.openUrl(
//     "https://play.google.com/store/apps/details?id=com.kang.cahya.apps.idchecker"
//   );
// }

// export function reportNow() {
//   Utils.openUrl(
//     "mailto:kangcahyakeren@gmail.com?subject=Bugs Report - ID CheckER Apps"
//   );
// }

// export function openUrl(args) {
//   if (args.object && args.object.url) {
//     Utils.openUrl(args.object.url);
//   }
// }

// export function refresh() {
//   _loadData();
// }

// export function onItemTap(args) {
//   let itemTap = args.view;
//   let itemTapData = itemTap.bindingContext;

//   Utils.openUrl(itemTapData.playstore_url);
// }

// function _loadData() {
//   /* myHttpClient("https://x-labs.my.id/api/apps", "GET").then((res) => {
//     context.set("heightListView", (res.data.length + 1) * 80);
//     if (res && res.data.length) {
//       context.set("items", res.data);
//     } else {
//       context.set("items", false);
//     }
//   }); */
//   const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
//   const lastFetchDate = ApplicationSettings.getString("lastFetchDate", "");
//   const cachedData = ApplicationSettings.getString("cachedData", "");

//   if (lastFetchDate === today && cachedData) {
//     const data = JSON.parse(cachedData);
//     context.set("heightListView", (data.length + 1) * 80);
//     context.set("items", data);
//   } else {
//     myHttpClient("https://x-labs.my.id/api/apps", "GET").then((res) => {
//       if (res && res.data.length) {
//         context.set("heightListView", (res.data.length + 1) * 80);
//         context.set("items", res.data);
//         ApplicationSettings.setString("lastFetchDate", today);
//         ApplicationSettings.setString("cachedData", JSON.stringify(res.data));
//       } else {
//         context.set("items", false);
//       }
//     });
//   }
// }
