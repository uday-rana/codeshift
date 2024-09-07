#include <iostream>
#include <string>

class BankAccount {
private:
    std::string accountHolder;
    double balance;

public:
    // Constructor
    BankAccount(std::string holder, double initialBalance) {
        accountHolder = holder;
        balance = initialBalance;
    }

    // Deposit method
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            std::cout << "Successfully deposited $" << amount << "." << std::endl;
        } else {
            std::cout << "Invalid deposit amount!" << std::endl;
        }
    }

    // Withdraw method
    void withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            std::cout << "Successfully withdrew $" << amount << "." << std::endl;
        } else if (amount > balance) {
            std::cout << "Insufficient balance!" << std::endl;
        } else {
            std::cout << "Invalid withdrawal amount!" << std::endl;
        }
    }

    // Check balance
    void checkBalance() {
        std::cout << "Current balance: $" << balance << std::endl;
    }

    // Get account holder's name
    std::string getAccountHolder() {
        return accountHolder;
    }
};

int main() {
    std::string name;
    double initialDeposit;

    // Get user input
    std::cout << "Enter account holder's name: ";
    std::getline(std::cin, name);
    std::cout << "Enter initial deposit amount: ";
    std::cin >> initialDeposit;

    // Create a bank account object
    BankAccount account(name, initialDeposit);
    std::cout << "Account created for " << account.getAccountHolder() << " with initial balance of $" << initialDeposit << std::endl;

    int choice;
    double amount;

    // Simple menu system
    do {
        std::cout << "\n--- Bank Menu ---" << std::endl;
        std::cout << "1. Deposit" << std::endl;
        std::cout << "2. Withdraw" << std::endl;
        std::cout << "3. Check Balance" << std::endl;
        std::cout << "4. Exit" << std::endl;
        std::cout << "Choose an option: ";
        std::cin >> choice;

        switch (choice) {
            case 1:
                std::cout << "Enter amount to deposit: ";
                std::cin >> amount;
                account.deposit(amount);
                break;
            case 2:
                std::cout << "Enter amount to withdraw: ";
                std::cin >> amount;
                account.withdraw(amount);
                break;
            case 3:
                account.checkBalance();
                break;
            case 4:
                std::cout << "Exiting the program." << std::endl;
                break;
            default:
                std::cout << "Invalid choice. Please try again." << std::endl;
        }
    } while (choice != 4);

    return 0;
}
