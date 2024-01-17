declare namespace AppLessNamespace {
  export interface IAppLess {
    app: string;
    imgBox: string;
    title: string;
  }
}

declare const AppLessModule: AppLessNamespace.IAppLess & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: AppLessNamespace.IAppLess;
};

export = AppLessModule;
