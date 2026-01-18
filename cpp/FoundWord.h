#ifndef FOUNDWORD_H
#define FOUNDWORD_H

#include <string>
#include <vector>

class FoundWord {
   public:
    FoundWord( std::string &word, const std::string &definition, const std::vector<std::pair<int, int>> &path);

    // to use in 'std::set'
    bool operator<(const FoundWord& other) const;

    void print() const;
    int getScore() const;
    std::string getWord() const;
    std::string getDefinition() const;
    const std::vector<std::pair<int, int>>& getPath() const; 

   private:
    std::string word;
    std::string definition;
    std::vector<std::pair<int, int>> path;

    int wordLen;
    int score;
    int calcScore();
};

#endif
