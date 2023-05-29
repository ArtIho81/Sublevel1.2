function parseTcpStringAsHttpRequest(string) {
  let lines = string.split("\n");
  const methodUri = lines.shift();
  lines.pop()
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
const contents = `POST /doc/test HTTP/1.1
Host: shpp.me
Accept: image/gif, image/jpeg, */*
Accept-Language: en-us
Accept-Encoding: gzip, deflate
User-Agent: Mozilla/4.0
Content-Length: 35

bookId=12345&author=Tan+Ah+Teck
`;
http = parseTcpStringAsHttpRequest(contents);
console.log(JSON.stringify(http, undefined, 2));
//console.log (http)
