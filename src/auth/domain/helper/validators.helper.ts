

export const validEmail = (email: string) => {
    if (!email) return false;

    var partsArray = email.split('@');

    if (partsArray.length !== 2) return false

    var username = partsArray[0];
    var domain = partsArray[1];

    if (username.length > 64) return false;

    if (domain.length > 255) return false;

    var domainPartsArray = domain.split('.');

    if (domainPartsArray.length < 2) return false;

    var mailServer = domainPartsArray[0];

    if (mailServer.length > 63) return false;

    const regularExpression = /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    if (!regularExpression.test(email)) return false;

    return true;
};


