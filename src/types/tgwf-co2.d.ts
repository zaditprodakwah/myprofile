declare module '@tgwf/co2' {
  export class co2 {
    constructor(options?: Record<string, unknown>);
    perByte(bytes: number, green?: boolean): number;
    perPage(bytes: number, green?: boolean): number;
  }
}
