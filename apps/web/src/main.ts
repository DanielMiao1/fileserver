import route from "./routing";
import { isFile, listDirectory } from "./socket";

void isFile(route).then(is_file => {
  if (is_file) {
    //
  } else {
    void listDirectory(route).then(dir_items => {
      console.log(dir_items);
    });
  }
});
