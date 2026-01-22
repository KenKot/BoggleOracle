all:
	em++ cpp/Board.cpp cpp/Dict.cpp cpp/FoundWord.cpp cpp/Solver.cpp cpp/DictMain.cpp \
		-O3 \
		-s MODULARIZE=1 -s EXPORT_ES6=1 -s ENVIRONMENT=web \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s EXPORTED_FUNCTIONS='["_main","_solveBoard","_malloc","_free"]' \
		-s EXPORTED_RUNTIME_METHODS='["FS","callMain","ccall","lengthBytesUTF8","stringToUTF8", "UTF8ToString"]' \
		-std=c++17 \
		--preload-file dictionaries@/dictionaries \
		-o web/boggle.js

updateGitPreview:
	cp -R web/* docs/

clean:
	rm -f web/boggle.js web/boggle.wasm web/boggle.data

