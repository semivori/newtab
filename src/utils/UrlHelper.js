export default class UrlHelper {
    static formatHref(url) {
        if (!url.match(/^http/)) {
            url = 'http://' + url;
        }

        return url;
    }
}