export default {
    /**
     * Credit: http://youmightnotneedjquery.com/#ready
     * @param {function} fn An page-ready event handler.
     */
    ready: (fn) => {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    },

    /**
     * Get a Promise which load JSON from an URL.
     * @param  {String} url The URL to be loaded.
     * @return {Promise} A Promise.
     */
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

    /**
     * Get a Promise which load image from an URL.
     * @param  {String} url The URL.
     * @return {Promise} A Promise.
     */
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
     * @param {String} url The URL to be prefixed.
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
     * @param {String} url The URL.
     */
    httpURLGetDomain: (url) => url.replace(/.*?(\w+(?:\.\w+)+).*/, '$1'),

    /**
     * Get the extension of the file URL.
     * @param {String} url The file URL.
     */
    getExtension: (url) => url.replace(/^.*\.(\w+)$/, '$1')
}