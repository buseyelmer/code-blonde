import { Device } from "node-hid";

declare global {
  interface String {
    toTry(): string;
    weightTypeToText(): string;
    ddMMyyyy(): string;
    storageUrl(): string;
    letterInitial(): string;
  }
  interface Date {
    ddMMyyyy(): string;
  }
  interface Number {
    toTry(): string;
  }
  interface Array<T> {
    getName: () => string;
    getSlug: () => string;
  }
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
    fbq?: (event: string, action: string, data: any) => void;
  }

}

export { };



