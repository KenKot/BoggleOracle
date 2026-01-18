#include "Board.h"

#include <iostream>
#include <string>
#include <vector>

// TODO: consider deep copy or not
Board::Board(std::vector<std::vector<std::string>> board) {
    this->rows = board.size();
    this->cols = board[0].size();
    this->board = board;
    // std::cout << "board constuctor: row: " << this->rows << "cols: " <<
    // this->cols << "\n";
}

std::string Board::getCellValue(int r, int c) const { return board[r][c]; }

void Board::setCellValue(int r, int c, std::string newStr) {
    board[r][c] = newStr;
}

void Board::markVisited(int r, int c) {
    board[r][c] = "*";
    return;
}

bool Board::isVisited(int r, int c) const {
    if (board[r][c] == "*") return true;
    return false;
}

bool Board::isValidMove(int r, int c) const {
    if (!isInBounds(r, c)) return false;
    if (isVisited(r, c)) return false;
    return true;
}

bool Board::isInBounds(int r, int c) const {
    if (r < 0 || r >= rows) return false;
    if (c < 0 || c >= cols) return false;

    return true;
}

int Board::getRowCount() const { return rows; }

int Board::getColCount() const { return cols; }

void Board::printBoard() const {
    std::cout << "\n";
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            std::cout << board[r][c] << " ";

            // for good formatting for both 1 and 2 length squares
            if (board[r][c].size() == 1) std::cout << " ";
        }
        std::cout << "\n";
    }
    std::cout << "\n";
}
