import { Launch } from './index';

declare global {
  interface HTMLDivElement {
    navigateToLaunch?: (launch: Launch) => void;
  }
}

export {};