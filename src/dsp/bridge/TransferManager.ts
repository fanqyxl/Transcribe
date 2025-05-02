export abstract class TransferManager {
  abstract transfer(from: any, progressCallback?: (found: number, total: number) => void): Promise<any>;
}
