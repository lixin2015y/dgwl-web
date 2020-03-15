export const serverConfig = {
    base_url: 'http://localhost:8080'
}

export const sendRequest = (url, type = 'post', params = {}) => {
    return fetch(serverConfig.base_url + url, {
        method: type,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: parseParams({...params, ...{sessionId: sessionStorage.getItem('sessionId')}})
    }).then(resp => resp.json())
}

export const parseParams = (obj) => {
    let params = ''
    Object.keys(obj).map((key) => {
        if (Array.isArray(obj[key])) {
            obj[key].forEach((e) => {
                params = [params, '&', key, '=', e].join('')
            })
        } else {
            params = [params, '&', key, '=', obj[key]].join('')
        }
    })
    return params
}