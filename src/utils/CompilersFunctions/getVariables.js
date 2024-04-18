export const getVariables = (data) => {
    const pattern = /\[([^\[\]]+)\]/g;
    const variables = []
    const jsonData = data

    for (const key in jsonData) {
        if (Object.hasOwnProperty.call(jsonData, key)) {
            const value = JSON.stringify(jsonData[key]);
            if (key !== 'Signature') {
                let match;
                while ((match = pattern.exec(value)) !== null) {
                    variables.push(match[0]);
                }
            }
        }
    }

    // variables.forEach(variable => {
    //     console.log(variable)
    // })
    return variables
}

