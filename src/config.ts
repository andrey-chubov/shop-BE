import 'dotenv/config';

const maxAgeOneMonth = 30 * 24 * 60 * 60 * 1000;
const maxAgeSevenDays = 7 * 24 * 60 * 60 * 1000;
const maxAgeOneDay = 24 * 60 * 60 * 1000;

export default {
  port: process.env.PORT,
  host: process.env.DB_URL,
  access_key: process.env.JWT_ACCESS_SECRET,
  refresh_key: process.env.JWT_REFRESH_SECRET,
  pathToMulter: process.env.PATH_TO_MULTER,
  bcryptSalt: 10,

  REFRESH_PARAMETR: {
    maxAge: maxAgeOneMonth,
    httpOnly: true,
  },

  ACCESS_PARAMETR_ADMIN: {
    maxAge: maxAgeOneDay,
    httpOnly: true,
  },

  ACCESS_PARAMETR: {
    maxAge: maxAgeSevenDays,
    httpOnly: true,
  },

  authMail: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secureMail: false,

  serviceMail: process.env.SMTP_SERVICE,

  hostClient: process.env.CLIENT_API,

  fromMail: process.env.SMTP_USER,

  defaultLimitPagination: 20,

  defaultPagePagination: 1,

  maxLimitOfPagination: 100,

  minLimitOrPageOfPagination: 1,

  limitPagination: 10,

  maxCountImagesProducts: 5,

  maxCountImageCategory: 1,

  regExpImageType: /\.(jpg|jpeg|png|gif)$/,

  defaultAmountProductInCart: 1,
};
