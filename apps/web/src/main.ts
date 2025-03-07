import route from "./routing";
import { listDirectory } from "./socket";

void listDirectory(route).then(data => {
  console.log(data);
});
