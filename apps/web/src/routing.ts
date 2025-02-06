import { asciiPath } from "./socket";

let route = "/";

function redirect(path: string) {
  document.location.hash = `#${asciiPath(path)}`;
  route = path;
}

if (!document.location.hash) {
  redirect("/");
}

route = document.location.hash.slice(1);
let routeIsValid = true;

for (let index = 0; index < route.length; index++) {
  const code = route.codePointAt(index) ?? 0;
  if (code < 97 || code > 112) {
    routeIsValid = false;
    break;
  }
}

if (!route || !routeIsValid) {
  redirect("/");
}

export default route;
