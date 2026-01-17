#include "Solver.h"
#include <utility>
#include <set>
#include <string>
#include <vector>

Solver::Solver(Dict& d) : dict(d){
}

std::set<FoundWord> Solver::getFoundWords(Board &board) {
    std::string currPrefix = "";
    std::vector<std::pair<int, int>> currPath;
    Dict::Node* root = dict.getRoot();
    std::set<FoundWord> wordsFound;

    // std::cout << "!" << board.getRowCount() << " " << board.getColCount() << "\n";

    for (int r = 0; r < board.getRowCount(); r++) {
        for (int c = 0; c < board.getColCount(); c++) {
            dfs(r, c, root, currPrefix, board, wordsFound, currPath);
        }
    }

    return wordsFound;

}


void Solver::dfs(int row, int col, Dict::Node* currNode, std::string& currPrefix, Board& board, std::set<FoundWord> &wordsFound, std::vector<std::pair<int, int>> &currPath) {
    std::string cellStr = board.getCellValue(row, col);

    Dict::Node* next = currNode;

    for (char ch : cellStr) {
        int idx = ch - 'a';
        if (idx < 0 || idx >= 26) return;
        next = next->letterPointers[idx];
        if (!next) return;  // ex: ensures both "q" and "u" are in path for "qu"
    }

    // mark visited
    board.markVisited(row, col);

    currPath.emplace_back(row, col);
    currPrefix += cellStr;

    if (next->isWord) {
        wordsFound.insert(FoundWord(currPrefix, next->definition, currPath));
    }

    for (const std::pair<int, int>& move : moves) {
        int nextRow = move.first + row;
        int nextCol = move.second + col;

        // checks if in-bounds and not-visited
        if (board.isValidMove(nextRow, nextCol)) {
            dfs(nextRow, nextCol, next, currPrefix, board, wordsFound, currPath); 
        }
    }

    // backtrack
    currPrefix.resize(currPrefix.size() - cellStr.size());
    currPath.pop_back();

    board.setCellValue(row, col, cellStr);
}
