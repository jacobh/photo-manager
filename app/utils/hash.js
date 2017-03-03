import sha1 from "sha1";
import { readFile } from "fs";

export function hashFilePath(path) {
  return new Promise(resolve => {
    readFile(path, (err, data) => {
      const hash = sha1(data);
      resolve(hash);
    });
  });
}
