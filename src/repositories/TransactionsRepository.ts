import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

enum TypeTransaction {
  income = 'income',
  outcome = 'outcome',
}

interface CreateTransaction {
  title: string;
  value: number;
  type: TypeTransaction.income | TypeTransaction.outcome;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  private getBalanceType(type: TypeTransaction): number {
    return this.transactions
      .filter(transaction => transaction.type === type)
      .reduce((pre, cur) => pre + cur.value, 0);
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeValue = this.getBalanceType(TypeTransaction.income);
    const outcomeValue = this.getBalanceType(TypeTransaction.outcome);

    const total = incomeValue - outcomeValue;

    const balance: Balance = {
      income: incomeValue,
      outcome: outcomeValue,
      total,
    };

    return balance;
  }

  public create({ title, value, type }: CreateTransaction): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();

    if (type === TypeTransaction.outcome && total < value) {
      throw Error('Insufficient funds.');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
