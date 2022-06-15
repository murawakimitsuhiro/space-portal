const credential = {
    client_id: "685685356056-ovt7sh0d7ane00eek739s1ka3mecdqtu.apps.googleusercontent.com",
    client_secret: "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",
    redirect_uri: "https://pfpijbphlehdhcfcfjdenkfnncjiilmn.chromiumapp.org",
}

const scope = "https://www.googleapis.com/auth/drive"

interface GoogleAuthParam {
    state: string,
    access_token: string,
    token_type: string,
    expires_in: string,
    scope: string,
}

const googleAuthStrage = {
    get: async (): Promise<GoogleAuthParam> => {
        return await new Promise(resolve => {
            chrome.storage.sync.get(['googleAuth'], result => resolve(result as GoogleAuthParam))
        })
    },
    set: async (value: GoogleAuthParam): Promise<GoogleAuthParam> => {
        return await new Promise(resolve => {
            chrome.storage.sync.set({ googleAuth: value }, () => resolve(value))
        })
    },
};

export const authGoogle = async (): Promise<GoogleAuthParam> => {
    return await new Promise<GoogleAuthParam>((resolve, reject) => {
        chrome.identity.launchWebAuthFlow({
            url: oauth2UrlEndpoint(),
            interactive: true
        }, (redirectUrl?: string) => {
            if (redirectUrl) {
                const search = redirectUrl.split('#')[1]
                const newAuthParam = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
                resolve(newAuthParam as GoogleAuthParam)
            } else {
                reject('Google Auth Failed. ')
            }
        })
    })
    .then(googleAuthStrage.set)
}

const oauth2UrlEndpoint = () => {
    const enc = encodeURIComponent
    return `https://accounts.google.com/o/oauth2/v2/auth?
scope=${enc(scope)}&
include_granted_scopes=true&
response_type=token&
state=${enc('spaceportal0616')}&
redirect_uri=${enc(credential.redirect_uri)}&
client_id=${enc(credential.client_id)}&
prompt=consent`
}
