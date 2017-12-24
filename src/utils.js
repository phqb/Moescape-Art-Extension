export default {
    /**
     * Credit: http://youmightnotneedjquery.com/#ready
     * @param {*} fn An page-ready event handler.
     */
    ready: (fn) => {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    },

    getJSON: (url) => new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        
        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                resolve(JSON.parse(request.responseText));
            } else {
                reject(new Error());
            }
        };

        request.onerror = () => {
            reject(new Error(`Can't get JSON from ${url}`));
        }
        
        request.send();
    }),

    getImage: (url) => new Promise((resolve, reject) => {
        const imageLoader = new Image();
        
        imageLoader.onload = function() {
            resolve(this.src);
        };

        imageLoader.onerror = () => {
            reject(new Error(`Can't load image from ${url}`));
        };

        imageLoader.src = url;
    }),

    /**
     * Prefix an unprefixed http URL.
     * @param {*} url The URL to be prefixed.
     */
    httpURLPrefixProber: (url) => {
        if (url.startsWith('https://') || url.startsWith('http://')) {
            return url;
        } else {
            return 'http://' + url.replace(/^[:|\/]+/, '');
        }
    },

    /**
     * Get the domain of the URL.
     * @param {*} url The URL.
     */
    httpURLGetDomain: (url) => url.replace(/.*?(\w+(?:\.\w+)+).*/, '$1'),

    /**
     * Get the extension of the file URL.
     * @param {*} url The file URL.
     */
    getExtension: (url) => url.replace(/^.*\.(\w+)$/, '$1')
}