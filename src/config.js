// config.js
// إعدادات API - غيّر FASTAPI_URL حسب بيئتك
// محاكي Android : 'http://10.0.2.2:8000'
// محاكي iOS     : 'http://127.0.0.1:8000'
// جهاز حقيقي   : 'http://192.168.X.X:8000'

const ENV = {
  FASTAPI_URL: 'http://192.168.1.10:8000',
};

export default ENV;
