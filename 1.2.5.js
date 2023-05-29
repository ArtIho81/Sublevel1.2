

function processHttpRequest($method, $uri, $headers, $body) {
    let res, statusCode, statusMessage, body;
    const path = '/hey/file.txt'
    if ($uri === path) {
    require('fs').readFileSync(path)
}
}