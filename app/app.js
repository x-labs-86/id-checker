import { Application } from "@nativescript/core";
import { Theme } from "@nativescript/theme";
// import { installMixins } from "@nativescript-community/ui-material-core";
import { install } from "@nativescript-community/ui-material-bottomsheet";

// installMixins();
install();

Theme.setMode(Theme.Light);
Application.run({ moduleName: "app-root" });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
