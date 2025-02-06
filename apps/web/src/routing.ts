function redirect(path: string) {
  document.location.hash = `#${path}`;
}

if (!document.location.hash) {
  redirect("/");
}

const route = document.location.hash.slice(1);

if (!route) {
  redirect("/");
}

export default route;
