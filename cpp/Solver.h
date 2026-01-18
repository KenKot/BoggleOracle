#ifndef SOLVER_H
#define SOLVER_H

#include <set>
#include <string>
#include <vector>

#include "Board.h"
#include "Dict.h"
#include "FoundWord.h"

class Solver {
   public:
    Solver(Dict& d);
    std::set<FoundWord> getFoundWords(Board& board);

    void dfs(int row, int col, Dict::Node* currNode, std::string& currPrefix, Board& board, std::set<FoundWord>& wordsFound, std::vector<std::pair<int, int>>& currPath);

   private:
    Dict& dict;
    // up, up-right, right, down-right, down, down-left, left, up-left
    static inline constexpr std::pair<int, int> moves[8] = {{-1, 0}, {-1, 1}, {0, 1}, {1, 1},  {1, 0}, {1, -1}, {0, -1}, {-1, -1} };

};

#endif
