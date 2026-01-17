#ifndef BOARD_H
#define BOARD_H

#include <vector>
#include <string>

class Board {
public:
    Board(std::vector<std::vector<std::string>> board);

    int getRowCount() const;
    int getColCount() const;
    bool isInBounds(int r, int c) const;
    bool isVisited(int r, int c) const;
    bool isValidMove(int r, int c) const;

    void printBoard() const;

    std::string getCellValue(int r, int c) const;
    void setCellValue(int r, int c, std::string);

    void markVisited(int r, int c);

private:
    int rows;
    int cols;
    std::vector<std::vector<std::string>> board;



};

#endif
