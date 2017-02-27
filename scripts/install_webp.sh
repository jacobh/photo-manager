cd bin

wget https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-0.6.0-rc3.tar.gz
tar xf libwebp-0.6.0-rc3.tar.gz
rm libwebp-0.6.0-rc3.tar.gz

mv libwebp-0.6.0-rc3 libwebp

cd libwebp
./configure
make
