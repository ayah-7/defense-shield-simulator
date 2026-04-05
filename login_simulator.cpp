#include <iostream>
#include <string>
#include <unistd.h>

using namespace std;

string gethiddenpassword() {
    char* pwd = getpass("Enter password: ");
    return string(pwd);
}

string gethidden2facode() {
    char* code = getpass("Enter 2FA code: ");
    return string(code);
}

struct User {
    string username;
    string password;
    string twoFAcode;
    string securityQuestion;
    string securityAnswer;
    int failedLoginAttempts;
    bool isLocked;
};

void handleFailure(User& user, const string& message) {
    user.failedLoginAttempts++;
    cout << message << "\n";
    cout << "Failed login attempts: " << user.failedLoginAttempts << "\n";
    if (user.failedLoginAttempts >= 3) {
        user.isLocked = true;
        cout << "Too many failed login attempts. Account is locked.\n";
    }
} 

bool userLocked(User& user) {
    if (user.isLocked) {
        cout << "Your account is locked. Please contact support.\n";
        exit(0);
    }
    return false;
}

bool usernameCorrect = false;
bool passwordCorrect = false;
bool twoFACorrect = false;

int main() {
    User user = {
        "Mia", 
        "c0mp14x_password", 
        "27892", 
        "What is the name of your first pet?", 
        "Fluffy", 
        0, 
        false
    };

    while(!user.isLocked) {
        string username;
        cout << "Username: ";
        cin >> username;

        if (username != user.username) {
            handleFailure(user, "Incorrect username.");
            continue;
        }
        string password = gethiddenpassword();
        if (password != user.password) {
            handleFailure(user, "Incorrect password.");
            continue;
    }
        if(user.failedLoginAttempts >= 1){
            string code = gethidden2facode();
            if (code != user.twoFAcode) {
                handleFailure(user, "Incorrect 2FA code.");
                continue;
        }
    }

        if(user.failedLoginAttempts >= 2){
            string answer;
            cout << user.securityQuestion << " ";
            cin >> answer;
            if (answer != user.securityAnswer) {
                handleFailure(user, "Incorrect security answer.");
                continue;
        }
    }
        cout << "Login successful! Welcome, " << user.username << ".\n";
        return 0;
    }
    cout << "Your account is locked. Please contact support.\n";
    return 0;
}
    
