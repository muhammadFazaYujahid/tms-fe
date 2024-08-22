
// const controller = new AbortController()
// const signal = controller.signal

export const apiWrapper = async (
    route, 
    method, 
    body,
    header = {'Content-Type': 'application/json', 'Control-Allow-Credentials': 'true'},
    credentials = 'include', 
) => {
    const serverURL = process.env.SERVER_URL;
    // console.log('masuk wrapper',method, route, body, header);
    const response = await fetch(`${serverURL}${route}`, {
        method: method,
        credentials: credentials,
        // signal: signal,
        headers: header,
        body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
}

export const fileWrapper = async (
    route, 
    method, 
    body,
    header = {'Control-Allow-Credentials': 'true'},
    stringifyBody = true,
    credentials = 'include', 
) => {
    const serverURL = process.env.SERVER_URL;
    // console.log('masuk wrapper',method, route, body, header);
    const response = await fetch(`${serverURL}${route}`, {
        method: method,
        credentials: credentials,
        // signal: signal,
        headers: header,
        body: (stringifyBody) ? JSON.stringify(body) : body
    });

    const data = await response;
    return data;
}

// export const apiCancel = () => {
//     controller.abort();
// }
