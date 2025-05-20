abstract class BaseTransferManager {
  abstract transfer(from: any, progressCallback?: (found: number, total: number) => void): Promise<any>;
  abstract constructQuery(track: string, album: string, artist: string): string;
}

export class TransferManager extends BaseTransferManager {
  transfer(from: any, progressCallback?: (found: number, total: number) => void): Promise<any> {
    throw new Error("Method not implemented.");
  }

  constructQuery(track: string, album?: string, artist?: string): string {
    let query = track;

    if (album && artist) {
      query += ` from ${album} by ${artist}`;
    } else if (artist) {
      query += ` by ${artist}`;
    } else if (album) {
      query += ` from ${album}`;
    }

    return query;
  }
}
