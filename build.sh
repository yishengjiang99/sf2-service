docker run --rm -v $(pwd):/src -w /src -u $(id -u):$(id -g) emscripten/emsdk:6.0.10 \
emcc sf2.c -O3 -o build/pdta.js \
-s EXPORTED_RUNTIME_METHODS=['ccall','AsciiToString','HEAPU8','HEAPU32'] \
-s EXPORTED_FUNCTIONS=['_malloc','_free','_loadpdta','_shdrref','_instRef','_presetRef','_findPreset','_sf2_zones_for'] \
-s INITIAL_MEMORY=67108864              \
-s ENVIRONMENT=web \
--js-library=lib.js \
-s MODULARIZE=1 \
-s SINGLE_FILE=1 \
-s EXIT_RUNTIME=1 \
-s EXPORT_ES6=1
