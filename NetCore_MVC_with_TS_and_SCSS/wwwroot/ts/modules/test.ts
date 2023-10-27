class Temp {
    isDebug: boolean;

    constructor(isDebug: boolean) {
        this.isDebug = isDebug;
    }

    log(method, ...args) {
        if (this.isDebug) {
            console.log('>', method, args);
        }
    }
}

export let $temp = new Temp(true);