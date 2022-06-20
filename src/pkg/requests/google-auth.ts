const scope = "https://www.googleapis.com/auth/drive"

export const getGoogleToken = async (authorizeIfNeeded: boolean = true): Promise<string> => {
    const { access_token } = await googleAuthStrage.get()
    if (access_token) return access_token
    const authorized = await authGoogle()
    return authorized.access_token
}

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

const authGoogle = async (): Promise<GoogleAuthParam> => {
    return await new Promise<GoogleAuthParam>((resolve, reject) => {
        const datehash = (+new Date).toString(36)
        chrome.identity.launchWebAuthFlow({
            url: oauth2UrlEndpoint(datehash),
            interactive: true
        }, (redirectUrl?: string) => {
            if (redirectUrl) {
                const search = redirectUrl.split('#')[1]
                const newAuthParam: GoogleAuthParam = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
                if (newAuthParam.state !== datehash) reject('Invalid state')
                resolve(newAuthParam as GoogleAuthParam)
            } else {
                reject('Google Auth Failed. ')
            }
        })
    })
    .then(googleAuthStrage.set)
}

const oauth2UrlEndpoint = (state: string) => {
    const credential = {
        client_id : "685685356056-ovt7sh0d7ane00eek739s1ka3mecdqtu.apps.googleusercontent.com",
        redirect_uri : "https://pfpijbphlehdhcfcfjdenkfnncjiilmn.chromiumapp.org",
    }
    const enc = encodeURIComponent
    return `https://accounts.google.com/o/oauth2/v2/auth?
scope=${enc(scope)}&
include_granted_scopes=true&
response_type=token&
state=${enc(state)}&
redirect_uri=${enc(credential.redirect_uri)}&
client_id=${enc(credential.client_id)}`
}
// loginのtestをするとき
// &prompt=consent&`
