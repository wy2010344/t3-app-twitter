type AsyncReturnType<T> = T extends (...vs: any[]) => Promise<infer M> ? M : never

type OrArrayMember<T> = T extends Array<infer M> ? M : never

type NotNull<T> = T extends null ? never : T