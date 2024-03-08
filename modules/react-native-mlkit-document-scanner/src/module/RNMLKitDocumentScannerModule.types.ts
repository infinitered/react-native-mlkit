export enum ResultFormatOptions {
  /**
   * PDF and JPEGs.
   */
  All = "all",
  /**
   * Only videos.
   */
  PDF = "pdf",
  /**
   * Only images.
   */
  JPEG = "jpeg",
}

export enum ScannerModeOptions {
  /**
   * Full.
   */
  FULL = "full",
  /**
   * Base with filter.
   */
  BASE_WITH_FILTER = "base_with_filter",
  /**
   * Base.
   */
  BASE = "base",
}

export type DocumentScannerOptions = {
  /**
   * The maximum number of pages that can be scanned.
   *
   * @default 1
   */
  pageLimit?: number;
  /**
   * Can allow the user to choose images from gallery or force new photograph.
   *
   * @default true
   */
  galleryImportAllowed?: boolean;
  /**
   * The mode of the scanner.
   *
   * @default RNMLKitDocumentScanner.ScannerModeOptions.FULL
   */
  scannerMode?: ScannerModeOptions;
  /**
   * The desired result formats of the scanned documents.
   * @default RNMLKitDocumentScanner.ResultFormatOptions.JPEG
   */
  resultFormats?: ResultFormatOptions;
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
