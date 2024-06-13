import { InterstitialAd } from "@nativescript/firebase-admob";
import { Http, Dialogs, Connectivity } from "@nativescript/core";

import { SQL__query } from "~/sql_helper";

export function init__tables() {
  SQL__query(`CREATE TABLE "history" (
    "id"	INTEGER NOT NULL UNIQUE,
    "bg_color"	TEXT NOT NULL DEFAULT '#FFFFFF',
    "input"	TEXT NOT NULL,
    "service_type"	TEXT NOT NULL,
    "response_type"	TEXT NOT NULL DEFAULT 'JSON',
    "response"	TEXT NOT NULL,
    "checking_status"	INTEGER NOT NULL DEFAULT 0,
    "deleted"	INTEGER NOT NULL DEFAULT 0,
    "deleted_date"	TEXT DEFAULT NULL,
    "created_date"	TEXT NOT NULL,
    PRIMARY KEY("id" AUTOINCREMENT)
  )`);
}

export function fontAwesomeParser(avatar) {
  return String.fromCharCode(parseInt(avatar, 16));
}

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function internet() {
  const connectionType = Connectivity.getConnectionType();
  switch (connectionType) {
    case Connectivity.connectionType.wifi:
      return {
        connected: true,
        type: "wifi",
      };
    case Connectivity.connectionType.ethernet:
      return {
        connected: true,
        type: "wifi",
      };
    case Connectivity.connectionType.mobile:
      return {
        connected: true,
        type: "mobile",
      };
    case Connectivity.connectionType.bluetooth:
      return {
        connected: false,
        type: "none",
      };
    case Connectivity.connectionType.vpn:
      return {
        connected: false,
        type: "none",
      };
    default:
      return {
        connected: false,
        type: "none",
      };
  }
}

export function monitorConnectivity() {
  let response = {
    connected: false,
    type: "none",
  };
  Connectivity.startMonitoring((change) => {
    switch (change) {
      case Connectivity.connectionType.wifi:
        response.connected = true;
        response.type = "wifi";
        break;
      case Connectivity.connectionType.ethernet:
        response.connected = true;
        response.type = "wifi";
        break;
      case Connectivity.connectionType.mobile:
        response.connected = true;
        response.type = "mobile";
        break;
      case Connectivity.connectionType.bluetooth:
        response.connected = false;
        response.type = "none";
        break;
      case Connectivity.connectionType.vpn:
        response.connected = false;
        response.type = "none";
        break;
      default:
        response.connected = false;
        response.type = "none";
        break;
    }
  });

  return response;
}

export function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  return str.replace(new RegExp(escapedFind, "g"), replace);
}

export function fixingPhoneNumberFormat(phoneNumber, countryCode) {
  let clearingPlusChar = replaceAll(phoneNumber, "+", "");
  let clearingDashChar = replaceAll(clearingPlusChar, "-", "");
  let clearingSpace = replaceAll(clearingDashChar, " ", "");

  let clean = clearingSpace;

  let findZero = clean.charAt(0);
  let ret = null;
  if (findZero == "0") {
    let code = replaceAll(countryCode, "+", "");
    ret = code.concat(clean.slice(1));
  } else {
    ret = clean;
  }

  return ret;
}

export function getCurrentTime() {
  var d = new Date();

  var p = d.getFullYear(),
    q = d.getMonth() + 1,
    r = d.getDate(),
    s = d.getHours(),
    t = d.getMinutes(),
    u = d.getSeconds();

  var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ],
    monthName = months[d.getMonth()];

  // var days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var dayName = days[d.getDay()];

  var result =
    dayName +
    ", " +
    r +
    "/" +
    monthName +
    "/" +
    p +
    " " +
    s +
    ":" +
    t +
    ":" +
    u;

  return result;
}

export function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 =
    (typeof performance !== "undefined" &&
      performance.now &&
      performance.now() * 1000) ||
    0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function loadMyAdMob() {
  const ad = InterstitialAd.createForAdRequest(
    "ca-app-pub-1640120316722376/6155970269"
  );

  // console.log("show");

  ad.onAdEvent((event, error, data) => {
    // console.log("show 2");
    // event : adLoaded, adClosed
    // console.log("AdEventType >> ", AdEventType);
    // console.log("event >> ", event);
    // console.log("error >> ", error);
    // console.log("data >> ", data);
    ad.show({
      immersiveModeEnabled: true,
    });
  });

  ad.load();
  // ad.onAdEvent((event, error, data) => {
  //   console.log(event);
  //   switch (event) {
  //     case AdEventType.LOADED:
  //       break;
  //     case AdEventType.CLOSED:
  //       ad.show();
  //       break;
  //     case AdEventType.OPENED:
  //       ad.show();
  //       break;
  //     case AdEventType.IMPRESSION:
  //       break;
  //     case AdEventType.FAILED_TO_SHOW_FULL_SCREEN_CONTENT:
  //       console.log("Failed to show full screen content");
  //       break;
  //   }
  // });

  // ad.load();
}

export async function myHttpClient(_url, _method = "GET", _data = {}) {
  try {
    if (_method.toUpperCase() === "GET") {
      const res = await Http.request({
        method: "GET",
        url: _url,
      });
      return res.content.toJSON();
    } else {
      const res = await Http.request({
        method: _method,
        url: _url,
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify(_data),
      });
      return res.content.toJSON();
    }
  } catch (e) {
    Dialogs.alert("Error occurred!");
  }
}
