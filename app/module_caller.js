import { parseNik } from "~/libs/parsenik";

export function module_caller(moduleName, page, modalViewModule) {
  const _moduleName = moduleName.toUpperCase();
  switch (_moduleName) {
    case "KTP-CHECKER":
      const context = {
        moduleName: moduleName,
        isResult: false,
        // nik: "3171234567890123", // invalid
        nik: "3471140209790001",
      };
      __ktpChecker(page, modalViewModule, context);
      break;

    default:
      break;
  }
}

function __ktpChecker(page, modalViewModule, context) {
  console.log("Bottom Sheet opened");
  page.showBottomSheet({
    view: modalViewModule,
    context: context,
    closeCallback: (args) => {
      if (!context.isResult) {
        if (args.action == "submit") {
          let parserResult = parseNik(parseInt(args.nik)); // result is object
          context.isResult = true;
          context = { ...context, ...parserResult };
          console.log(context);
          __ktpChecker(page, modalViewModule, context);
        }
      }
    },
  });
}
