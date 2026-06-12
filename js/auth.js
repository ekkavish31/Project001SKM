
const msalConfig = {
  auth: {
    clientId: "8958a680-e0dd-44fb-8e03-8dd22ce9ca5c",
    authority: "https://login.microsoftonline.com/11a557d2-03b9-4a8b-8d52-aaef38d6c15b",
    redirectUri: "https://victorious-stone-0d9572810.7.azurestaticapps.net/"
  }
};

const loginRequest = {
  scopes: ["User.Read"]
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

async function signIn() {
  try {
    const loginResponse = await msalInstance.loginPopup(loginRequest);
    console.log("Login success:", loginResponse);

    const account = loginResponse.account;

    const tokenResponse = await msalInstance.acquireTokenSilent({
      scopes: ["User.Read"],
      account: account
    });

    console.log("Access token:", tokenResponse.accessToken);

    // เรียก Graph API
    const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: "Bearer " + tokenResponse.accessToken
      }
    });

    const profile = await profileRes.json();
    console.log("Profile:", profile);

    alert("Welcome: " + profile.displayName);

  } catch (err) {
    console.error(err);
    alert("Login failed");
  }
}
