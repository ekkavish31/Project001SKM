// ==========================================
// MSAL CONFIG
// ==========================================
const msalConfig = {
  auth: {
    clientId: "8958a680-e0dd-44fb-8e03-8dd22ce9ca5c",
    authority: "https://login.microsoftonline.com/11a557d2-03b9-4a8b-8d52-aaef38d6c15b",
    redirectUri: "https://victorious-stone-0d9572810.7.azurestaticapps.net/"
  }
};

const loginRequest = {
  scopes: ["User.Read", "Files.ReadWrite"]
};

const msalInstance = new msal.PublicClientApplication(msalConfig);

// ==========================================
// LOGIN + TEST GRAPH
// ==========================================
async function signIn() {
  try {
    // Step 1: Login
    const loginResponse = await msalInstance.loginPopup(loginRequest);
    const account = loginResponse.account;
    console.log("Login OK:", account);

    // Step 2: Get token
    const tokenResponse = await msalInstance.acquireTokenSilent({
      scopes: ["User.Read", "Files.ReadWrite"],
      account: account
    });
    console.log("Token OK:", tokenResponse.accessToken);

    // Step 3: Test /me
    const meRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: "Bearer " + tokenResponse.accessToken
      }
    });
    const me = await meRes.json();
    console.log("ME =", me);

    // Step 4: List files
    const filesRes = await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
      headers: {
        Authorization: "Bearer " + tokenResponse.accessToken
      }
    });
    const files = await filesRes.json();
    console.log("FILES =", files);

    // Step 5: Alert result
    alert("Login: " + me.displayName + "\nFiles found: " + (files.value ? files.value.length : 0));

  } catch (err) {
    console.error("ERROR:", err);
    alert("Error: " + err.message);
  }
}
