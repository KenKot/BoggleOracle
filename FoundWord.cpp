#include "FoundWord.h"
#include <iostream>

FoundWord::FoundWord( std::string &word, const std::string &definition, const std::vector<std::pair<int, int>> &path) {
    this->word = word;
    this->definition = definition;
    this->path = path;
    this->wordLen = word.length();
    this->score = calcScore();
}

void FoundWord::print() const {
    std::cout << word << " " << score << "pts - " << definition;

    for (auto& coord : path)
        std::cout << " (" << coord.first << ", " << coord.second << ") ";

    std::cout << std::endl;

}

bool FoundWord::operator<(const FoundWord& other) const {
    return word < other.word;
}

int FoundWord::calcScore(){
    if (wordLen < 3) {
        return 0;
    } else if (wordLen == 3 || wordLen == 4) {
        return 1;
    } else if (wordLen == 5) {
        return 2;
    } else if (wordLen == 6) {
        return 3;
    } else if (wordLen == 7) {
        return 5;
    } else {
        // 8 or more is 11 points
        return 11;
    }
}

int FoundWord::getScore() const {
    return this->score;        
}

std::string FoundWord::getWord() const {
    return this->word;
}
std::string FoundWord::getDefinition() const {
    return this->definition;
}
const std::vector<std::pair<int, int>>& FoundWord::getPath() const {
    return this->path;
}


