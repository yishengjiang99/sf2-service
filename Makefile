all:
    docker run --rm \
        -v $(pwd):/src \
        -u $(id -u):$(id -g) \
        emscripten/emsdk \
        emcc pdta.c -Oz -o pdta.js \
        -s EXTRA_EXPORTED_RUNTIME_METHODS=['ccall','AsciiToString'] \
        -s EXPORTED_FUNCTIONS=['_filterForZone','_malloc','_free','_loadpdta','_shdrref','_presetRef',"_findPreset"] \
        -s INITIAL_MEMORY=64mb              \
        -s USE_ES6_IMPORT_META=0 \
        -s ENVIRONMENT=web \
        --js-library=lib.js \
        -s MODULARIZE=1 \
        -s SINGLE_FILE=1 \
        -s EXIT_RUNTIME=1 \
        -s EXPORT_ES6=1 