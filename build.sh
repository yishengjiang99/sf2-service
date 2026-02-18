docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk \
emcc sf2.c -O3 -o pdta.js \
-s EXPORTED_RUNTIME_METHODS=['ccall','AsciiToString'] \
-s EXPORTED_FUNCTIONS=['_malloc','_free','_loadpdta','_shdrref','_instRef','_presetRef',"_findPreset"] \
-s INITIAL_MEMORY=64mb              \
-s ENVIRONMENT=web \
--js-library=lib.js \
-s MODULARIZE=1 \
-s SINGLE_FILE=1 \
-s EXIT_RUNTIME=1 \
-s EXPORT_ES6=1
