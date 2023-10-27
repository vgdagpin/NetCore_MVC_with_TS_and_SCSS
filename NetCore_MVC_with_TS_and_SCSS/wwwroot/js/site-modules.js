/* This is auto generated, go to Task Runner Explorer and run bundleJS */


class Temp {
    constructor(isDebug) {
        this.isDebug = isDebug;
    }
    log(method, ...args) {
        if (this.isDebug) {
            console.log('>', method, args);
        }
    }
}
let $temp = new Temp(true);
