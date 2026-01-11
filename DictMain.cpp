#include <iostream>
#include <string>
#include <vector>

#include "Dict.h"
#include "FoundWord.h"
#include "Solver.h"
#include "Board.h"

#include <cstdlib>
#include <cstring>

#include <emscripten/emscripten.h>

extern "C" {
EMSCRIPTEN_KEEPALIVE
char* solveBoard(const char** arr, int rows, int cols) {
    static Dict d2("/dictionaries/cleanDictDec.txt"); 
    static Solver s2(d2);
    std::vector<std::vector<std::string>> boardinput;

    for (int i = 0; i < rows; i++) {
        std::vector<std::string> row;
        for (int j = 0; j < cols; j++) {
            int idx = i * cols + j;
            std::string curr = arr[idx];
            row.emplace_back(curr);
        }
        boardinput.push_back(row);
    }

    Board b2(boardinput);


    std::set<FoundWord> answers = s2.getFoundWords(b2);
    int wordCount = answers.size();
    int maxScore = 0;

    for (auto word : answers) {
        maxScore += word.getScore();
        word.print();
    }



    // std::string json = "{\"names\":[\"dave\",\"fred\"]}";
    std::string json = "{";
    json += "\"wordCount\":\"" + std::to_string(wordCount) + "\",";
    json += "\"maxScore\":\"" + std::to_string(maxScore) + "\"";


    json += "}";


    char* out = (char*)malloc(json.size() + 1);
    std::memcpy(out, json.c_str(), json.size() + 1);
    return out;
}
}

int main(){
    std::cout << "main fired" << std::flush;
}
