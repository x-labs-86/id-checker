import { GlobalModel } from "~/global_model";
import { loadMyAdMob } from "~/global_helper";
import { parseNik } from "~/libs/parsenik";
import {
  ObservableArray,
  ApplicationSettings,
  Dialogs,
  Utils,
  Application,
  isAndroid,
  isIOS,
} from "@nativescript/core";

import { SQL__select, SQL__truncate } from "~/sql_helper";

var model = GlobalModel([]);
var context, framePage;

const dataHistorySqlite = new ObservableArray([]);
const dataHistory = new ObservableArray([]);

export function onLoaded(args) {
  framePage = args.object.frame;
  setTimeout(() => {
    loadMyAdMob();
  }, 2000);
  __loadDataSqlite();
}

export function onNavigatingTo(args) {
  const page = args.object;

  context = model;

  page.bindingContext = context;
}

export function __loadDataSqlite() {
  // dataHistorySqlite.splice(0);
  SQL__select("history", "*", "WHERE deleted=0").then((res) => {
    // console.log("data sqlite >> ", res);
    if (res && res.length > 0) {
      res.map((item) => {
        // dataHistorySqlite.push(item);
        if (
          item.response_type === "JSON" &&
          item.service_type === "KTP-CHECKER"
        ) {
          const response = JSON.parse(item.response);
          // "{"nik":3471140209790001,"valid":true,"jenis_kelamin":"LAKI-LAKI","tanggal_lahir":"1979-09-02","provinsi":"DAERAH ISTIMEWA YOGYAKARTA","kabupaten_kota":"KOTA YOGYAKARTA","kecamatan":"KOTAGEDE","kodepos":"55171"}"
          item.response__nik = response.nik;
          item.response__valid = response.valid;
          item.response__jenis_kelamin = response.jenis_kelamin;
          item.response__tanggal_lahir = response.tanggal_lahir;
          item.response__provinsi = response.provinsi;
          item.response__kabupaten_kota = response.kabupaten_kota;
          item.response__kecamatan = response.kecamatan;
          item.response__kodepos = response.kodepos;
        }
        return item;
      });

      context.set("items", res);
    } else {
      context.set("items", false);
    }
  });
}

export function clearTap() {
  Dialogs.confirm({
    title: "Bersihkan Semua!",
    message: "Apakah kamu yakin ingin membersihkan data Riwayat?",
    okButtonText: "Iya",
    neutralButtonText: "Tidak",
  }).then((result) => {
    if (result) {
      loadMyAdMob();
      // LSdrop();
      SQL__truncate("history");
      // SQL__truncate("dataphone");
      __loadDataSqlite();
      Dialogs.alert("Data riwayat berhasil dibersihkan :)");
    }
  });
}

export function refreshTap() {
  __loadDataSqlite();
}

export function onItemTap(args) {
  let itemIndex = args.index;
  let itemTap = args.view;
  let itemTapData = itemTap.bindingContext;

  const page = args.object.page;
  let dataNik = parseNik(parseInt(itemTapData.response__nik));

  page.showBottomSheet({
    view: "~/bottom-sheet/ktp-checker/ktp-checker",
    context: {
      nik: itemTapData.response__nik,
      ...dataNik,
    },
    closeCallback: (args) => {},
  });

  /* const actionOptions = {
    title: "Actions for " + itemTapData.phone,
    message: "",
    cancelButtonText: "Cancel",
    actions: [
      "Go to WhatsApp",
      "Copy Phone Number",
      "Save number to Contact",
      "Share To",
      "Remove",
    ],
    cancelable: true, // Android only
  };

  Dialogs.action(actionOptions).then((result) => {
    const __RU = result.toUpperCase();
    switch (__RU) {
      case "GO TO WHATSAPP":
        let configUrl = ApplicationSettings.getString("CONFIG_URL");
        let phoneNumber = itemTapData.phone;
        let fullUrl = configUrl + phoneNumber;
        Utils.openUrl(fullUrl);
        break;


      case "REMOVE":
        const confirmOptions = {
          title: "Confirm",
          message: "Are you sure want to remove this item?",
          okButtonText: "Yes",
          neutralButtonText: "No",
        };
        confirm(confirmOptions).then((result) => {
          if (result === true) {
            loadMyAdMob();
            // LSremove(itemIndex);
            SQL__delete("dataphone", itemTapData.id);
            __loadDataSqlite();
            Dialogs.alert(itemTapData.phone + " has been removed");
          }
        });

        break;

      case "SAVE NUMBER TO CONTACT":
        let contact = {
          name: itemTapData.name ? itemTapData.name : "Unknown",
          phone: itemTapData.phone,
        };
        _saveToPhoneBook(contact);

        break;

      default:
        break;
    }
  }); */
}

export function onSwipe(args) {
  // console.log("onSwipe", args);
  if (args.direction === 8) {
    console.log("swipe down");
    goToHome();
  }
}

export function goToHome() {
  framePage.navigate({
    moduleName: "home/home-page",
    animated: true,
    transition: { name: "slideBottom" },
  });
}
