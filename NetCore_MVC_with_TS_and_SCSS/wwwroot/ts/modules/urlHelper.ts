import { $aerisht } from "./aerisht";

export class UrlHelper {
    helper: EventTarget;

    constructor() {
        this.helper = new EventTarget();
    }

    getApiUrl(baseUrl: string, query: any) {
        var tempUrlSearch = new URLSearchParams(window.location.search);

        for (var k in query) {
            if (query[k] != null) {
                tempUrlSearch.set(k, query[k]);
            } else {
                tempUrlSearch.delete(k);
            }
        }

        return '/api/' + baseUrl.split('?')[0] + '?' + tempUrlSearch.toString();
    }

    getUrl(baseUrl: string) {
        return baseUrl.split('?')[0] + '?' + this.getQueryString();
    }

    action(action: string, controller: string, values: any): string {
        var url = '';

        if (values['area'] != null) {
            url += '/' + values['area'];
        }

        if (controller != null) {
            if (controller == 'Home' && action == 'Index') {
                // do nothing
            } else {
                url += '/' + controller;
            }
        }

        if (action != null) {
            if (action == 'Index') {
                // do nothing
            } else {
                url += '/' + action;
            }
        }

        var qs = '';
        for (var k in values) {
            if (k == 'area') {
                continue;
            }

            qs = qs + '&' + k + '=' + values[k];
        }

        if (qs.startsWith('&')) {
            qs = qs.substr(1);
        }

        if (qs.length > 0) {
            url += '?' + qs;
        }

        return url;
    }

    updateQuery(query: any) {
        var tempUrlSearch = new URLSearchParams(window.location.search);
        var changedKey = null;

        for (var k in query) {
            if (changedKey == null) {
                changedKey = k;
            }

            if (query[k] != null) {
                tempUrlSearch.set(k, query[k]);
            } else {
                tempUrlSearch.delete(k);
            }
        }

        var newUrl = window.location.origin + window.location.pathname + '?' + tempUrlSearch.toString();

        window.history.pushState({ path: newUrl }, '', newUrl);

        var qs = {};

        for (var key of tempUrlSearch.keys()) {
            qs[key] = tempUrlSearch.get(key);
        }

        this.helper.dispatchEvent(new CustomEvent('queryChange', {
            detail: {
                change: changedKey,
                result: qs
            }
        }));
    }

    updateUrlQuery(url: string, query: any): string {
        if (url == null) {
            return null;
        }

        var parts = url.split('?');

        if (parts.length == 1) {
            return parts[0];
        }

        const urlParams = new URLSearchParams(parts[1]);

        if (query == null) {
            return urlParams.toString();
        }

        for (var key in query) {
            urlParams.set(key, query[key]);
        }

        return parts[0] + '?' + urlParams.toString();
    }

    getQueryObject(): any {
        var urlSearchParam = new URLSearchParams(window.location.search);

        var obj = {};

        for (let key of urlSearchParam.keys()) {
            obj[key] = urlSearchParam.get(key);
        }

        return obj;
    }

    getQuery(key: string): string {
        var urlSearchParam = new URLSearchParams(window.location.search);

        return urlSearchParam.get(key);
    }

    getQueryString(): string {
        var urlSearchParam = new URLSearchParams(window.location.search);

        return urlSearchParam.toString();
    }

    bind(eventName: string, functionReference: Function) {
        this.helper.addEventListener(eventName, function (e) {
            functionReference(e['detail']);
        });
    }
}