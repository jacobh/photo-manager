import sha1 from 'sha1';
import {readFileSync} from 'fs';

export function hashFilePath(path) {
  const data = readFileSync(path);
  return sha1(data);
}
