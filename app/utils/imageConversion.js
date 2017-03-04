import { exec } from "child_process";
import { unlink } from "fs";

export async function rawToTiff(sourcePath) {
  return new Promise((resolve, reject) => {
    exec(`nice -20 ./bin/libraw/bin/dcraw_emu -W -T "${sourcePath}"`, err => {
      if (err) {
        reject(err);
      } else {
        resolve(`${sourcePath}.tiff`);
      }
    });
  });
}

export async function tiffToWebp(tiffPath) {
  return new Promise((resolve, reject) => {
    exec(
      `nice -20 ./bin/libwebp/examples/cwebp \
        -preset photo \
        -q 80 \
        -m 6 \
        "${tiffPath}" \
        -o "${tiffPath}.webp"
      `,
      err => {
        if (err) {
          reject(err);
        } else {
          resolve(`${tiffPath}.webp`);
        }
      }
    );
  });
}

export async function rawToWebp(sourcePath) {
  const tiffPath = await rawToTiff(sourcePath);
  const webpPath = await tiffToWebp(tiffPath);
  return new Promise((resolve, reject) => {
    unlink(`${sourcePath}.tiff`, err => {
      if (err) {
        reject(err);
      } else {
        resolve(webpPath);
      }
    });
  });
}
