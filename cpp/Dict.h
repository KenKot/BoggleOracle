#ifndef DICT_H
#define DICT_H

#include <fstream>
#include <iostream>
#include <string>

#define CHAR_LEN 26
#define a_CHAR_CODE 97
#define TXT_FILE_DELIMITER ":"

class Dict {
   public:
    Dict(const std::string&);
    ~Dict();

    int getWordCount() const;

    class Node {
       public:
        bool isWord = false;
        std::string definition = "";
        Node* letterPointers[CHAR_LEN];

        Node() {
            for (int i = 0; i < CHAR_LEN; i++) {
                letterPointers[i] = nullptr;
            }
        }
    };

    Dict::Node* getRoot() const;

   private:
    int wordCount = 0;
    Node* root = nullptr;

    void loadDictFile(const std::string&);
    void addWord(const std::string&, const std::string&);

    void destroy(Node* root);
};

#endif
