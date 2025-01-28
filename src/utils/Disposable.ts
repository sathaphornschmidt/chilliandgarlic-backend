import { UnitOfWorkContext } from '@/databases/unit-of-work/unitOfWorkContext';
export function using(
  contextFactory: () => Promise<UnitOfWorkContext>,
): <T>(action: (context: UnitOfWorkContext) => Promise<T>) => Promise<T> {
  return async <T>(
    action: (context: UnitOfWorkContext) => Promise<T>,
  ): Promise<T> => {
    const context = await contextFactory();
    try {
      return await action(context);
    } catch {
      await context.rollbackChanges();
    } finally {
      await context.dispose();
    }
  };
}
