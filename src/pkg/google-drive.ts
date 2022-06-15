

export const trySampleRequest = () => {
    const accessToken = "ya29.a0ARrdaM9YMLIHquk2tyOfVwBwCw3XxGOoMBFjO--F1WxInhgg2flxaMqoudyrVaU_Ckc7Df8P_8ztNDVKIxGzvZPiRdNHS2BDf0_oTFgILJYbVAr7zux1JCZToGMEjX8T6GCEvEnqOzlgl5Gol_InwpmC9rc_"
    return fetch(`https://www.googleapis.com/drive/v3/about?fields=user&access_token=${accessToken}`)
        .then(res => res.json())
}