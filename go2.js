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

let contents = readHttpLikeInput();
contents = `POST /doc/test HTTP/1.1
Host: shpp.me
Accept: image/gif, image/jpeg, */*
Accept-Language: en-us
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/4.0
Content-Length: 35

bookId=12345&author=Tan+Ah+Teck
`;

function parseTcpStringAsHttpRequest(string) {
  let lines = string.split("\n");
  const methodUri = lines.shift();
  lines.pop();
  const body = lines.pop();
  const headers = lines.reduce((acc, line) => {
    if (line === "") {
      return acc;
    }
    acc[line.split(":")[0]] = `${line.split(": ")[1]}`;
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
console.log(JSON.stringify(http, undefined, 2));
