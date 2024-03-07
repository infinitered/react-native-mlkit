export type DocumentScannerOptions = {
  pageLimit?: number;
};

/**
 * Type representing successful and canceled pick result.
 */
export type DocumentScannerResult =
  | DocumentScannerSuccessResult
  | DocumentScannerCanceledResult;

export type DocumentScannerSuccessResult = {
  /**
   * Boolean flag set to `false` showing that the request was successful.
   */
  canceled: false;
  /**
   * PDF scan result.
   */
  pdf: DocumentScannerPdf | null;
  /**
   * Page scan result.
   */
  pages: DocumentScannerPage[] | null;
};

/**
 * Type representing canceled pick result.
 */
export type DocumentScannerCanceledResult = {
  /**
   * Boolean flag set to `true` showing that the request was canceled.
   */
  canceled: true;
  /**
   * `null` signifying that the request was canceled.
   */
  pdf: null;
  /**
   * `null` signifying that the request was canceled.
   */
  pages: null;
};

export type DocumentScannerPdf = {
  uri: string;
  pageCount: number;
};

export type DocumentScannerPage = {
  uri: string;
};
