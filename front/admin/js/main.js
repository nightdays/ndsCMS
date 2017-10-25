(function (w) {
    w.http = function (url) {
        return function (data) {
            return new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                xhr.open("post", `${serviceUrl}${url}`, true);
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(data));
                xhr.onload = function () {
                    resolve(xhr.responseText);
                }
            });
        }
    }


    w.ajax = function (url, data) {
        return new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open("post", `${serviceUrl}${url}`, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
            xhr.onload = function () {
                resolve(JSON.parse(xhr.responseText));
            }
        });
    }

})(window);