#include "Dict.h"
#include <stdexcept>

Dict::Dict(const std::string& filename) {
    root = new Node();
    loadDictFile(filename);
}

void Dict::loadDictFile(const std::string& filename) {
    std::ifstream inputFile;
    inputFile.open(filename);

    if (!inputFile) {
        std::cerr << "Unable to load file";
        return;
    }

    std::string line; // abaft: Toward the stern; aft; as to go
    std::string word;
    std::string definition;
    // int delimiterIndex;

while (std::getline(inputFile, line)) {
    std::size_t delimiterIndex = line.find(TXT_FILE_DELIMITER);

    if (delimiterIndex == std::string::npos) {
        std::cerr << "Skipping malformed line: " << line << std::endl;
        continue;
    }

    word = line.substr(0, delimiterIndex);
    definition = line.substr(delimiterIndex + 1);

    addWord(word, definition);
}

    inputFile.close();
}

void Dict::addWord(const std::string& word, const std::string& definition) {
    Node* curr = root;

    for (int i = 0; i < word.size(); i++) {
        int nodeIndex = int(word[i]) - a_CHAR_CODE;

        if (nodeIndex < 0 || nodeIndex >= CHAR_LEN) {
            throw std::runtime_error("Letter index not within 0-25");
        }

        if (curr->letterPointers[nodeIndex] == nullptr) {
            Node* newNode = new Node();
            curr->letterPointers[nodeIndex] = newNode;
            curr = newNode;
        } else {
            curr = curr->letterPointers[nodeIndex];
        }

        if (i == word.size() - 1) {
            curr->isWord = true;
            curr->definition =  definition;
            wordCount++;
        }
    }
}


int Dict::getWordCount() const { return wordCount; }
Dict::Node* Dict::getRoot() const { return root; }

void Dict::destroy(Node* node) {
    if (node == nullptr) return;

    for (int i = 0; i < CHAR_LEN; i++) {
        destroy(node->letterPointers[i]);
    }

    delete node;
}

Dict::~Dict() {
    destroy(root);
}
