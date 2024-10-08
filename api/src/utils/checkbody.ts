function checkBody(body: any, keys: string[]) {
    let isValid = true;

    const regex = /^\s*$/;

    for (const field of keys) {
        if (!body[field] || body[field] === "" || regex.test(body[field])) {
            isValid = false;
        }
    }

    return isValid;
}

export default checkBody;
