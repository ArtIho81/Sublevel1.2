let contents = `POST /api/checkLoginAndPassword HTTP/1.1
Accept: */*
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/4.0
Content-Length: 35

login=student&password=12345`;

function parseTcpStringAsHttpRequest($string) {
  let lines = $string.split("\n");
  const methodUri = lines.shift();
  const body = lines.pop();
  const headers = lines.reduce((acc, line) => {
    if (line === "") {
      return acc;
    }
    acc[line.split(":")[0]] = `${line.split(":")[1].trim()}`;
    return acc;
  }, {});
  return {
    method: methodUri.split(" ")[0],
    uri: methodUri.split(" ")[1],
    headers: headers,
    body: body,
  };
}

function processHttpRequest($method, $uri, $headers, $body) {
  let answer;
  const method = $method === "POST";
  const uri = $uri === "/api/checkLoginAndPassword";
  if (!uri || !method) {
    answer = {
      body: "not found",
      statusCode: "400",
      statusMessage: "Bad Request",
    };
  } else {
    switch (foundLoginAndPassword($body)) {
      case "error":
        answer = {
          body: "not found",
          statusCode: "500",
          statusMessage: "Internal Server Error",
        };
        break;
      case null:
        answer = {
          body: `<h1 style="color:red">NOT FOUND</h1>`,
          statusCode: "401",
          statusMessage: "Unauthorized",
        };
        break;
      default:
        answer = {
          body: `<h1 style="color:green">FOUND</h1>`,
          statusCode: "200",
          statusMessage: "OK",
        };
    }
  }
  const headers = {
    Date: new Date(),
    Server: "Apache/2.2.14 (Win32)",
    "Content-Length": answer.body.length,
    Connection: "Closed",
    "Content-Type": "text/html; charset=utf-8",
  };

  outputHttpResponse(
    answer.statusCode,
    answer.statusMessage,
    headers,
    answer.body
  );
}

function outputHttpResponse(statusCode, statusMessage, headers, body) {
  let httpResponse = `HTTP/1.1 ${statusCode} ${statusMessage}\n`;
  for (let header in headers) {
    httpResponse += `${header} : ${headers[header]}\n`;
  }
  httpResponse += `\n${body}`;
  console.log(httpResponse);
}

function foundLoginAndPassword($body) {
  let fs = require("fs");
  const path = "Level1/Sublevel1.2/passwords.txt";
  if (fs.existsSync(path)) {
    const loginPassword = `${$body.split("&")[0].split("=")[1]}:${
      $body.split("&")[1].split("=")[1]
    }`;
    return fs
      .readFileSync(path)
      .toString()
      .match(new RegExp(`\^${loginPassword}\r\n`));
  } else {
    return "error";
  }
}

http = parseTcpStringAsHttpRequest(contents);
processHttpRequest(http.method, http.uri, http.headers, http.body);
