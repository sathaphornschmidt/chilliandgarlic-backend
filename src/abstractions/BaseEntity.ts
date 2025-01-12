export abstract class BaseEntity<T > {
  constructor(base: T) {
    Object.assign(this, base);
  }

  /**
   * Convert the current instance to its interface representation.
   * This should be implemented by derived classes to include their unique fields.
   */
  abstract toEntity(): T;

  /**
   * Create an instance of a derived class from a plain object.
   * This should be implemented by derived classes.
   */
  static fromEntity<U extends BaseEntity<T>, T>(
    this: new (data: T) => U,
    data: T,
  ): U {
    return new this(data);
  }

  static toResponseEnvelope<U extends BaseEntity<T>, T>(
    data: U | U[],
    singularKey: string,
    pluralKey: string,
  ): Record<string, T | T[]> {
    if (Array.isArray(data)) {
      return { [pluralKey]: data.map((item) => item.toEntity()) };
    } else {
      return { [singularKey]: data.toEntity() };
    }
  }
}
