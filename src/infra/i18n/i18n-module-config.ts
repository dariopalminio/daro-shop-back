import {
    AcceptLanguageResolver,
    CookieResolver,
    HeaderResolver,
    I18nModule,
    QueryResolver,
  } from 'nestjs-i18n';

  //import {
  //  I18nJsonParser
  //} from 'nestjs-i18n';

  import * as path from 'path';
  
  /*
  export const I18nModuleConfig = I18nModule.forRootAsync({
    useFactory: () => {
      return {
        fallbackLanguage: 'es',
        parserOptions: {
          path: path.join(__dirname, '../../../src/domain/i18n/'),
        },
      };
    },
    parser: I18nJsonParser,
    resolvers: [
      { use: QueryResolver, options: ['lang', 'locale', 'l'] },
      new HeaderResolver(['x-custom-lang']),
      AcceptLanguageResolver,
      new CookieResolver(['lang', 'locale', 'l']),
    ],
  });
  */

  export const I18nModuleConfig = I18nModule.forRoot({
    fallbackLanguage: 'es',
    loaderOptions: {
      path: path.join(__dirname, '../../../src/domain/i18n/'),
      watch: true,
    },
    resolvers: [
      { use: QueryResolver, options: ['lang', 'locale', 'l']},
      AcceptLanguageResolver,
      new HeaderResolver(['x-custom-lang']),
      AcceptLanguageResolver,
      new CookieResolver(['lang', 'locale', 'l']),
    ],
  });