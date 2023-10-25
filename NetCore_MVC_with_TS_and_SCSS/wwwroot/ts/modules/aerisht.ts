import { UrlHelper } from './urlHelper';
import { AerishDialog } from './dialog';

class Aerish {
    isDebug: boolean;
    urlHelper: UrlHelper;
    dialog: AerishDialog;

    constructor(isDebug: boolean) {
        this.isDebug = isDebug;

        this.urlHelper = new UrlHelper();
        this.dialog = new AerishDialog();
    }

    log(method, ...args) {
        if (this.isDebug) {
            console.log('>', method, args);
        }
    }
}

export let $aerisht = new Aerish(true);