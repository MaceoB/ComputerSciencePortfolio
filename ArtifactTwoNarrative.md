# ENHANCEMENT TWO

This artifact is a recursive parser that is compiled in the C++ language, that takes in a string of tokens and applies them to a grammar, structured off of fifteen different rules with different non terminals and terminals. Below is the grammar I used to structure the scope of my artifact: 

- expr ::=  term *  term 
- expr ::=  term -  term 
-  expr ::=  term 
- term ::= factor /  factor 
- term ::= factor +  factor 
- term ::=  factor 
- factor ::=  identifier | number | ( expr) 
- identifier ::=  alpha  alphanumrest | alpha 
- alpha ::= a | b | c | ... | y | z | A | B | C | ... | Y | Z | _ 
- alphanumrest ::= alphanum alphanumrest | alphanum 
- alphanum ::= alpha | digit 
- number ::=  nonzerodigit  rest | digit 
- rest ::=  digit  rest |  digit 
- nonzerodigit ::= 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
- digit ::= 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 



## Enhancement Description

The implementation of the code is low level functional programming that assigns each of the rules with their own function, followed by another function that increments the index for the lexeme, while skipping spaces.

The user engages in a while loop that asks them to enter sentences that are parsed, checked, and a true or false output would be displayed if the sentence is valid or not.

What it means for the sentence to be valid is if it the terminal signs are correct and in the right order. This means that parentheses statements with a hanging symbol are invalid, or the percentage character could be invalid because its not a terminal sign.

The valid terminal signs are: */+-()_ and every number and letter. Some of these will recursively call themselves if they are allowed to recognize multiple characters as parts of a whole rule.

After all functions have been called through each token or lexeme, the main function will print the end result.

### Quality of Life Features

I chose to use a last in first out queue for my tokenizer, that uses built in vector data types to dynamically store the tokens from the input, then remove the front, to select and validate the next token, rather than using floating string and index values that are not secured and encapsulated. 

```
struct TokenQueue {
    vector Token data;
    int frontIndex = 0;

    // Puts a token into the queue
    void enqueue(Token t) {
        data.push_back(t);
    }

    // Returns the next token and removes it
    Token dequeue() {
        if (frontIndex = data.size()) return { END, "" };
        return data[frontIndex++];
    }

    // Returns the next token without removing it
    Token peek() {
        if (frontIndex = data.size()) return { END, "" };
        return data[frontIndex];
    }

    // Clears the queue
    void clear() {
        data.clear();
        frontIndex = 0;
    }
};
```

## Challenges and Reflections

The artifact and its enhancement show my competency in data structures and algorithms as I enhanced my project’s old tokenizer that uses a string and an index, into a newer tokenizer that returns the phrase in a queue.

The queue was also custom made to handle enum data types that are used for the app to recognize the type of terminal character that has been used.

Building a queue from scratch was a lower-level approach to highlight my understanding of how a queue is supposed to be structured.

I was originally going to implement my own variation of the app that uses a stack; some challenges I ran into regarding that was the scope.

Using a stack for a bottom up parsing algorithm was going to involve the same the enum values that represented the rules of a grammar, however, the logic would force me to rebuild my app from the ground up, because recursive parsing uses different logic from bottom up parsing, and I would need to have some older logic to further pronounce my enhancement.

## Conclusion

While there is more to go over when it comes to general competency of Data Structures and algorithms, I at least utilized an abstract data type that would prove the outcomes I needed from the program’s course, Data Structures and Algorithms. 
