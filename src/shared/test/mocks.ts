import { Mocked } from "@suites/doubles.jest";
import { HeadersDTO } from "../dto";

export function createMockHeaders(overrides?: Partial<HeadersDTO>): HeadersDTO {
  return {
    lang: "en-us",
    authorization: "Bearer mock-test-token",
    ...overrides,
  };
}

export function mockClass<T extends new (...args: ConstructorParameters<T>) => InstanceType<T>>(
  cls: T,
): Mocked<InstanceType<T>> {
  const instance: Partial<Record<keyof InstanceType<T>, unknown>> = {};

  for (const key of Object.getOwnPropertyNames(cls.prototype)) {
    if (key !== "constructor") {
      instance[key] = jest.fn();
    }
  }

  return instance as Mocked<InstanceType<T>>;
}
