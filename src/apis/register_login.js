
export const regisMacAdd = async (urlser, serviceID, machineNum, username, password) => {
    await fetch(urlser + '/DevUsers', {
        method: 'POST',
        body: JSON.stringify({
            'BPAPUS-BPAPSV': serviceID,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Register',
            'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE":"' +
                machineNum +
                '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "mobile login"}',
        }),
    })
        .then((response) => response.json())
        .then(async (json) => {
            return json
        })
        .catch((error) => {
            return error
        })
}

export const regisMacAndLogin = async (urlser, serviceID, machineNum, username, password) => {
    console.log(`regisMacAndLogin >> (${urlser}, ${serviceID}, ${machineNum}, ${username}, ${password})`)
    await fetch(urlser + '/DevUsers', {
        method: 'POST',
        body: JSON.stringify({
            'BPAPUS-BPAPSV': serviceID,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Register',
            'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE":"' +
                machineNum +
                '","BPAPUS-CNTRY-CODE": "66","BPAPUS-MOBILE": "mobile login"}',
        }),
    })
        .then((response) => response.json())
        .then(async (json) => {
            console.log(json)
            if (json.ResponseCode == 200)
                return await fetchGuidLog(urlser, serviceID, machineNum, username, password)
            else return json
        })
        .catch((error) => {
           
            return error
        });
};

export const fetchGuidLog = async (urlser, serviceID, machineNum, username, password) => {
    console.log(`fetchGuidLog >> (${urlser}, ${serviceID}, ${machineNum}, ${username}, ${password})`)
    await fetch(urlser + '/DevUsers', {
        method: 'POST',
        body: JSON.stringify({
            'BPAPUS-BPAPSV': serviceID,
            'BPAPUS-LOGIN-GUID': '',
            'BPAPUS-FUNCTION': 'Login',
            'BPAPUS-PARAM':
                '{"BPAPUS-MACHINE": "' +
                machineNum +
                '","BPAPUS-USERID": "' +
                username +
                '","BPAPUS-PASSWORD": "' +
                password +
                '"}',
        }),
    })
        .then((response) => response.json())
        .then((json) => {
            return json
        })
        .catch((error) => {
            return error
        });
};
