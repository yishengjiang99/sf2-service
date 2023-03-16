docker run \
--rm \
-v $(pwd):/src \
-u $(id -u):$(id -g) \
emscripten/emsdk \
emcc pdta.c -o pdta.js