// RecursiveParser enhancement
// Maceo Bramante

#include <iostream>
#include <string>
#include <vector>
#include <cctype>
using namespace std;

// --------------------- Token Definitions ---------------------

// Types of tokens the program can read
enum TokenType {
    NUMBER,
    IDENTIFIER,
    PLUS, MINUS, STAR, SLASH,
    LPAREN, RPAREN,
    END,
    INVALID
};

// Holds a token and its text
struct Token {
    TokenType type;
    string lexeme;
};

struct TokenQueue {
    vector<Token> data;
    int frontIndex = 0;

    // Puts a token into the queue
    void enqueue(Token t) {
        data.push_back(t);
    }

    // Returns the next token and removes it
    Token dequeue() {
        if (frontIndex >= data.size()) return { END, "" };
        return data[frontIndex++];
    }

    // Returns the next token without removing it
    Token peek() {
        if (frontIndex >= data.size()) return { END, "" };
        return data[frontIndex];
    }

    // Clears the queue
    void clear() {
        data.clear();
        frontIndex = 0;
    }
};

TokenQueue tokenStream;   // Global queue of tokens
Token currentToken;       // The current token

//Prototype functions
bool expr();
bool term();
bool factor();
void getNextToken();
void tokenize(string input);

// Returns true if the char can start an identifier
bool isAlphaStart(char c) {
    return (isalpha(c) || c == '_');
}

// Returns true if the char can appear inside an identifier
bool isAlphaNum(char c) {
    return (isalnum(c) || c == '_');
}

// Converts the input string into a set of tokens in the queue
void tokenize(string input) {
    tokenStream.clear();
    int i = 0;
    int n = input.size();

    while (i < n) {
        char c = input[i];

        // Skip spaces
        if (c == ' ') {
            i++;
            continue;
        }

        // Reads a number
        if (isdigit(c)) {
            string num = "";
            while (i < n && isdigit(input[i])) {
                num += input[i++];
            }
            tokenStream.enqueue({ NUMBER, num });
            continue;
        }

        // Reads an identifier
        if (isAlphaStart(c)) {
            string id = "";
            while (i < n && isAlphaNum(input[i])) {
                id += input[i++];
            }
            tokenStream.enqueue({ IDENTIFIER, id });
            continue;
        }

        // Reads operators and parentheses
        switch (c) {
        case '+': tokenStream.enqueue({ PLUS, "+" }); break;
        case '-': tokenStream.enqueue({ MINUS, "-" }); break;
        case '*': tokenStream.enqueue({ STAR, "*" }); break;
        case '/': tokenStream.enqueue({ SLASH, "/" }); break;
        case '(': tokenStream.enqueue({ LPAREN, "(" }); break;
        case ')': tokenStream.enqueue({ RPAREN, ")" }); break;
        default:
            tokenStream.enqueue({ INVALID, string(1, c) });
            break;
        }
        i++;
    }

    // End-of-input marker
    tokenStream.enqueue({ END, "" });
}

// Loads the next token from the queue
void getNextToken() {
    currentToken = tokenStream.dequeue();
}

//Parser Functions

// factor = NUMBER | IDENTIFIER | '(' expr ')'
bool factor() {

    // Handles numbers
    if (currentToken.type == NUMBER) {
        getNextToken();
        return true;
    }

    // Handles identifiers
    if (currentToken.type == IDENTIFIER) {
        getNextToken();
        return true;
    }

    // Handles parentheses
    if (currentToken.type == LPAREN) {
        getNextToken();            // '('
        if (!expr()) return false; // inner expression
        if (currentToken.type != RPAREN) return false; // missing ')'
        getNextToken();
        return true;
    }

    // Not a valid factor
    return false;
}

// term = factor [ ('+' or '/') factor ]
bool term() {

    if (!factor()) return false;

    // If the next token is + or /
    if (currentToken.type == PLUS || currentToken.type == SLASH) {
        getNextToken();
        if (!factor()) return false;
    }

    return true;
}

// expr = term [ ('*' or '-') term ]
bool expr() {

    if (!term()) return false;

    // If the next token is * or -
    if (currentToken.type == STAR || currentToken.type == MINUS) {
        getNextToken();
        if (!term()) return false;
    }

    return true;
}

int main() {
    string input;

    cout << "Enter a sentence(Enter to quit): ";
    getline(cin, input);

    while (input != "") {

        // Turns the input into a list of tokens
        tokenize(input);

        // Loads the first token
        getNextToken();

        // Input is valid if expr returns true and all tokens are used
        bool valid = expr() && currentToken.type == END;

        if (valid)
            cout << "'" << input << "' is a valid sentence" << endl;
        else
            cout << "'" << input << "' is not a valid sentence" << endl;

        cout << "Enter a sentence(Enter to quit): ";
        getline(cin, input);
    }

    return 0;
}