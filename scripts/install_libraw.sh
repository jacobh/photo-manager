mkdir _libraw_install
cd bin

wget http://www.libraw.org/data/LibRaw-0.18.1.tar.gz
wget http://www.libraw.org/data/LibRaw-demosaic-pack-GPL2-0.18.1.tar.gz
wget http://www.libraw.org/data/LibRaw-demosaic-pack-GPL3-0.18.1.tar.gz

tar xf LibRaw-0.18.1.tar.gz
tar xf LibRaw-demosaic-pack-GPL2-0.18.1.tar.gz
tar xf LibRaw-demosaic-pack-GPL3-0.18.1.tar.gz

mv LibRaw-0.18.1 libraw
cd libraw
./configure --enable-demosaic-pack-gpl2 --enable-demosaic-pack-gpl3
make
