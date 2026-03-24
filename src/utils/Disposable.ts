import { unitOfWorkContext } from '@/databases/unit-of-work/unitOfWorkContext';
export function using(
  contextFactory: () => Promise<unitOfWorkContext>,
): <T>(action: (context: unitOfWorkContext) => Promise<T>) => Promise<T> {
  return async <T>(
    action: (context: unitOfWorkContext) => Promise<T>,
  ): Promise<T> => {
    const context = await contextFactory();
    try {
      return await action(context);
    } catch (error) {
      await context.rollbackChanges();
      throw error;
    } finally {
      await context.dispose();
    }
  };
}
