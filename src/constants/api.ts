const { hostname } = window.location;

const servers = {
  local: "http://localhost:3000",
  live: "https://pakovo.pk",
};

var URL;
if (hostname.includes("pakovo.pk")) URL = servers.live;
else URL = servers.local;

export const SOCKET_URL = `${URL}`;
export const UPLOADS_URL = URL + "/";
export const BASE_URL = URL + "/api/v1";
