import { Visual } from "../../src/visual";
import powerbiVisualsApi from "powerbi-visuals-api"
import IVisualPlugin = powerbiVisualsApi.visuals.plugins.IVisualPlugin
import VisualConstructorOptions = powerbiVisualsApi.extensibility.visual.VisualConstructorOptions
var powerbiKey: any = "powerbi";
var powerbi: any = window[powerbiKey];

var barchartAF206BCA11CA400BA7B548C32EFE430B: IVisualPlugin = {
    name: 'barchartAF206BCA11CA400BA7B548C32EFE430B',
    displayName: 'Manus Barchart',
    class: 'Visual',
    apiVersion: '2.6.0',
    create: (options: VisualConstructorOptions) => {
        if (Visual) {
            return new Visual(options);
        }

        throw 'Visual instance not found';
    },
    custom: true
};

if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["barchartAF206BCA11CA400BA7B548C32EFE430B"] = barchartAF206BCA11CA400BA7B548C32EFE430B;
}

export default barchartAF206BCA11CA400BA7B548C32EFE430B;