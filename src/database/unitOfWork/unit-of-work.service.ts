import { Inject, Injectable } from "@nestjs/common";
import { IDatabase, ITask } from "pg-promise";

@Injectable()
export class UnitOfWorkIdentifier {
  constructor(@Inject("PG_CONNECTION") private readonly db: IDatabase<any>) {}

  /**
   * Creates a new Unit of Work context.
   * @returns A new instance of UnitOfWorkContext
   */
  createContext(): UnitOfWorkContext {
    return new UnitOfWorkContext(this.db);
  }
}

@Injectable()
export class UnitOfWorkContext {
  private transactionContext: ITask<any> | null = null;

  constructor(@Inject("PG_CONNECTION") private readonly db: IDatabase<any>) {}

  /**
   * Initializes the transaction context.
   */
  async initialize(): Promise<void> {
    if (this.transactionContext) {
      throw new Error("A transaction is already active.");
    }

    // Use db.tx to start a transaction
    this.transactionContext = await this.db.tx((tx) => tx); // Holds transaction context
  }

  /**
   * Executes a query within the transaction context.
   */
  async execute<T>(callback: (tx: ITask<any>) => Promise<T>): Promise<T> {
    if (!this.transactionContext) {
      throw new Error(
        "No transaction context found. Did you forget to call initialize?",
      );
    }

    return callback(this.transactionContext); // Use the active transaction context
  }

  /**
   * Commits the transaction.
   */
  async saveChanges(): Promise<void> {
    if (!this.transactionContext) {
      throw new Error(
        "No transaction context found. Did you forget to call initialize?",
      );
    }

    // Commit occurs automatically in pg-promise when the tx block completes
    this.transactionContext = null;
  }

  /**
   * Rolls back the transaction.
   */
  async rollback(): Promise<void> {
    if (!this.transactionContext) {
      throw new Error(
        "No transaction context found. Did you forget to call initialize?",
      );
    }

    // Rollback is implicit by not completing the tx block
    this.transactionContext = null;
  }
}
