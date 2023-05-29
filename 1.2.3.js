
function readHttpLikeInput() {
  var fs = require("fs");
  var res = "";
  var buffer = Buffer.alloc ? Buffer.alloc(1) : new Buffer(1);
  let was10 = 0;
  for (;;) {
    try {
      fs.readSync(0 /*stdin fd*/, buffer, 0, 1);
    } catch (e) {
      break; /* windows */
    }
    if (buffer[0] === 10 || buffer[0] === 13) {
      if (was10 > 10) break;
      was10++;
    } else was10 = 0;
    res += new String(buffer);
  }

  return res;
}

//let contents = readHttpLikeInput();
let contents = `GET /sum?nums=0,2,3 HTTP/1.1
Host: student.shpp.me
`;

function outputHttpResponse(statusCode, statusMessage, headers, body) {
  let httpResponse = `HTTP/1.1 ${statusCode} ${statusMessage}\n`;
  for (let header in headers) {
    httpResponse += `${header} : ${headers[header]}\n`;
  }
  httpResponse += `\n${body}`;
  console.log(httpResponse);
}

function processHttpRequest($method, $uri, $headers, $body) {
  let res, statusCode, statusMessage, body;
  const method = $method === "GET";
  const uri = /^\/sum\?nums=(\d+(.\d+)?,)+\d+(.\d+)?$/.test($uri);

  if (method && uri) {
    res = $uri
      .split("=")[1]
      .split(",")
      .reduce((acc, num) => acc += +num, 0);
  }

  if (res === 5) {
    body = res + "";
    statusCode = "200";
    statusMessage = "OK";
  }

  if (!/^\/sum/.test($uri)) {
    body = "not found";
    statusCode = "404";
    statusMessage = "Not Found";
  }

  if (!/\?nums/.test($uri) || !method()) {
    body = "not found";
    statusCode = "400";
    statusMessage = "Bad Request";
  }

  const headers = {
    Date: new Date(),
    Server: "Apache/2.2.14 (Win32)",
    "Content-Length": body.length,
    Connection: "Closed",
    "Content-Type": "text/html; charset=utf-8",
  };
  outputHttpResponse(statusCode, statusMessage, headers, body);
}

function parseTcpStringAsHttpRequest($string) {
  let lines = $string.split("\n");
  const methodUri = lines.shift();
  const body = lines.pop();
  const headers = lines.reduce((acc, line) => {
    if (line === "") {
      return acc;
    }
    acc[line.split(":")[0]] = `${line.split(":")[1].toString().trim()}`;
    return acc;
  }, {});
  return {
    method: methodUri.split(" ")[0],
    uri: methodUri.split(" ")[1],
    headers: headers,
    body: body,
  };
}

http = parseTcpStringAsHttpRequest(contents);
processHttpRequest(http.method, http.uri, http.headers, http.body);
