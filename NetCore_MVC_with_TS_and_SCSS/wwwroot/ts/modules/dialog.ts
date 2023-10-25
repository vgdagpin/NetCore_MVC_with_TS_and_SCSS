/// <reference path="../../../node_modules/@types/kendo-ui/index.d.ts" />

import * as $ from 'jquery'

class AerishDialogPopup {
    private kWin: any;
    private url: string;

    fnOnClose: any;

    constructor(url: string) {
        this.url = url;

        let me = this;

        this.kWin = $('<div />')['kendoWindow']({
            visible: false,
            width: 900,
            draggable: true,
            minHeight: 250,
            modal: true,
            close: function () {
                this.content(null);

                if (me.fnOnClose != null) {
                    me.fnOnClose();
                }
            },
            activate: function () {
                this.center();
            }
        })
            .data('kendoWindow');
    }

    setWidth(w: number) {
        this.kWin.setOptions({
            width: w
        });

        return this;
    }

    setHeight(h: number) {
        this.kWin.setOptions({
            height: h
        });

        return this;
    }

    close(fn: Function) {
        this.fnOnClose = fn;

        return this;
    }

    open() {
        this.kWin
            .title('Loading..')
            .refresh(this.url)
            .center()
            .open();
    }
}

export class AerishDialog {
    private kWinElem: any;

    constructor() {

    }

    alert(text: string, title?: string) {
        var win = $('<div />').kendoDialog({
            title: title == null ? document.title : title,
            visible: true,
            minWidth: 400,
            content: "<p>" + text + "<p>",
            modal: true,
            actions: [
                {
                    text: 'OK',
                    action: function (e) {
                        var fn = $.data(e.sender.element[0], 'evtObj').tempFn;

                        if (typeof fn === 'function') {
                            fn();
                        }
                    },
                    primary: true
                }
            ],
            show: function () {
                var btnElem = this.element.find('.alert-button-ok');

                btnElem.focus();
            }
        })
            .data('kendoDialog');

        var me = {
            tempFn: null,
            done: function (fn) {
                this.tempFn = fn;
            }
        };

        $.data(win.element[0], 'evtObj', me);

        return me;
    }

    confirm(text: string, title?: string): any {
        var win = $('<div />').kendoDialog({
            title: title == null ? document.title : title,
            visible: true,
            minWidth: 400,
            content: "<p>" + text + "<p>",
            modal: true,
            actions: [
                {
                    text: 'OK',
                    action: function (e) {
                        var fn = $.data(e.sender.element[0], 'evtObj').tempFn;

                        if (typeof fn === 'function') {
                            fn(true);
                        }
                    },
                    primary: true
                },
                {
                    text: 'Cancel',
                    action: function (e) {
                        var fn = $.data(e.sender.element[0], 'evtObj').tempFn;

                        if (typeof fn === 'function') {
                            fn(false);
                        }
                    }
                }
            ],
            show: function () {
                var btnElem = this.element.find('.alert-button-ok');

                btnElem.focus();
            }
        })
            .data('kendoDialog');

        var me = {
            tempFn: null,
            done: function (fn) {
                this.tempFn = fn;
            }
        };

        $.data(win.element[0], 'evtObj', me);

        return me;
    }

    popup(url, qs?): AerishDialogPopup {
        var uri = url;

        if (qs != null) {
            if (uri.indexOf('?')) {
                uri = uri + '&' + this.toQueryString(qs);
            } else {
                uri = uri + '?' + this.toQueryString(qs);
            }
        }

        return new AerishDialogPopup(uri);
    }

    private toQueryString(qs) {
        var temp = [];

        for (var key in qs) {
            temp.push(key + '=' + qs[key]);
        }

        return temp.join('&');
    }
}