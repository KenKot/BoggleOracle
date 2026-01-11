all:
	em++ Board.cpp Dict.cpp FoundWord.cpp Solver.cpp DictMain.cpp \
		-O3 \
		-s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT=web \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s EXPORTED_FUNCTIONS='["_main","_solveBoard","_malloc","_free"]' \
		-s EXPORTED_RUNTIME_METHODS='["FS","callMain","ccall","lengthBytesUTF8","stringToUTF8", "UTF8ToString"]' \
		-std=c++17 \
		--preload-file dictionaries@/dictionaries \
		-o web/src/boggle.js

clean:
	rm -f web/src/boggle.js web/src/boggle.wasm web/src/boggle.data

