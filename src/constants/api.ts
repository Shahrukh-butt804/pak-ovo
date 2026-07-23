const { hostname } = window.location;

const servers = {
  local: "http://localhost:3000",
  live: "https://api.pakovo.com",
};

var URL;
if (hostname.includes("pakovo.com")) URL = servers.live;
else URL = servers.live;

export const SOCKET_URL = `${URL}`;
export const UPLOADS_URL = URL + "/";
export const BASE_URL = URL + "/api/v1";
