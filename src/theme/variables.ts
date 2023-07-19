import { css, SerializedStyles } from "@emotion/react";

export const baseVariables = css`
  // Ionic Variables and Theming. For more info, please see:
  // http://ionicframework.com/docs/theming/

  // Ionic CSS Variables
  :root {
    --ion-text-color: #000;

    /** primary **/
    --ion-color-primary: #3880ff;
    --ion-color-primary-rgb: 56, 128, 255;
    --ion-color-primary-contrast: #ffffff;
    --ion-color-primary-contrast-rgb: 255, 255, 255;
    --ion-color-primary-shade: #3171e0;
    --ion-color-primary-tint: #4c8dff;

    /** secondary **/
    --ion-color-secondary: #3dc2ff;
    --ion-color-secondary-rgb: 61, 194, 255;
    --ion-color-secondary-contrast: #ffffff;
    --ion-color-secondary-contrast-rgb: 255, 255, 255;
    --ion-color-secondary-shade: #36abe0;
    --ion-color-secondary-tint: #50c8ff;

    /** tertiary **/
    --ion-color-tertiary: #5260ff;
    --ion-color-tertiary-rgb: 82, 96, 255;
    --ion-color-tertiary-contrast: #ffffff;
    --ion-color-tertiary-contrast-rgb: 255, 255, 255;
    --ion-color-tertiary-shade: #4854e0;
    --ion-color-tertiary-tint: #6370ff;

    /** success **/
    --ion-color-success: #2dd36f;
    --ion-color-success-rgb: 45, 211, 111;
    --ion-color-success-contrast: #ffffff;
    --ion-color-success-contrast-rgb: 255, 255, 255;
    --ion-color-success-shade: #28ba62;
    --ion-color-success-tint: #42d77d;

    /** warning **/
    --ion-color-warning: #ffc409;
    --ion-color-warning-rgb: 255, 196, 9;
    --ion-color-warning-contrast: #000000;
    --ion-color-warning-contrast-rgb: 0, 0, 0;
    --ion-color-warning-shade: #e0ac08;
    --ion-color-warning-tint: #ffca22;

    /** danger **/
    --ion-color-danger: #eb445a;
    --ion-color-danger-rgb: 235, 68, 90;
    --ion-color-danger-contrast: #ffffff;
    --ion-color-danger-contrast-rgb: 255, 255, 255;
    --ion-color-danger-shade: #cf3c4f;
    --ion-color-danger-tint: #ed576b;

    /** dark **/
    --ion-color-dark: #222428;
    --ion-color-dark-rgb: 34, 36, 40;
    --ion-color-dark-contrast: #ffffff;
    --ion-color-dark-contrast-rgb: 255, 255, 255;
    --ion-color-dark-shade: #1e2023;
    --ion-color-dark-tint: #383a3e;

    /** medium **/
    --ion-color-medium: #92949c;
    --ion-color-medium-rgb: 146, 148, 156;
    --ion-color-medium-contrast: #ffffff;
    --ion-color-medium-contrast-rgb: 255, 255, 255;
    --ion-color-medium-shade: #808289;
    --ion-color-medium-tint: #9d9fa6;

    --ion-color-medium2: var(--ion-color-medium);

    /** light **/
    --ion-color-light: #f4f5f8;
    --ion-color-light-rgb: 244, 245, 248;
    --ion-color-light-contrast: #000000;
    --ion-color-light-contrast-rgb: 0, 0, 0;
    --ion-color-light-shade: #d7d8da;
    --ion-color-light-tint: #f5f6f9;

    --lightroom-bg: rgba(0, 0, 0, 0.08);

    --thick-separator-color: var(--ion-color-step-50, #f2f2f7);

    --ion-color-step-100: #f3f3f3;

    --unread-item-background-color: #fffcd9;

    --ion-color-text-aside: rgba(0, 0, 0, 0.55);

    --read-color: rgba(0, 0, 0, 0.45);
    --read-color-medium: rgba(0, 0, 0, 0.4);
  }

  .ios body {
    --ion-background-color: #fff;
  }

  .ios ion-modal {
    --ion-background-color: var(--ion-color-step-50, #f2f2f7);
    --ion-item-background: #fff;
  }
`;

type Theme = {
  [key: string]: SerializedStyles;
};

export const themes: Theme = {
  light: css`
    :root.ios .grey-bg {
      --ion-background-color: var(--ion-color-step-50, #f2f2f7);
    }
    :root.ios .grey-bg ion-header {
      --opacity: 0;
    }
    :root.ios .grey-bg ion-modal ion-content {
      --background: #fff;
    }
    :root.ios .grey-bg ion-item {
      --ion-background-color: #fff;
    }
    :root.ios .grey-bg ion-item-sliding {
      background: #fff;
    }
  `,
  dark: css`
    // Dark Colors
    :root {
      --lightroom-bg: rgba(255, 255, 255, 0);
    }

    body {
      --ion-color-primary: #428cff;
      --ion-color-primary-rgb: 66, 140, 255;
      --ion-color-primary-contrast: #ffffff;
      --ion-color-primary-contrast-rgb: 255, 255, 255;
      --ion-color-primary-shade: #3a7be0;
      --ion-color-primary-tint: #5598ff;

      --ion-color-secondary: #50c8ff;
      --ion-color-secondary-rgb: 80, 200, 255;
      --ion-color-secondary-contrast: #ffffff;
      --ion-color-secondary-contrast-rgb: 255, 255, 255;
      --ion-color-secondary-shade: #46b0e0;
      --ion-color-secondary-tint: #62ceff;

      --ion-color-tertiary: #6a64ff;
      --ion-color-tertiary-rgb: 106, 100, 255;
      --ion-color-tertiary-contrast: #ffffff;
      --ion-color-tertiary-contrast-rgb: 255, 255, 255;
      --ion-color-tertiary-shade: #5d58e0;
      --ion-color-tertiary-tint: #7974ff;

      --ion-color-success: #2fdf75;
      --ion-color-success-rgb: 47, 223, 117;
      --ion-color-success-contrast: #000000;
      --ion-color-success-contrast-rgb: 0, 0, 0;
      --ion-color-success-shade: #29c467;
      --ion-color-success-tint: #44e283;

      --ion-color-warning: #ffd534;
      --ion-color-warning-rgb: 255, 213, 52;
      --ion-color-warning-contrast: #000000;
      --ion-color-warning-contrast-rgb: 0, 0, 0;
      --ion-color-warning-shade: #e0bb2e;
      --ion-color-warning-tint: #ffd948;

      --ion-color-danger: #ff4961;
      --ion-color-danger-rgb: 255, 73, 97;
      --ion-color-danger-contrast: #ffffff;
      --ion-color-danger-contrast-rgb: 255, 255, 255;
      --ion-color-danger-shade: #e04055;
      --ion-color-danger-tint: #ff5b71;

      --ion-color-dark: #f4f5f8;
      --ion-color-dark-rgb: 244, 245, 248;
      --ion-color-dark-contrast: #000000;
      --ion-color-dark-contrast-rgb: 0, 0, 0;
      --ion-color-dark-shade: #d7d8da;
      --ion-color-dark-tint: #f5f6f9;

      --ion-color-medium: #989aa2;
      --ion-color-medium-rgb: 152, 154, 162;
      --ion-color-medium-contrast: #000000;
      --ion-color-medium-contrast-rgb: 0, 0, 0;
      --ion-color-medium-shade: #86888f;
      --ion-color-medium-tint: #a2a4ab;

      --ion-color-medium2: rgb(112, 113, 120);

      --ion-color-light: #222428;
      --ion-color-light-rgb: 34, 36, 40;
      --ion-color-light-contrast: #ffffff;
      --ion-color-light-contrast-rgb: 255, 255, 255;
      --ion-color-light-shade: #1e2023;
      --ion-color-light-tint: #383a3e;

      --thick-separator-color: #0d0e0f;

      --unread-item-background-color: #1e1c00;

      --ion-color-text-aside: rgba(255, 255, 255, 0.65);

      --read-color: rgba(255, 255, 255, 0.6);
      --read-color-medium: rgba(255, 255, 255, 0.4);
    }

    // iOS Dark Theme

    .ios body {
      --ion-background-color: #1a1b1c;
      --ion-background-color-rgb: 26, 27, 28;

      --ion-text-color: #ddd;
      --ion-text-color-rgb: 221, 221, 221;

      --ion-color-step-50: #242526;
      --ion-color-step-100: #242526;
      --ion-color-step-150: #373839;
      --ion-color-step-200: #414243;
      --ion-color-step-250: #4b4c4c;
      --ion-color-step-300: #555556;
      --ion-color-step-350: #5e5f60;
      --ion-color-step-400: #686969;
      --ion-color-step-450: #727273;
      --ion-color-step-500: #7c7c7d;
      --ion-color-step-550: #858686;
      --ion-color-step-600: #8f8f90;
      --ion-color-step-650: #999999;
      --ion-color-step-700: #a3a3a3;
      --ion-color-step-750: #acadad;
      --ion-color-step-800: #b6b6b6;
      --ion-color-step-850: #c0c0c0;
      --ion-color-step-900: #cacaca;
      --ion-color-step-950: #d3d3d3;

      --ion-toolbar-background: var(--ion-color-step-50);

      --ion-tab-bar-background: var(--ion-color-step-50);
    }

    .ios ion-modal {
      --ion-background-color: var(--ion-color-step-50);
      --ion-toolbar-background: var(--ion-color-step-50);
      --ion-toolbar-border-color: var(--ion-color-step-150);
      --ion-item-background: var(--ion-color-step-50);
    }

    // Material Design Dark Theme

    .md body {
      --ion-background-color: #1a1b1c;
      --ion-background-color-rgb: 26, 27, 28;

      --ion-text-color: #ddd;
      --ion-text-color-rgb: 221, 221, 221;

      --ion-color-step-50: #242526;
      --ion-color-step-100: #2e2e2f;
      --ion-color-step-150: #373839;
      --ion-color-step-200: #414243;
      --ion-color-step-250: #4b4c4c;
      --ion-color-step-300: #555556;
      --ion-color-step-350: #5e5f60;
      --ion-color-step-400: #686969;
      --ion-color-step-450: #727273;
      --ion-color-step-500: #7c7c7d;
      --ion-color-step-550: #858686;
      --ion-color-step-600: #8f8f90;
      --ion-color-step-650: #999999;
      --ion-color-step-700: #a3a3a3;
      --ion-color-step-750: #acadad;
      --ion-color-step-800: #b6b6b6;
      --ion-color-step-850: #c0c0c0;
      --ion-color-step-900: #cacaca;
      --ion-color-step-950: #d3d3d3;

      --ion-toolbar-background: var(--ion-color-step-50);

      --ion-tab-bar-background: var(--ion-color-step-50);
    }

    @media (max-width: 767px) {
      .ios ion-modal:not(.small) {
        --ion-background-color: #1a1b1c;
        --ion-toolbar-background: var(--ion-background-color);
        --ion-toolbar-border-color: var(--ion-color-step-150);
      }
    }
  `,
  black: css`
    // Dark Colors
    :root {
      --lightroom-bg: rgba(255, 255, 255, 0.08);
    }

    body {
      --ion-color-primary: #428cff;
      --ion-color-primary-rgb: 66, 140, 255;
      --ion-color-primary-contrast: #ffffff;
      --ion-color-primary-contrast-rgb: 255, 255, 255;
      --ion-color-primary-shade: #3a7be0;
      --ion-color-primary-tint: #5598ff;

      --ion-color-secondary: #50c8ff;
      --ion-color-secondary-rgb: 80, 200, 255;
      --ion-color-secondary-contrast: #ffffff;
      --ion-color-secondary-contrast-rgb: 255, 255, 255;
      --ion-color-secondary-shade: #46b0e0;
      --ion-color-secondary-tint: #62ceff;

      --ion-color-tertiary: #6a64ff;
      --ion-color-tertiary-rgb: 106, 100, 255;
      --ion-color-tertiary-contrast: #ffffff;
      --ion-color-tertiary-contrast-rgb: 255, 255, 255;
      --ion-color-tertiary-shade: #5d58e0;
      --ion-color-tertiary-tint: #7974ff;

      --ion-color-success: #2fdf75;
      --ion-color-success-rgb: 47, 223, 117;
      --ion-color-success-contrast: #000000;
      --ion-color-success-contrast-rgb: 0, 0, 0;
      --ion-color-success-shade: #29c467;
      --ion-color-success-tint: #44e283;

      --ion-color-warning: #ffd534;
      --ion-color-warning-rgb: 255, 213, 52;
      --ion-color-warning-contrast: #000000;
      --ion-color-warning-contrast-rgb: 0, 0, 0;
      --ion-color-warning-shade: #e0bb2e;
      --ion-color-warning-tint: #ffd948;

      --ion-color-danger: #ff4961;
      --ion-color-danger-rgb: 255, 73, 97;
      --ion-color-danger-contrast: #ffffff;
      --ion-color-danger-contrast-rgb: 255, 255, 255;
      --ion-color-danger-shade: #e04055;
      --ion-color-danger-tint: #ff5b71;

      --ion-color-dark: #f4f5f8;
      --ion-color-dark-rgb: 244, 245, 248;
      --ion-color-dark-contrast: #000000;
      --ion-color-dark-contrast-rgb: 0, 0, 0;
      --ion-color-dark-shade: #d7d8da;
      --ion-color-dark-tint: #f5f6f9;

      --ion-color-medium: #989aa2;
      --ion-color-medium-rgb: 152, 154, 162;
      --ion-color-medium-contrast: #000000;
      --ion-color-medium-contrast-rgb: 0, 0, 0;
      --ion-color-medium-shade: #86888f;
      --ion-color-medium-tint: #a2a4ab;

      --ion-color-medium2: rgb(112, 113, 120);

      --ion-color-light: #222428;
      --ion-color-light-rgb: 34, 36, 40;
      --ion-color-light-contrast: #ffffff;
      --ion-color-light-contrast-rgb: 255, 255, 255;
      --ion-color-light-shade: #1e2023;
      --ion-color-light-tint: #383a3e;

      --thick-separator-color: rgba(255, 255, 255, 0.08);

      --unread-item-background-color: #1e1c00;

      --ion-color-text-aside: rgba(255, 255, 255, 0.65);

      --read-color: rgba(255, 255, 255, 0.6);
      --read-color-medium: rgba(255, 255, 255, 0.4);
    }

    // iOS Dark Theme

    .ios body {
      --ion-background-color: #000000;
      --ion-background-color-rgb: 0, 0, 0;

      --ion-text-color: #ddd;
      --ion-text-color-rgb: 255, 255, 255;

      --ion-color-step-50: #0d0d0d;
      --ion-color-step-100: #1a1a1a;
      --ion-color-step-150: #262626;
      --ion-color-step-200: #333333;
      --ion-color-step-250: #404040;
      --ion-color-step-300: #4d4d4d;
      --ion-color-step-350: #595959;
      --ion-color-step-400: #666666;
      --ion-color-step-450: #737373;
      --ion-color-step-500: #808080;
      --ion-color-step-550: #8c8c8c;
      --ion-color-step-600: #999999;
      --ion-color-step-650: #a6a6a6;
      --ion-color-step-700: #b3b3b3;
      --ion-color-step-750: #bfbfbf;
      --ion-color-step-800: #cccccc;
      --ion-color-step-850: #d9d9d9;
      --ion-color-step-900: #e6e6e6;
      --ion-color-step-950: #f2f2f2;

      --ion-item-background: #000000;

      --ion-card-background: #1c1c1d;

      --ion-toolbar-background: #000000;
    }

    .ios ion-modal {
      --ion-background-color: var(--ion-color-step-100);
      --ion-toolbar-background: var(--ion-color-step-150);
      --ion-toolbar-border-color: var(--ion-color-step-250);
      --ion-item-background: var(--ion-color-step-50);
    }

    // Material Design Dark Theme

    .md body {
      --ion-background-color: black;
      --ion-background-color-rgb: 18, 18, 18;

      --ion-text-color: #ffffff;
      --ion-text-color-rgb: 255, 255, 255;

      --ion-border-color: #222222;

      --ion-color-step-50: #121212;
      --ion-color-step-100: #2a2a2a;
      --ion-color-step-150: #363636;
      --ion-color-step-200: #414141;
      --ion-color-step-250: #4d4d4d;
      --ion-color-step-300: #595959;
      --ion-color-step-350: #656565;
      --ion-color-step-400: #717171;
      --ion-color-step-450: #7d7d7d;
      --ion-color-step-500: #898989;
      --ion-color-step-550: #949494;
      --ion-color-step-600: #a0a0a0;
      --ion-color-step-650: #acacac;
      --ion-color-step-700: #b8b8b8;
      --ion-color-step-750: #c4c4c4;
      --ion-color-step-800: #d0d0d0;
      --ion-color-step-850: #dbdbdb;
      --ion-color-step-900: #e7e7e7;
      --ion-color-step-950: #f3f3f3;

      --ion-item-background: black;

      --ion-toolbar-background: #1f1f1f;

      --ion-tab-bar-background: #1f1f1f;

      --ion-card-background: black;

      --ion-toolbar-background: #121212;
      --ion-tab-bar-background: #121212;
    }

    @media (max-width: 767px) {
      .ios ion-modal:not(.small) {
        --ion-background-color: #000;
        --ion-toolbar-background: var(--ion-background-color);
        --ion-toolbar-border-color: var(--ion-color-step-150);
      }
    }
  `,
};
