
const clrfToString = (str) => str.split('\n').map((a) => {
  return [a.substr(0,a.indexOf(':')),a.substr(a.indexOf(':')+1,a.length)]
}).reduce((obj,cur,i) => {
obj[cur[0]] = cur[1];
return obj
}, {});

const elafria = () => {

let requestTwo = (method) => (url, payload, header) => {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      if (header.headers) {
          Object.keys(header.headers).forEach(key => {
              xhr.setRequestHeader(key, header.headers[key]);
          });
      }
      xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                data: xhr.response && JSON.parse(xhr.response),
                status: xhr.status,
                headers: clrfToString(xhr.getAllResponseHeaders()),
              });
          } else {
              reject(JSON.parse(xhr.response));
          }
      };
      xhr.onerror = () => {
      console.log(xhr);
        reject({ message: "error", status: xhr.status});
      }
      if (payload instanceof FormData) {
          xhr.send(payload);
      }
      else {
          xhr.setRequestHeader("content-type", "application/json;charset=UTF-8")
          xhr.send(JSON.stringify(payload));
      }
  });
};

let request = (method) => (url, header) => {
  return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);
      if (header.headers) {
          Object.keys(header.headers).forEach(key => {
              xhr.setRequestHeader(key, header.headers[key]);
          });
      }
      xhr.setRequestHeader('Accept', 'application/vnd.wearepercent.v2+json');
      xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
              resolve({
                data: xhr.response && JSON.parse(xhr.response),
                status: xhr.status,
                headers: clrfToString(xhr.getAllResponseHeaders()),
              });
          } else {
              reject(JSON.parse(xhr.response));
          }
      };
      xhr.onerror = () => {
        reject({ error: true, status: xhr.status});
      }
      xhr.send();
  });
};

let getRequest = request('GET');
let patchRequest = requestTwo('PATCH');
let postRequest = requestTwo('POST');
let deleteRequest = requestTwo('DELETE');

return {
  "get": (url, header) => getRequest(url, header),  
  "patch": (url, payload, header) => patchRequest(url, payload, header),  
  "post": (url, payload, header) => postRequest(url, payload, header),  
  "delete": (url, payload, header) => deleteRequest(url, header),  
}
};

export default elafria();