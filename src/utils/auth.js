export function getToken() {
  return localStorage.AuthToken
}

export function getJWT() {
  let tks = localStorage.AuthToken.split(".");
  return JSON.parse(Base64decode(tks[1]));
}

export function setToken(token) {
  localStorage.setItem("AuthToken", token)


  localStorage.setItem("UserName", getJWT().payload.name)
}

export function removeToken() {
  localStorage.removeItem("AuthToken")
}

function Base64decode(str) {
  return Buffer.from(str, 'base64').toString('ascii');
}
